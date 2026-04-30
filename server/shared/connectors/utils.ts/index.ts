import { OutputStructItem } from "../../connector";

export function generateTriggerOutputs(
  d: OutputStructItem[],
): OutputStructItem[] {
  return [
    {
      code: "triggerData",
      type: "object",
      label: "触发数据",
      children: d,
    },
    {
      code: "triggerTime",
      type: "number",
      label: "触发时间(时间戳)",
    },
    {
      code: "runId",
      type: "string",
      label: "运行ID",
    },
  ];
}
