import {
  insertCompletionText,
  pickedCompletion,
  type Completion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import type { EditorView } from "@uiw/react-codemirror";
import type { WorkflowStoreApi } from "../../../../../workflowStore";
import {
  longestCommonPrefix,
  requiredInExpression,
  splitBaseTail,
} from "./utils";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { dateTimeExtensions } from "@/common/DateTime";
import { createInfoBoxRenderer } from "./utils/CreateInfoBox";
import { RECOMMENDED_SECTION } from "./utils/SectionHeader";

/**
 * 自定义补全应用，处理括号重复和光标位置
 */
const applyCompletion = (
  view: EditorView,
  completion: Completion,
  from: number,
  to: number
) => {
  const label = completion.label;
  const doc = view.state.doc.toString();
  const afterCursor = doc.slice(to);

  // 跳过已存在的尾部括号
  let skipChars = 0;
  if (label.endsWith("')") && afterCursor.startsWith("')")) {
    skipChars = 2;
  } else if (label.endsWith(")") && afterCursor.startsWith(")")) {
    skipChars = 1;
  }

  // 判断是否是函数调用
  const isFunction = label.endsWith("()") || label.includes("(");
  const hasArgs = label.includes("(") && !label.endsWith("()");

  view.dispatch({
    ...insertCompletionText(view.state, label, from, to + skipChars),
    annotations: pickedCompletion.of(completion),
  });

  // 如果是函数且有参数，将光标移到括号内
  if (isFunction && hasArgs) {
    const openParenIndex = label.indexOf("(");
    const cursorPos = from + openParenIndex + 1;
    view.dispatch({
      selection: { anchor: cursorPos },
    });
  }
};

const regexes = {
  generalRef: /\$[^$'"]+\.(.*)/, // $vars. or $workflow. or similar ones
  selectorRef: /\$\(['"][\S\s]+['"]\)\.(.*)/, // $('nodeName').

  numberLiteral: /\((\d+)\.?(\d*)\)\.(.*)/, // (123). or (123.4).
  singleQuoteStringLiteral: /('.*')\.([^'{\s])*/, // 'abc'.
  booleanLiteral: /(true|false)\.([^'{\s])*/, // true.
  doubleQuoteStringLiteral: /(".*")\.([^"{\s])*/, // "abc".
  dateLiteral: /\(?new Date\(\(?.*?\)\)?\.(.*)/, // new Date(). or (new Date()).
  arrayLiteral: /\(?(\[.*\])\)?\.(.*)/, // [1, 2, 3].
  indexedAccess: /([^"{\s]+\[.+\])\.(.*)/, // 'abc'[0]. or 'abc'.split('')[0] or similar ones
  objectLiteral: /\(\{.*\}\)\.(.*)/, // ({}).

  mathGlobal: /Math\.(.*)/, // Math.
  datetimeGlobal: /DateTime\.(.*)/, // DateTime.
  objectGlobal: /Object\.(.*)/, // Object. or Object.method(arg).
  jsonGlobal: /JSON\.(.*)/, // JSON.
};

const DATATYPE_REGEX = new RegExp(
  Object.values(regexes)
    .map((regex) => regex.source)
    .join("|")
);

export function datatypeCompletions(_workflowStoreApi: WorkflowStoreApi) {
  return requiredInExpression((context: CompletionContext) => {
    const word = context.matchBefore(DATATYPE_REGEX);

    console.log("datatypeCompletions word", word);

    if (!word) return null;

    const syntaxTree = javascriptLanguage.parser.parse(word.text);
    const [base, tail] = splitBaseTail(syntaxTree, word.text);

    console.log("datatypeCompletions base", base);
    console.log("datatypeCompletions tail", tail);

    let options: Completion[] = [];

    if (base === "DateTime") {
      options = Object.values(dateTimeExtensions.functions).map((func) => {
        const label = `${func.name}()`;
        return {
          label,
          apply: applyCompletion,
          info: createInfoBoxRenderer(func.doc),
          section: RECOMMENDED_SECTION,
        };
      }) as Completion[];
    }

    const from = word.to - tail.length;
    return {
      from,
      options,
      filter: false,
      getMatch(completion: Completion) {
        const lcp = longestCommonPrefix(tail, completion.label);
        return [0, lcp.length];
      },
    };
  });
}
