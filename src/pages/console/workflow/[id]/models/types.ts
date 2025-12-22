import type { FlowNodeJSON } from "@flowgram.ai/fixed-layout-editor";
import type { CustomNodeData } from "../types";

export interface WorkflowNode extends FlowNodeJSON {
  data:
    | {
        // 节点名称
        name: string;
        [x: string]: any;
      }
    | CustomNodeData;
  blocks?: WorkflowNode[];
}

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
