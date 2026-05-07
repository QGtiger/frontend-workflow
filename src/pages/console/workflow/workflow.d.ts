type NodeInputValue = {
  value?: any;
  label?: string;
  type?: string;
  expression?: string;
  // 是否是表达式
  isExpression?: boolean;
};

interface NodeOutputStructItem {
  code: string;
  type: string;
  label: string;
  children?: NodeOutputStructItem[];
}

type WorkflowNodeBlock = WorkflowBuiltInBlock | WorkflowAppNodeBlock;

type WorkflowBuiltInBlock = {
  id: string;
  // 后续拓展
  type:
    | "end"
    | "switch"
    | "case"
    | "caseDefault"
    | "loop"
    | "breakLoop"
    | "tryCatch"
    | "catchBlock"
    | "if"
    | "ifBlock";
  blocks: WorkflowNodeBlock[];
  data: {
    // 节点名称
    name?: string;
    // 节点描述
    description?: string;
    // 节点参数
    inputs?: NodeInputs;
  };
};

type WorkflowAppNodeBlock = {
  id: string;
  // 后续拓展
  type: "start" | "custom";
  blocks: WorkflowNodeBlock[];
  data: {
    icon: string;
    // 节点名称
    name: string;
    // 节点描述
    description?: string;
    // 节点连接器代码
    connectorCode: string;
    // 节点动作代码
    actionCode: string;
    // 节点版本
    version: string;
    // 节点参数
    inputs?: NodeInputs;
    // 节点输出结构
    outputStruct: NodeOutputStructItem[];
  };
};
