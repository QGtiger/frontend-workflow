import {
  type FlowNodeJSON as FlowNodeJSONDefault,
  type FlowNodeRegistry as FlowNodeRegistryDefault,
  FixedLayoutPluginContext,
  FlowNodeEntity,
  type FlowNodeMeta as FlowNodeMetaDefault,
} from "@flowgram.ai/fixed-layout-editor";

type NodeInputs = Record<
  string,
  {
    value: any;
    label: string;
    type: string;
    // 是否是表达式
    isExpression?: boolean;
  }
>;

interface OutputStructItem {
  name: string;
  type: string;
  label: string;
  children?: OutputStructItem[];
}

/**
 * You can customize the data of the node, and here you can use JsonSchema to define the input and output of the node
 * 你可以自定义节点的 data 业务数据, 这里演示 通过 JsonSchema 来定义节点的输入/输出
 */
interface FlowBaseNodeJSON extends FlowNodeJSONDefault {
  data: {
    // 节点名称
    name: string;
  };
}

interface FlowCustomNodeJSON extends FlowNodeJSONDefault {
  data: {
    logo: string;
    // 节点名称
    name: string;
    // 节点描述
    description: string;
    // 节点连接器代码
    connectorCode: string;
    // 节点动作代码
    actionCode: string;
    // 节点版本
    version: number;
    // 节点参数
    inputs: NodeInputs;
    // 节点输出结构
    outputStruct?: OutputStructItem[];
    // 单步调试样本数据
    sampleData?: Record<string, any>;
    // 认证ID
    authId?: string;
    // 是否需要认证
    needAuth?: boolean;
    // 表单是否校验通过
    formValidated?: boolean;
  };
}

export type FlowNodeJSON = FlowBaseNodeJSON | FlowCustomNodeJSON;

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
  onAdd?: (ctx: FixedLayoutPluginContext, from: FlowNodeEntity) => FlowNodeJSON;
}

export type FlowDocumentJSON = {
  nodes: FlowNodeJSON[];
};
