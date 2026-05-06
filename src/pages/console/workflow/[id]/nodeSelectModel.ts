import { createCustomModel } from "@/common/createModel";
import { useBoolean } from "ahooks";
import { useState } from "react";

export const NodeSelectModel = createCustomModel(() => {
  const [selectedId, setSelectedId] = useState("");
  const [showPanelFlag, showPanelFlagAction] = useBoolean(false);

  const showPanel = (id: string) => {
    showPanelFlagAction.setTrue();
    setSelectedId(id);
  };

  const closePanel = () => {
    showPanelFlagAction.setFalse();
    setTimeout(() => {
      setSelectedId("");
    }, 300);
  };

  return {
    selectedId,
    showPanelFlag,
    setSelectedId,
    closePanel,
    showPanel,
  };
});
