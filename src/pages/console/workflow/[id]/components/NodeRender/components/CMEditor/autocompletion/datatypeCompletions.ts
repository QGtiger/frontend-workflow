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
    .join("|"),
);

type AutoCompletionInput = {
  base: string;
  baseData: any;
  // TODO 为了动态去解析对应key 的label
  dollarOutputStruct?: NodeOutputStructItem[];
};

function findKeyByDollarOutputStruct(
  key: string,
  dollarOutputStruct?: NodeOutputStructItem[],
): [string, NodeOutputStructItem[]] | undefined {
  if (!dollarOutputStruct) return;

  for (const item of dollarOutputStruct) {
    // 1. 当前节点匹配 → 直接返回结果
    if (item.code === key) {
      return [item.label, dollarOutputStruct];
    }

    // 2. 不匹配 → 递归查子节点
    const childResult = findKeyByDollarOutputStruct(key, item.children);

    // 3. 子节点找到了 → 向上传递结果
    if (childResult) {
      return childResult;
    }
  }

  return;
}

function getCustomOptions(autoCompletionInput: AutoCompletionInput) {
  const { base } = autoCompletionInput;

  // 去掉括号，规范化 base
  const normalizedBase = base.replaceAll(/^(\()|(\))$/g, "");

  // 自定义补全： $workflow 或者 ($workflow)
  if (normalizedBase === "$workflow") {
    return [
      createCompletion(
        {
          name: "name",
          isFunction: false,
          returnType: "string",
          description: "工作流名称",
        },
        {
          section: PROPERTIES_SECTION,
        },
      ),
      createCompletion(
        {
          name: "id",
          isFunction: false,
          returnType: "string",
          description: "工作流 ID",
        },
        {
          section: PROPERTIES_SECTION,
        },
      ),
    ];
  }

  return [];
}

function datatypeOptions(autoCompletionInput: AutoCompletionInput) {
  const { baseData } = autoCompletionInput;
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

        const r = findKeyByDollarOutputStruct(
          key,
          autoCompletionInput.dollarOutputStruct,
        );
        let description = "";
        // 假如存在子节点，并且子节点的 key 都在 rawKeys 中，则说明是该属性
        if (r && r[1].every((it) => rawKeys.includes(it.code))) {
          description = r[0];
        }

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
            description,
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
                  },
                )
              : [],
          },
          {
            section: isFunction ? METHODS_SECTION : PROPERTIES_SECTION,
          },
        );
        acc.push(completion);
        return acc;
      },
      [...prototypeOptions],
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

    // 先检查自定义补全
    const customOptions = getCustomOptions({ base, baseData: undefined });

    if (customOptions.length > 0) {
      options = customOptions;
    } else if (base === "DateTime") {
      // 静态方法的提示
      options = getOptionsByStaticMethod(dateTimeExtensions.functions);
    } else if (base === "JSON") {
      options = getOptionsByStaticMethod(jsonExtensions.functions);
    } else if (base === "Object") {
      options = getOptionsByStaticMethodDoc(ObjectStaticMethodsDoc);
    } else if (base === "Array") {
      options = getOptionsByStaticMethodDoc(ArrayStaticMethodsDoc);
    } else {
      const { error, result, dollarOutputStruct } =
        _workflowStoreApi.evaluateExpression(base);
      if (error) return null;
      options = datatypeOptions({
        base,
        baseData: result,
        dollarOutputStruct,
      });
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
