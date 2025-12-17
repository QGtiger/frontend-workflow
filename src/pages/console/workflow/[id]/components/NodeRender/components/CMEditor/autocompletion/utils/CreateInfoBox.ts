import type { DocMetadata } from "@/common/type";
import type { Completion, CompletionInfo } from "@codemirror/autocomplete";

/**
 * 创建 Info Box DOM 元素
 */
export function createInfoBox(
  doc: DocMetadata,
  activeArgIndex?: number
): HTMLElement {
  const container = document.createElement("div");
  container.className = "autocomplete-info-box";

  const isFunction = doc.isFunction ?? doc.args !== undefined;

  // 签名行
  const signature = document.createElement("div");
  signature.className = "info-signature";

  const nameSpan = document.createElement("span");
  nameSpan.textContent = doc.name;
  signature.appendChild(nameSpan);

  if (isFunction) {
    signature.appendChild(document.createTextNode("("));

    doc.args?.forEach((arg, i) => {
      if (i > 0) {
        signature.appendChild(document.createTextNode(", "));
      }

      const argSpan = document.createElement("span");
      const isActive = activeArgIndex !== undefined && i === activeArgIndex;
      if (isActive) {
        argSpan.className = "info-arg-active";
      }
      const argText = `${arg.variadic ? "..." : ""}${arg.name}${
        arg.optional ? "?" : ""
      }`;
      argSpan.textContent = argText;
      signature.appendChild(argSpan);
    });

    signature.appendChild(document.createTextNode(")"));
  }

  if (doc.returnType) {
    const returnSpan = document.createElement("span");
    returnSpan.className = "info-return";
    returnSpan.textContent = isFunction
      ? ` → ${doc.returnType}`
      : `: ${doc.returnType}`;
    signature.appendChild(returnSpan);
  }

  container.appendChild(signature);

  // 简洁模式：只显示当前参数描述
  // if (activeArgIndex !== undefined && doc.args?.[activeArgIndex]) {
  //   const currentArg = doc.args[activeArgIndex];
  //   const desc = document.createElement("div");
  //   desc.className = "info-desc";
  //   desc.textContent = `${currentArg.name}: ${currentArg.type}${
  //     currentArg.description ? ` — ${currentArg.description}` : ""
  //   }`;
  //   container.appendChild(desc);
  //   return container;
  // }

  // 描述
  if (doc.description) {
    const desc = document.createElement("div");
    desc.className = "info-desc";
    desc.textContent = doc.description;
    container.appendChild(desc);
  }

  // 参数
  if (doc.args && doc.args.length > 0) {
    const argsBox = document.createElement("div");
    argsBox.className = "info-args";

    const argsTitle = document.createElement("div");
    argsTitle.className = "info-section-title";
    argsTitle.textContent = "参数";
    argsBox.appendChild(argsTitle);

    doc.args.forEach((arg, i) => {
      const line = document.createElement("div");
      const isActive = activeArgIndex !== undefined && i === activeArgIndex;
      line.className = isActive
        ? "info-arg-line info-arg-line-active"
        : "info-arg-line";

      let text = `${arg.variadic ? "..." : ""}${arg.name}`;
      if (arg.optional) text += " (可选)";
      text += `: ${arg.type}`;
      if (arg.description) text += ` — ${arg.description}`;
      line.textContent = text;
      argsBox.appendChild(line);
    });

    container.appendChild(argsBox);
  }

  // 示例
  if (doc.examples && doc.examples.length > 0) {
    const exBox = document.createElement("div");
    exBox.className = "info-examples";

    const exTitle = document.createElement("div");
    exTitle.className = "info-section-title";
    exTitle.textContent = "示例";
    exBox.appendChild(exTitle);

    for (const ex of doc.examples) {
      const item = document.createElement("div");
      item.className = "info-example-item";

      const code = document.createElement("div");
      code.className = "info-example-code";
      code.textContent = ex.example;
      item.appendChild(code);

      const result = document.createElement("div");
      result.className = "info-example-result";
      result.textContent = `// => ${ex.evaluated}`;
      item.appendChild(result);

      exBox.appendChild(item);
    }
    container.appendChild(exBox);
  }

  // 文档链接
  if (doc.docURL) {
    const link = document.createElement("a");
    link.className = "info-doc-link";
    link.href = doc.docURL;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "文档 ↗";
    container.appendChild(link);
  }

  return container;
}

/**
 * 创建 autocompletion 用的 info 渲染器
 */
export function createInfoBoxRenderer(doc: DocMetadata) {
  return (_completion: Completion, activeArgIndex?: number) =>
    createInfoBox(doc, activeArgIndex);
}

export const isInfoBoxRenderer = (
  info:
    | string
    | ((completion: Completion) => CompletionInfo | Promise<CompletionInfo>)
    | undefined
): info is ReturnType<typeof createInfoBoxRenderer> => {
  return typeof info === "function";
};
