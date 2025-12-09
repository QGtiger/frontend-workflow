import { createCustomModel } from "@/common/createModel";
import { useBoolean } from "ahooks";

export const WorkflowLayoutModel = createCustomModel(() => {
  const [collapsed, collapsedAction] = useBoolean(false);

  return {
    collapsed,
    collapsedAction,
  };
});
