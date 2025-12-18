import type { DocFunction } from "./type";

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

const floor: DocFunction<(decimals?: number) => number> = function (
  this: number,
  decimals: number = 0
) {
  const multiplier = Math.pow(10, decimals);
  return Math.floor(this * multiplier) / multiplier;
} as any;
floor.doc = {
  name: "floor",
  description: "向下取整到指定小数位数",
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
    { example: "(3.9).floor()", evaluated: "3" },
    { example: "(3.14159).floor(2)", evaluated: "3.14" },
    { example: "(-2.5).floor()", evaluated: "-3" },
  ],
};

const ceil: DocFunction<(decimals?: number) => number> = function (
  this: number,
  decimals: number = 0
) {
  const multiplier = Math.pow(10, decimals);
  return Math.ceil(this * multiplier) / multiplier;
} as any;
ceil.doc = {
  name: "ceil",
  description: "向上取整到指定小数位数",
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
    { example: "(3.1).ceil()", evaluated: "4" },
    { example: "(3.14159).ceil(2)", evaluated: "3.15" },
    { example: "(-2.5).ceil()", evaluated: "-2" },
  ],
};

const abs: DocFunction<() => number> = function (this: number) {
  return Math.abs(this);
} as any;
abs.doc = {
  name: "abs",
  description: "返回数字的绝对值",
  returnType: "number",
  isFunction: true,
  examples: [
    { example: "(-5).abs()", evaluated: "5" },
    { example: "(5).abs()", evaluated: "5" },
    { example: "(0).abs()", evaluated: "0" },
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

const times: DocFunction<(callback: (index: number) => any) => any[]> =
  function (this: number, callback: (index: number) => any) {
    const result: any[] = [];
    for (let i = 0; i < this; i++) {
      result.push(callback(i));
    }
    return result;
  } as any;
times.doc = {
  name: "times",
  description: "重复执行回调函数 N 次，返回结果数组",
  returnType: "any[]",
  isFunction: true,
  args: [
    {
      name: "callback",
      type: "(index: number) => any",
      description: "回调函数，接收当前索引",
    },
  ],
  examples: [
    { example: "(3).times(i => i)", evaluated: "[0, 1, 2]" },
    { example: "(5).times(i => i * 2)", evaluated: "[0, 2, 4, 6, 8]" },
  ],
};

const isEven: DocFunction<() => boolean> = function (this: number) {
  return this % 2 === 0;
} as any;
isEven.doc = {
  name: "isEven",
  description: "判断数字是否为偶数",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "(2).isEven()", evaluated: "true" },
    { example: "(3).isEven()", evaluated: "false" },
    { example: "(0).isEven()", evaluated: "true" },
  ],
};

const isOdd: DocFunction<() => boolean> = function (this: number) {
  return this % 2 !== 0;
} as any;
isOdd.doc = {
  name: "isOdd",
  description: "判断数字是否为奇数",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "(2).isOdd()", evaluated: "false" },
    { example: "(3).isOdd()", evaluated: "true" },
    { example: "(1).isOdd()", evaluated: "true" },
  ],
};

const isPositive: DocFunction<() => boolean> = function (this: number) {
  return this > 0;
} as any;
isPositive.doc = {
  name: "isPositive",
  description: "判断数字是否为正数",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "(5).isPositive()", evaluated: "true" },
    { example: "(0).isPositive()", evaluated: "false" },
    { example: "(-5).isPositive()", evaluated: "false" },
  ],
};

const isNegative: DocFunction<() => boolean> = function (this: number) {
  return this < 0;
} as any;
isNegative.doc = {
  name: "isNegative",
  description: "判断数字是否为负数",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "(5).isNegative()", evaluated: "false" },
    { example: "(0).isNegative()", evaluated: "false" },
    { example: "(-5).isNegative()", evaluated: "true" },
  ],
};

const toInt: DocFunction<() => number> = function (this: number) {
  return Math.trunc(this);
} as any;
toInt.doc = {
  name: "toInt",
  description: "将数字转换为整数（去除小数部分）",
  returnType: "number",
  isFunction: true,
  examples: [
    { example: "(3.14).toInt()", evaluated: "3" },
    { example: "(-3.14).toInt()", evaluated: "-3" },
    { example: "(5).toInt()", evaluated: "5" },
  ],
};

const format: DocFunction<(options?: Intl.NumberFormatOptions) => string> =
  function (this: number, options?: Intl.NumberFormatOptions) {
    return new Intl.NumberFormat("zh-CN", options).format(this);
  } as any;
format.doc = {
  name: "format",
  description: "格式化数字为本地化字符串",
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
      example: "(0.5).format({ style: 'percent' })",
      evaluated: "'50%'",
    },
  ],
};

// ============ 导出 NumberPrototype 扩展 ============

export const NumberPrototypeMethods = {
  round,
  floor,
  ceil,
  abs,
  clamp,
  between,
  toPercent,
  times,
  isEven,
  isOdd,
  isPositive,
  isNegative,
  toInt,
  format,
} as const;

/**
 * NumberPrototype 扩展映射（用于代码补全）
 */
export const numberPrototypeExtensions = {
  typeName: "NumberPrototype",
  functions: NumberPrototypeMethods,
};
