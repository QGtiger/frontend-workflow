import type { DocFunction, DocMetadata } from "@/common/type";
import {
  insertCompletionText,
  pickedCompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult,
} from "@codemirror/autocomplete";

import type { SyntaxNode, Tree } from "@lezer/common";
import type { EditorView } from "@uiw/react-codemirror";
import { createInfoBoxRenderer } from "./CreateInfoBox";
import { RECOMMENDED_SECTION } from "./SectionHeader";

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

/**
 * 创建补全应用函数
 * @param hasArgs 是否有参数，有参数时光标在括号中间
 */
const createApplyCompletion = (hasArgs: boolean) => {
  return (
    view: EditorView,
    completion: Completion,
    from: number,
    to: number
  ) => {
    const label = completion.label;
    const doc = view.state.doc.toString();
    const afterCursor = doc.slice(to);

    // 跳过已存在的尾部括号，避免重复
    let skipChars = 0;
    if (label.endsWith("()") && afterCursor.startsWith(")")) {
      skipChars = 1; // 跳过一个右括号
    }

    view.dispatch({
      ...insertCompletionText(view.state, label, from, to + skipChars),
      annotations: pickedCompletion.of(completion),
    });

    // 有参数，光标移到括号中间
    if (hasArgs) {
      const cursorPos = from + label.length - 1; // 在 ) 前面
      view.dispatch({
        selection: { anchor: cursorPos },
      });
    }
  };
};

export function getOptionsByStaticMethod(
  funcMap: Record<string, DocFunction<(...args: any[]) => any>>,
  option?: {
    commonOpt: Partial<Completion>;
  }
) {
  return Object.values(funcMap).map((func) => {
    const _doc = func.doc;
    const hasArgs = (_doc.args?.length ?? 0) > 0;
    const label = `${_doc.name}()`;
    return {
      label,
      apply: createApplyCompletion(hasArgs),
      info: createInfoBoxRenderer(_doc),
      section: RECOMMENDED_SECTION,
      ...option?.commonOpt,
    };
  }) as Completion[];
}

export function getOptionsByStaticMethodDoc(
  docList: DocMetadata[],

  option?: {
    commonOpt: Partial<Completion>;
  }
) {
  return docList.map((doc) => {
    const hasArgs = (doc.args?.length ?? 0) > 0;
    const label = `${doc.name}()`;
    return {
      label,
      apply: createApplyCompletion(hasArgs),
      info: createInfoBoxRenderer(doc),
      section: RECOMMENDED_SECTION,
      ...option?.commonOpt,
    };
  }) as Completion[];
}
