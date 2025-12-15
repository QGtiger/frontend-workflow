export type NodeInputValue = {
  value?: any;
  label?: string;
  type?: string;
  // 是否是表达式
  isExpression?: boolean;
};

type NodeInputs = Record<string, NodeInputValue>;

interface OutputStructItem {
  name: string;
  type: string;
  label: string;
  children?: OutputStructItem[];
}

export type CustomNodeData = {
  icon: string;
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
  inputs?: NodeInputs;
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
