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
  prefixMatch,
  requiredInExpression,
  splitBaseTail,
} from "./utils";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { dateTimeExtensions } from "@/common/DateTime";
import { createInfoBoxRenderer } from "./utils/CreateInfoBox";
import { RECOMMENDED_SECTION } from "./utils/SectionHeader";
import type { DocFunction } from "@/common/type";
import { mathExtensions } from "@/common/Math";
import { jsonExtensions } from "@/common/JSON";
import { objectExtensions } from "@/common/Object";
import { arrayExtensions } from "@/common/Array";

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

    view.dispatch({
      ...insertCompletionText(view.state, label, from, to),
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
  arrayGlobal: /Array\.(.*)/, // Array.
};

const DATATYPE_REGEX = new RegExp(
  Object.values(regexes)
    .map((regex) => regex.source)
    .join("|")
);

function getOptionsByStaticMethod(
  funcMap: Record<string, DocFunction<(...args: any[]) => any>>
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
    };
  }) as Completion[];
}

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

    // 静态方法的提示
    if (base === "DateTime") {
      options = getOptionsByStaticMethod(dateTimeExtensions.functions);
    } else if (base === "Math") {
      options = getOptionsByStaticMethod(mathExtensions.functions);
    } else if (base === "JSON") {
      options = getOptionsByStaticMethod(jsonExtensions.functions);
    } else if (base === "Object") {
      options = getOptionsByStaticMethod(objectExtensions.functions);
    } else if (base === "Array") {
      options = getOptionsByStaticMethod(arrayExtensions.functions);
    }

    const from = word.to - tail.length;
    return {
      from,
      options: options.filter((o) => prefixMatch(o.label, tail)),
      filter: false,
      getMatch(completion: Completion) {
        const lcp = longestCommonPrefix(tail, completion.label);
        return [0, lcp.length];
      },
    };
  });
}
