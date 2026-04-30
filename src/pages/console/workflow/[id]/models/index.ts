import { createCustomModel } from "@/common/createModel";

import { useRequest } from "ahooks";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import type { NodeOutputStructItem } from "../types";
import { message, Modal } from "antd";
import type { WorkflowDetailData, WorkflowNoes } from "./types";
import { checkNameIsExist, trarverseNodes } from "./utils";
import { lightfishRequest } from "@/api/lightfishApi";

export const WorkflowDetailModel = createCustomModel(() => {
  const { id } = useParams();
  const nav = useNavigate();
  const latestNodesRef = useRef<WorkflowNoes | null>(null);
  const isRouterBlockPassRef = useRef(false);

  useLayoutEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const { data, loading, error } = useRequest(
    async (): Promise<WorkflowDetailData> => {
      const wfData = await lightfishRequest<WorkflowDetailData>(
        `/workflow/meta/${id}`,
      );
      latestNodesRef.current = wfData.nodes;
      return wfData;
    },
    {
      refreshDeps: [id],
    },
  );

  const { runAsync: updateWorkflowNodes } = useRequest(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    {
      manual: true,
    },
  );

  const checkChange = useCallback(() => {
    const latestNodes = latestNodesRef.current;
    if (!latestNodes || !data) {
      return;
    }
    if (JSON.stringify(latestNodes) !== JSON.stringify(data?.nodes)) {
      return true;
    }
  }, [data]);

  useBlocker(({ nextLocation }) => {
    if (isRouterBlockPassRef.current) return false;
    if (checkChange()) {
      const go = () => {
        isRouterBlockPassRef.current = true;
        nav(nextLocation);
      };
      Modal.confirm({
        icon: null,
        title: "当前改动未保存",
        content: "切换页面未保存内容较会丢失, 是否保存已编辑内容",
        okText: "保存并跳转",
        cancelText: "不保存跳转",
        async onOk() {
          return updateWorkflowNodes().then(go);
        },
        onCancel: go,
      });
      return true;
    }
    return false;
  });

  const getUniqueName = (name: string) => {
    const latestNodes = latestNodesRef.current;
    if (!latestNodes) {
      return name;
    }

    let baseName = name.trim();
    if (!baseName) throw new Error("name is empty");
    while (true) {
      if (!checkNameIsExist(baseName, latestNodes)) {
        return baseName;
      }
      const lastChar = baseName.at(-1);
      if (lastChar && !Number.isNaN(Number(lastChar))) {
        baseName = baseName.slice(0, -1);
      }
      const n = lastChar ? (Number.parseInt(lastChar) || 0) + 1 : "";
      baseName = `${baseName}${n}`;
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkChange()) {
        e.preventDefault();
        e.returnValue = "您有未保存的节点配置错误，确定要离开吗？";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [checkChange]);

  return {
    workflowId: id,
    loading,
    workflowData: data!,
    updateNodes: (latestNodes: WorkflowNoes) => {
      latestNodesRef.current = latestNodes;
    },
    getUniqueName,
    error,
  };
});
