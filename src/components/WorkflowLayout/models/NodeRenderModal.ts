import type { NodeRenderReturnType } from "@flowgram.ai/fixed-layout-editor";
import { createCustomModel } from "../common/createModel";

export const NodeRenderModel = createCustomModel(
  (props: NodeRenderReturnType) => {
    return props;
  }
);

export function useNodeData(): { name: string; description: string } {
  const { node, data } = NodeRenderModel.useModel();
  const registry = node.getNodeRegistry();

  return {
    name: data.name || registry.info.description,
    description: data.description || registry.info.description,
  };
}
