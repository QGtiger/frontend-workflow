import type { OutputStructItem } from "@server/shared/connector";

export function getBuiltInRegistryOutputsSchema(
  type: string | undefined,
): OutputStructItem[] | undefined {
  if (!type) return;
  if (type === "loop") {
    return [
      {
        code: "item",
        label: "当前循环项",
        type: "object",
      },
      {
        code: "index",
        label: "当前循环索引",
        type: "number",
      },
    ];
  }

  return;
}
