import {
  type Completion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import type { WorkflowStoreApi } from "../../../../../models/workflowStore";
import {
  getOptionsByStaticMethod,
  getOptionsByStaticMethodDoc,
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
  splitBaseTail,
} from "./utils";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { dateTimeExtensions } from "@/common/DateTime";
import { mathExtensions } from "@/common/Math";
import { jsonExtensions } from "@/common/JSON";
import { objectExtensions } from "@/common/Object";
import { NumberPrototypeMethods } from "@/common/NumberPrototype";
import { ObjectPrototypeMethods } from "@/common/ObjectPrototype";
import { ArrayPrototypeMethods } from "@/common/ArrayPrototype";
import { ArrayStaticMethodsDoc } from "@/common/ArrayStatic";

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

function datatypeOptions(baseData: any) {
  if (baseData === null) return [];

  if (Array.isArray(baseData)) {
    return getOptionsByStaticMethod(ArrayPrototypeMethods);
  } else if (typeof baseData === "number") {
    return getOptionsByStaticMethod(NumberPrototypeMethods);
  } else if (typeof baseData === "object") {
    return getOptionsByStaticMethod(ObjectPrototypeMethods);
  }

  return [];
}

export function datatypeCompletions(_workflowStoreApi: WorkflowStoreApi) {
  return requiredInExpression((context: CompletionContext) => {
    const word = context.matchBefore(DATATYPE_REGEX);

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
      options = getOptionsByStaticMethodDoc(ArrayStaticMethodsDoc);
    } else {
      const { error, result } = _workflowStoreApi.evaluateExpression(base);
      if (error) return null;
      options = datatypeOptions(result);
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
