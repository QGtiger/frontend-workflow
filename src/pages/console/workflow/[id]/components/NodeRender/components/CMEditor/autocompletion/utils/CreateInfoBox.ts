import type { Completion } from "@codemirror/autocomplete";

export interface DocMetadata {
  name: string;
  description: string;
  returnType: string;
  /** 是否是函数 */
  isFunction?: boolean;
  args?: {
    name: string;
    type: string;
    optional?: boolean;
    variadic?: boolean;
    description: string;
  }[];
  examples?: {
    example: string;
    evaluated: string;
    description?: string;
  }[];
  docURL?: string;
}

export function createInfoBoxRenderer(doc: DocMetadata) {
  return (_completion: Completion) => {
    const container = document.createElement("div");
    container.className = "autocomplete-info-box";

    const isFunction = doc.isFunction ?? doc.args !== undefined;

    // 签名行: name(args) → returnType
    const signature = document.createElement("div");
    signature.className = "info-signature";

    let signatureText = doc.name;
    if (isFunction) {
      const argsStr = doc.args?.length
        ? doc.args
            .map(
              (a) =>
                `${a.variadic ? "..." : ""}${a.name}${a.optional ? "?" : ""}`
            )
            .join(", ")
        : "";
      signatureText += `(${argsStr})`;
    }
    if (doc.returnType) {
      signatureText += isFunction
        ? ` → ${doc.returnType}`
        : `: ${doc.returnType}`;
    }
    signature.textContent = signatureText;
    container.appendChild(signature);

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

      for (const arg of doc.args) {
        const line = document.createElement("div");
        line.className = "info-arg-line";
        // name: type — description
        let text = `${arg.variadic ? "..." : ""}${arg.name}`;
        if (arg.optional) text += " (可选)";
        text += `: ${arg.type}`;
        if (arg.description) text += ` — ${arg.description}`;
        line.textContent = text;
        argsBox.appendChild(line);
      }
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

        // 代码
        const code = document.createElement("div");
        code.className = "info-example-code";
        code.textContent = ex.example;
        item.appendChild(code);

        // 结果（注释风格）
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
  };
}
