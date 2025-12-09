import { createCustomModel } from "@/common/createModel";
import type { FlowNodeJSON } from "@/components/WorkflowLayout/typings";
import { useRequest } from "ahooks";
import { useLayoutEffect } from "react";
import { useParams } from "react-router-dom";

export type WorkflowDetailData = {
  nodes: FlowNodeJSON[];
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // 状态，draft: 草稿，published: 已发布，unpublished: 未发布
  status: "draft" | "published" | "unpublished";
};

export const WorkflowDetailModel = createCustomModel(() => {
  const { id } = useParams();

  useLayoutEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const { data, loading } = useRequest(
    async (): Promise<WorkflowDetailData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO 查询接口
      return {
        nodes: [
          {
            id: "start_0",
            type: "start",
            blocks: [],
            data: {
              name: "Start",
            },
          },
          {
            id: "end_0",
            type: "end",
            blocks: [],
            data: {
              name: "End",
            },
          },
        ],
        name: "Workflow 1",
        description: "Workflow 1 description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "unpublished",
      };
    },
    {
      refreshDeps: [id],
    }
  );

  return {
    workflowId: id,
    loading,
    workflowData: data,
  };
});
