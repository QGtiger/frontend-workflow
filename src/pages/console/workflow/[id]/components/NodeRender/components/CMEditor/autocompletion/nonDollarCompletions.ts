import type { Completion, CompletionContext } from "@codemirror/autocomplete";
import {
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
} from "./utils";
import { createInfoBoxRenderer } from "./utils/CreateInfoBox";

/**
 * 全局对象补全选项
 */
const GLOBAL_OPTIONS = [
  {
    label: "Array",
    info: createInfoBoxRenderer({
      name: "Array",
      returnType: "ArrayConstructor",
      description: "用于创建和操作数组的全局对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array",
    }),
  },
  {
    label: "Math",
    info: createInfoBoxRenderer({
      name: "Math",
      returnType: "Math",
      description: "提供数学常数和函数的内置对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math",
    }),
  },
  {
    label: "Object",
    info: createInfoBoxRenderer({
      name: "Object",
      returnType: "ObjectConstructor",
      description: "用于创建和操作对象的全局对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object",
    }),
  },
  {
    label: "Date",
    info: createInfoBoxRenderer({
      name: "Date",
      returnType: "DateConstructor",
      description: "用于处理日期和时间的全局对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date",
    }),
  },
  {
    label: "JSON",
    info: createInfoBoxRenderer({
      name: "JSON",
      returnType: "JSON",
      description: "用于解析和序列化 JSON 数据",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/JSON",
    }),
  },
  {
    label: "String",
    info: createInfoBoxRenderer({
      name: "String",
      returnType: "StringConstructor",
      description: "用于创建和操作字符串的全局对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/String",
    }),
  },
  {
    label: "Number",
    info: createInfoBoxRenderer({
      name: "Number",
      returnType: "NumberConstructor",
      description: "用于创建和操作数字的全局对象",
      docURL:
        "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number",
    }),
  },
];

/**
 * 非 $ 开头的全局变量补全
 * 支持 Array, Math, Object, Date, JSON, String, Number
 */
export const nonDollarCompletions = requiredInExpression(
  (context: CompletionContext) => {
    const date = /(\s+)D[ate]*/;
    const math = /(\s+)M[ath]*/;
    const object = /(\s+)O[bject]*/;
    const array = /(\s+)A[rray]*/;
    const json = /(\s+)J[son]*/;
    const string = /(\s+)S[tring]*/;
    const number = /(\s+)N[umber]*/;

    const combinedRegex = new RegExp(
      [
        date.source,
        math.source,
        object.source,
        array.source,
        json.source,
        string.source,
        number.source,
      ].join("|")
    );

    const word = context.matchBefore(combinedRegex);

    if (!word) return null;

    const userInput = word.text.trim();

    // 过滤匹配的选项
    const options = GLOBAL_OPTIONS.filter((o) =>
      prefixMatch(o.label, userInput)
    );

    if (options.length === 0) return null;

    return {
      options,
      from: word.to - userInput.length,
      filter: false,
      getMatch(completion: Completion) {
        const lcp = longestCommonPrefix(userInput, completion.label);

        return [0, lcp.length];
      },
    };
  }
);
