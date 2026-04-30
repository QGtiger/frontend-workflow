import { useRef } from "react";
import { createCustomModel } from "@/common/createModel";
import { useBoolean, useRequest } from "ahooks";
import { lightfishRequest } from "@/api/lightfishApi";
import { useNavigate } from "react-router-dom";
import { useWorkflowId } from "./hooks";

export interface TreeNode {
  title: string;
  key: string;
  type: "folder" | "workflow";
  children?: TreeNode[];
}

export const WorkflowLayoutModel = createCustomModel(() => {
  const [collapsed, collapsedAction] = useBoolean(false);
  const loadedRef = useRef(false);
  const nav = useNavigate();
  const workflowId = useWorkflowId();

  const {
    data: treeData,
    loading,
    refresh: refreshWorkflows,
  } = useRequest(async () => {
    const tree = await lightfishRequest<TreeNode[]>("/workflow/tree/list");
    loadedRef.current = true;
    return tree;
  });

  // 只有第一次加载时才显示 loading
  const firstLoading = loading && !loadedRef.current;

  // 新建文件夹
  const { run: createFolder } = useRequest(
    async (parentKey?: string) => {
      return lightfishRequest("/workflow/tree/create", {
        method: "POST",
        data: { title: "新建文件夹", parentKey, type: "folder" },
      });
    },
    {
      manual: true,
      onSuccess: () => {
        refreshWorkflows();
      },
    },
  );

  // 重命名
  const { run: renameNode } = useRequest(
    async (key: string, title: string) => {
      return lightfishRequest("/workflow/tree/update", {
        method: "POST",
        data: { key, title },
      });
    },
    {
      manual: true,
      onSuccess: () => {
        refreshWorkflows();
      },
    },
  );

  // 删除
  const { run: deleteWorkflow } = useRequest(
    async (key: string) => {
      return lightfishRequest("/workflow/tree/delete", {
        method: "POST",
        data: { key },
      }).then(() => {
        // 删除当前workflow 就跳转到 通用页面
        if (key === workflowId) {
          nav("/console/workflow");
        }
      });
    },
    {
      manual: true,
      onSuccess: () => {
        refreshWorkflows();
      },
    },
  );

  return {
    collapsed,
    collapsedAction,
    treeData,
    firstLoading,
    createFolder,
    renameNode,
    deleteWorkflow,
    refreshWorkflows,
  };
});
