import {
  type FlowNodeJSON as FlowNodeJSONDefault,
  type FlowNodeRegistry as FlowNodeRegistryDefault,
  FixedLayoutPluginContext,
  FlowNodeEntity,
  type FlowNodeMeta as FlowNodeMetaDefault,
} from "@flowgram.ai/fixed-layout-editor";

/**
 * You can customize the data of the node, and here you can use JsonSchema to define the input and output of the node
 * 你可以自定义节点的 data 业务数据, 这里演示 通过 JsonSchema 来定义节点的输入/输出
 */
interface FlowBaseNodeJSON extends FlowNodeJSONDefault {
  data: {
    // 节点名称
    name: string;
    [x: string]: any;
  };
}

export type FlowNodeJSON = FlowBaseNodeJSON;

/**
 * You can customize your own node meta
 * 你可以自定义节点的meta
 */
export interface FlowNodeMeta extends FlowNodeMetaDefault {
  sidebarDisable?: boolean;
  style?: React.CSSProperties;
}
/**
 * You can customize your own node registry
 * 你可以自定义节点的注册器
 */
export interface FlowNodeRegistry extends FlowNodeRegistryDefault {
  meta?: FlowNodeMeta;
  info: {
    icon: string;
    name: string;
    description: string;
  };
  canAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
  canDelete?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => boolean;
  onAdd?: (opts?: {
    ctx?: FixedLayoutPluginContext;
    from?: FlowNodeEntity;
    extraData?: Record<string, any>;
  }) => FlowNodeJSON;
}

export type FlowDocumentJSON = {
  nodes: FlowNodeJSON[];
};
