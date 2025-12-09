import type { FlowNodeEntity } from "@flowgram.ai/fixed-layout-editor";
import { createCustomModel } from "../common/createModel";
import type { FlowNodeJSON, FlowNodeRegistry } from "../typings";

export interface WorkflowLayoutEditorModelProps {
  nodes: FlowNodeJSON[];
  onNodesChange: (nodes: FlowNodeJSON[]) => void;
  onAddNode?: (config: {
    builtInNodes: FlowNodeRegistry[];
    from: FlowNodeEntity;
  }) => void;
}

export const WorkflowLayoutEditorModel = createCustomModel(
  (props: WorkflowLayoutEditorModelProps) => {
    return props;
  }
);
