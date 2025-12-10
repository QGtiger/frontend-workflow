import type { NodeRenderReturnType } from "@flowgram.ai/fixed-layout-editor";
import { createCustomModel } from "../common/createModel";

export const NodeRenderModel = createCustomModel(
  (props: NodeRenderReturnType) => {
    return props;
  }
);

export function useNodeData<
  T extends { name: string; description: string; icon: string }
>(): T {
  const { node, data } = NodeRenderModel.useModel();
  const registry = node.getNodeRegistry();

  return {
    name: data.name || registry.info.description,
    description: data.description || registry.info.description,
    icon: data.icon || registry.info.icon,
  } as T;
}
