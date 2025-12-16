import type { Completion } from "@codemirror/autocomplete";

interface DocMetadata {
  name: string;
  returnType: string;
  description: string;
  docURL?: string;
}

export function createInfoBoxRenderer(doc: DocMetadata) {
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
