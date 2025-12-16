import type {
  CompletionContext,
  CompletionResult,
} from "@codemirror/autocomplete";

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
