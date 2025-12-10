import { nanoid } from "nanoid";
import type { CustomNodeData } from "./types";
import type { FlowNodeRegistry } from "@/components/WorkflowLayout/typings";
import { defaultFormMeta } from "@/components/WorkflowLayout/nodes/default-form-meta";

export const CustomNodeRegistry: FlowNodeRegistry = {
  type: "custom",

  meta: {
    addDisable: true,
  },
  info: {
    icon: "",
    name: "自定义连接器(空节点)",
    description: "自定义连接器(空节点)描述",
  },
  formMeta: defaultFormMeta,
};

export function generateCustomNodeData(data: CustomNodeData) {
  return {
    id: `custom_${nanoid(5)}`,
    type: "custom",
    data: {
      ...data,
    },
  };
}
