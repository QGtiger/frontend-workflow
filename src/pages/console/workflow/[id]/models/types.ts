import type { FlowNodeJSON } from "@flowgram.ai/fixed-layout-editor";

export type WorkflowNode = FlowNodeJSON;

export type WorkflowDetailData = {
  nodes: WorkflowNode[];
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // 状态，draft: 草稿，published: 已发布，unpublished: 未发布
  status: "draft" | "published" | "unpublished";
  id: string;
};

export type WorkflowNoes = WorkflowNode[];
