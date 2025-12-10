import {
  useNodeRender,
  type FlowNodeEntity,
} from "@flowgram.ai/fixed-layout-editor";

export function useCustomNodeData<
  T extends { name: string; description: string; icon: string }
>(node: FlowNodeEntity): T {
  const { data } = useNodeRender(node);
  const registry = node.getNodeRegistry();

  return {
    name: data.name || registry.info.description,
    description: data.description || registry.info.description,
    icon: data.icon || registry.info.icon,
  } as T;
}
