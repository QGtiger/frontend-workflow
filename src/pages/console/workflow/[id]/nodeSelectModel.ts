import { createCustomModel } from "@/common/createModel";
import { useState } from "react";

export const NodeSelectModel = createCustomModel(() => {
  const [selectedId, setSelectedId] = useState("");

  return {
    selectedId,
    setSelectedId,
  };
});
