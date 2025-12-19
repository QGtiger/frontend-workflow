import {
  type Completion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import type { WorkflowStoreApi } from "../../../../../models/workflowStore";
import {
  createCompletion,
  getDisplayType,
  getOptionsByStaticMethod,
  getOptionsByStaticMethodDoc,
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
  splitBaseTail,
} from "./utils";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import { dateTimeExtensions } from "@/common/DateTime";
import { MathMethodsDoc } from "@/common/Math";
import { jsonExtensions } from "@/common/JSON";
import { NumberPrototypeMethodsDoc } from "@/common/NumberPrototype";
import { ObjectPrototypeMethodsDoc } from "@/common/ObjectPrototype";
import { ArrayPrototypeMethodsDoc } from "@/common/ArrayPrototype";
import { ArrayStaticMethodsDoc } from "@/common/ArrayStatic";
import { ObjectStaticMethodsDoc } from "@/common/ObjectStatic";
import { StringPrototypeMethodsDoc } from "@/common/StringPrototype";
import { DatePrototypeMethodsDoc } from "@/common/DatePrototype";
import { METHODS_SECTION, PROPERTIES_SECTION } from "./utils/SectionHeader";

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

  if (typeof baseData === "number") {
    return getOptionsByStaticMethodDoc(NumberPrototypeMethodsDoc);
  } else if (typeof baseData === "string") {
    return getOptionsByStaticMethodDoc(StringPrototypeMethodsDoc);
  } else if (baseData instanceof Date) {
    return getOptionsByStaticMethodDoc(DatePrototypeMethodsDoc);
  } else if (Array.isArray(baseData)) {
    return getOptionsByStaticMethodDoc(ArrayPrototypeMethodsDoc);
  } else if (typeof baseData === "object") {
    const descriptors = Object.getOwnPropertyDescriptors(baseData);
    const rawKeys = Object.keys(descriptors).sort((a, b) => a.localeCompare(b));

    const prototypeOptions =
      baseData === Math
        ? getOptionsByStaticMethodDoc(MathMethodsDoc)
        : getOptionsByStaticMethodDoc(ObjectPrototypeMethodsDoc);

    return rawKeys.reduce(
      (acc, key) => {
        const resolvedProp = baseData[key];
        const isFunction = typeof resolvedProp === "function";

        // 方法的 label 是 key() ，属性是 key
        const label = isFunction ? `${key}()` : key;
        // it.label 可能是 属性 或者 方法，避免重复
        if (acc.some((it) => it.label === label)) {
          return acc;
        }

        const completion = createCompletion(
          {
            name: key,
            isFunction,
            returnType: isFunction ? "unknown" : getDisplayType(resolvedProp),
            description: "",
            args: isFunction
              ? Array.from(
                  {
                    length: resolvedProp.length,
                  },
                  (_, i) => {
                    return {
                      name: `arg${i}`,
                      type: "any",
                      description: "",
                    };
                  }
                )
              : [],
          },
          {
            section: isFunction ? METHODS_SECTION : PROPERTIES_SECTION,
          }
        );
        acc.push(completion);
        return acc;
      },
      [...prototypeOptions]
    );
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
    } else if (base === "JSON") {
      options = getOptionsByStaticMethod(jsonExtensions.functions);
    } else if (base === "Object") {
      options = getOptionsByStaticMethodDoc(ObjectStaticMethodsDoc);
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
