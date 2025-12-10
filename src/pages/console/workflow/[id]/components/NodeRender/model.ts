import { createCustomModel } from "@/common/createModel";
import type { FlowNodeRegistry } from "@/components/WorkflowLayout/typings";
import {
  useNodeRender,
  type FlowNodeEntity,
} from "@flowgram.ai/fixed-layout-editor";

export const CustomNodeRenderModel = createCustomModel(
  (props: {
    node: FlowNodeEntity;
    isSideBar?: boolean;
    registry: FlowNodeRegistry;
  }) => {
    const nodeRender = useNodeRender(props.node);
    return {
      ...props,
      nodeRender,
    };
  }
);

export function useCustomNodeData<
  T extends { name: string; description: string; icon: string }
>(): T {
  const {
    registry,
    nodeRender: { data },
  } = CustomNodeRenderModel.useModel();

  return {
    name: data.name || registry.info.description,
    description: data.description || registry.info.description,
    icon: data.icon || registry.info.icon,
  } as T;
}
