import { createCustomModel } from "@/common/createModel";
import { useBoolean, useRequest } from "ahooks";

export const WorkflowLayoutModel = createCustomModel(() => {
  const [collapsed, collapsedAction] = useBoolean(false);

  const { data, loading } = useRequest(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return [
      { id: "1", name: "数据处理流程" },
      { id: "2", name: "用户注册流程" },
      { id: "3", name: "订单审批流程" },
    ];
  });

  return {
    collapsed,
    collapsedAction,
    workflows: data,
    loading,
  };
});
