import type { DocFunction, DocMetadata } from "./type";

// ============ 原型方法实现 ============

const round: DocFunction<(decimals?: number) => number> = function (
  this: number,
  decimals: number = 0
) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(this * multiplier) / multiplier;
} as any;
round.doc = {
  name: "round",
  description: "四舍五入到指定小数位数",
  returnType: "number",
  isFunction: true,
  args: [
    {
      name: "decimals",
      type: "number",
      optional: true,
      description: "小数位数，默认为 0",
    },
  ],
  examples: [
    { example: "(3.14159).round()", evaluated: "3" },
    { example: "(3.14159).round(2)", evaluated: "3.14" },
    { example: "(3.5).round()", evaluated: "4" },
  ],
};

const toPercent: DocFunction<(decimals?: number) => string> = function (
  this: number,
  decimals: number = 2
) {
  return (this * 100).toFixed(decimals) + "%";
} as any;
toPercent.doc = {
  name: "toPercent",
  description: "将数字转换为百分比字符串",
  returnType: "string",
  isFunction: true,
  args: [
    {
      name: "decimals",
      type: "number",
      optional: true,
      description: "小数位数，默认为 2",
    },
  ],
  examples: [
    { example: "(0.1234).toPercent()", evaluated: "'12.34%'" },
    { example: "(0.5).toPercent(0)", evaluated: "'50%'" },
    { example: "(1.5678).toPercent(1)", evaluated: "'156.8%'" },
  ],
};

const format: DocFunction<(options?: Intl.NumberFormatOptions) => string> =
  function (this: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat("zh-CN", options).format(this);
  } as any;
format.doc = {
  name: "format",
  description: "格式化数字为本地化字符串（千分位、货币等）",
  returnType: "string",
  isFunction: true,
  args: [
    {
      name: "options",
      type: "Intl.NumberFormatOptions",
      optional: true,
      description: "格式化选项",
    },
  ],
  examples: [
    { example: "(1234567.89).format()", evaluated: "'1,234,567.89'" },
    {
      example: "(1234.5).format({ style: 'currency', currency: 'CNY' })",
      evaluated: "'¥1,234.50'",
    },
  ],
};

const clamp: DocFunction<(min: number, max: number) => number> = function (
  this: number,
  min: number,
  max: number
) {
  return Math.min(Math.max(this, min), max);
} as any;
clamp.doc = {
  name: "clamp",
  description: "将数字限制在指定范围内",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "min", type: "number", description: "最小值" },
    { name: "max", type: "number", description: "最大值" },
  ],
  examples: [
    { example: "(5).clamp(0, 10)", evaluated: "5" },
    { example: "(-5).clamp(0, 10)", evaluated: "0" },
    { example: "(15).clamp(0, 10)", evaluated: "10" },
  ],
};

const between: DocFunction<(min: number, max: number) => boolean> = function (
  this: number,
  min: number,
  max: number
) {
  return this >= min && this <= max;
} as any;
between.doc = {
  name: "between",
  description: "判断数字是否在指定范围内（包含边界）",
  returnType: "boolean",
  isFunction: true,
  args: [
    { name: "min", type: "number", description: "最小值" },
    { name: "max", type: "number", description: "最大值" },
  ],
  examples: [
    { example: "(5).between(0, 10)", evaluated: "true" },
    { example: "(-5).between(0, 10)", evaluated: "false" },
    { example: "(10).between(0, 10)", evaluated: "true" },
  ],
};

// ============ 导出 NumberPrototype 扩展 ============

export const NumberPrototypeMethods = {
  round,
  toPercent,
  format,
  clamp,
  between,
} as const;

// ============ 原生方法的文档定义 ============

export const NumberPrototypeNativeMethodsDocs: DocMetadata[] = [
  {
    name: "toFixed",
    description: "格式化数字为指定小数位数的字符串",
    returnType: "string",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toFixed",
    args: [
      {
        name: "digits",
        type: "number",
        optional: true,
        description: "小数位数，默认为 0",
      },
    ],
    examples: [
      { example: "(3.14159).toFixed(2)", evaluated: "'3.14'" },
      { example: "(5).toFixed(2)", evaluated: "'5.00'" },
      { example: "(2.34).toFixed(1)", evaluated: "'2.3'" },
    ],
  },
  {
    name: "toString",
    description: "将数字转换为字符串，可指定进制（2-36）",
    returnType: "string",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toString",
    args: [
      {
        name: "radix",
        type: "number",
        optional: true,
        description: "进制（2-36），默认为 10",
      },
    ],
    examples: [
      { example: "(255).toString()", evaluated: "'255'" },
      { example: "(255).toString(16)", evaluated: "'ff'" },
      { example: "(10).toString(2)", evaluated: "'1010'" },
    ],
  },
];

/**
 * NumberPrototype 扩展映射（用于代码补全）
 */
export const numberPrototypeExtensions = {
  typeName: "NumberPrototype",
  functions: NumberPrototypeMethods,
  nativeDocs: NumberPrototypeNativeMethodsDocs,
};

export const NumberPrototypeMethodsDoc: DocMetadata[] = Object.values(
  NumberPrototypeMethods
)
  .map((func) => func.doc)
  .concat(NumberPrototypeNativeMethodsDocs)
  .sort((a, b) => a.name.localeCompare(b.name));
