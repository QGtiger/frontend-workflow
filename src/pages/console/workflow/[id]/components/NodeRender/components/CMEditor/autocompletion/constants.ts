import type { Completion, CompletionSection } from "@codemirror/autocomplete";
import { withSectionHeader } from "./dom";

interface DocMetadata {
  name: string;
  returnType: string;
  description: string;
  docURL?: string;
}

export const RECOMMENDED_SECTION: CompletionSection = withSectionHeader({
  name: "推荐",
  rank: 0,
});

function createInfoBoxRenderer(doc: DocMetadata) {
  return (_completion: Completion) => {
    const container = document.createElement("div");
    container.className = "autocomplete-info-container";

    // 头部：名称 + 返回类型
    const header = document.createElement("div");
    header.className = "autocomplete-info-header";

    const nameSpan = document.createElement("span");
    nameSpan.className = "autocomplete-info-name";
    nameSpan.textContent = doc.name;
    header.appendChild(nameSpan);

    if (doc.returnType) {
      const returnSpan = document.createElement("span");
      returnSpan.className = "autocomplete-info-return";
      returnSpan.textContent = `: ${doc.returnType}`;
      header.appendChild(returnSpan);
    }

    container.appendChild(header);

    // 描述 + 文档链接
    if (doc.description || doc.docURL) {
      const desc = document.createElement("div");
      desc.className = "autocomplete-info-description";

      if (doc.description) {
        const textSpan = document.createElement("span");
        textSpan.textContent = doc.description;
        desc.appendChild(textSpan);
      }

      if (doc.docURL) {
        const link = document.createElement("a");
        link.className = "autocomplete-info-link";
        link.href = doc.docURL;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.textContent = " 查看文档";
        desc.appendChild(link);
      }

      container.appendChild(desc);
    }

    return container;
  };
}

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
