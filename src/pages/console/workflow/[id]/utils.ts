import { nanoid } from "nanoid";
import type { CustomNodeData } from "./types";

export function generateCustomNodeData(data: CustomNodeData) {
  return {
    id: `custom_${nanoid(5)}`,
    type: "custom",
    data: {
      ...data,
    },
  };
}
