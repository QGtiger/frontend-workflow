import type {
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";

import type { SyntaxNode, Tree } from "@lezer/common";

export const prefixMatch = (first: string, second: string) =>
  first.toLocaleLowerCase().startsWith(second.toLocaleLowerCase());

export function requiredInExpression(
  fnc: (context: CompletionContext) => CompletionResult | null
) {
  return (context: CompletionContext) => {
    const { state, pos } = context;
    const line = state.doc.lineAt(pos);
    const textBefore = line.text.slice(0, pos);
    const textAfter = line.text.slice(pos);

    const inExpression =
      /{{.*?$/.test(textBefore) && /[^{}]*}}/.test(textAfter);

    if (!inExpression) return null;

    return fnc(context);
  };
}

export function longestCommonPrefix(...strings: string[]) {
  if (strings.length < 2) return "";

  return strings.reduce((prefix, str) => {
    while (!str.startsWith(prefix)) {
      prefix = prefix.slice(0, -1);
      if (prefix === "") return "";
    }
    return prefix;
  }, strings[0]);
}

function read(node: SyntaxNode | null, source: string) {
  return node ? source.slice(node.from, node.to) : "";
}

/**
 * Split user input into base (to resolve) and tail (to filter).
 */
export function splitBaseTail(
  syntaxTree: Tree,
  userInput: string
): [string, string] {
  const lastNode = syntaxTree.resolveInner(userInput.length, -1);

  switch (lastNode.type.name) {
    case ".":
      return [read(lastNode.parent, userInput).slice(0, -1), ""];
    case "MemberExpression":
      return [read(lastNode.parent, userInput), read(lastNode, userInput)];
    case "PropertyName":
      // eslint-disable-next-line no-case-declarations
      const tail = read(lastNode, userInput);
      return [
        read(lastNode.parent, userInput).slice(0, -(tail.length + 1)),
        tail,
      ];
    default:
      return ["", ""];
  }
}
