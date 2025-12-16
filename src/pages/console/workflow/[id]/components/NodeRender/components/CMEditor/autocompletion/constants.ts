import type { Completion } from "@codemirror/autocomplete";
import { RECOMMENDED_SECTION } from "./utils/SectionHeader";
import { createInfoBoxRenderer } from "./utils/CreateInfoBox";

export const ROOT_DOLLAR_COMPLETIONS: Completion[] = [
  {
    label: "$vars",
    section: RECOMMENDED_SECTION,
    info: createInfoBoxRenderer({
      name: "$vars",
      returnType: "Object",
      description: "当前工作流的全局变量对象",
      docURL: "https://www.baidu.com",
    }),
  },
  {
    label: "$workflow",
    section: RECOMMENDED_SECTION,
    info: createInfoBoxRenderer({
      name: "$flowId",
      returnType: "String",
      description: "当前工作流的 ID",
    }),
  },
  {
    label: "$now",
    section: RECOMMENDED_SECTION,
    info: createInfoBoxRenderer({
      name: "$now",
      returnType: "Date",
      description: "当前工作流执行时间",
      docURL: "",
    }),
  },
];
