import type { DocFunction, DocMetadata } from "./type";

// ============ 自定义静态方法实现 ============

const clamp: DocFunction<(n: number, min: number, max: number) => number> = (
  n,
  min,
  max
) => Math.min(Math.max(n, min), max);
clamp.doc = {
  name: "clamp",
  description: "将数字限制在指定范围内",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "n", type: "number", description: "数字" },
    { name: "min", type: "number", description: "最小值" },
    { name: "max", type: "number", description: "最大值" },
  ],
  examples: [
    { example: "Math.clamp(10, 0, 5)", evaluated: "5" },
    { example: "Math.clamp(-5, 0, 10)", evaluated: "0" },
    { example: "Math.clamp(3, 0, 10)", evaluated: "3" },
  ],
};

const randomInt: DocFunction<(min: number, max: number) => number> = (
  min,
  max
) => Math.floor(Math.random() * (max - min + 1)) + min;
randomInt.doc = {
  name: "randomInt",
  description: "生成指定范围内的随机整数（包含 min 和 max）",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "min", type: "number", description: "最小值" },
    { name: "max", type: "number", description: "最大值" },
  ],
  examples: [
    { example: "Math.randomInt(1, 10)", evaluated: "7" },
    { example: "Math.randomInt(0, 100)", evaluated: "42" },
  ],
};

const average: DocFunction<(nums: readonly number[]) => number> = (nums) => {
  if (nums.length === 0) return 0;
  return nums.reduce((acc, cur) => acc + cur, 0) / nums.length;
};
average.doc = {
  name: "average",
  description: "计算数组的平均值",
  returnType: "number",
  isFunction: true,
  args: [{ name: "nums", type: "number[]", description: "数字数组" }],
  examples: [
    { example: "Math.average([1, 2, 3, 4, 5])", evaluated: "3" },
    { example: "Math.average([10, 20])", evaluated: "15" },
  ],
};

// ============ 导出自定义方法 ============

export const MathMethods = {
  clamp,
  randomInt,
  average,
} as const;

// ============ 原生方法的文档定义 ============

export const MathNativeMethodsDocs: DocMetadata[] = [
  {
    name: "abs",
    description: "返回数字的绝对值",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/abs",
    args: [{ name: "x", type: "number", description: "数字" }],
    examples: [
      { example: "Math.abs(-5)", evaluated: "5" },
      { example: "Math.abs(3)", evaluated: "3" },
    ],
  },
  {
    name: "round",
    description: "四舍五入到最接近的整数",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/round",
    args: [{ name: "x", type: "number", description: "数字" }],
    examples: [
      { example: "Math.round(3.456)", evaluated: "3" },
      { example: "Math.round(3.6)", evaluated: "4" },
    ],
  },
  {
    name: "floor",
    description: "向下取整到最接近的整数",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/floor",
    args: [{ name: "x", type: "number", description: "数字" }],
    examples: [
      { example: "Math.floor(3.9)", evaluated: "3" },
      { example: "Math.floor(-2.5)", evaluated: "-3" },
    ],
  },
  {
    name: "ceil",
    description: "向上取整到最接近的整数",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/ceil",
    args: [{ name: "x", type: "number", description: "数字" }],
    examples: [
      { example: "Math.ceil(3.1)", evaluated: "4" },
      { example: "Math.ceil(-2.5)", evaluated: "-2" },
    ],
  },
  {
    name: "random",
    description: "返回 0 到 1 之间的随机浮点数",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/random",
    examples: [
      { example: "Math.random()", evaluated: "0.7234" },
      { example: "Math.random()", evaluated: "0.3821" },
    ],
  },
  {
    name: "max",
    description: "返回一组数中的最大值",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/max",
    args: [{ name: "...values", type: "number[]", description: "数字列表" }],
    examples: [
      { example: "Math.max(1, 3, 2)", evaluated: "3" },
      { example: "Math.max(-1, -3, -2)", evaluated: "-1" },
    ],
  },
  {
    name: "min",
    description: "返回一组数中的最小值",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/min",
    args: [{ name: "...values", type: "number[]", description: "数字列表" }],
    examples: [
      { example: "Math.min(1, 3, 2)", evaluated: "1" },
      { example: "Math.min(-1, -3, -2)", evaluated: "-3" },
    ],
  },
  {
    name: "pow",
    description: "返回基数的指数次幂",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/pow",
    args: [
      { name: "base", type: "number", description: "基数" },
      { name: "exponent", type: "number", description: "指数" },
    ],
    examples: [
      { example: "Math.pow(2, 3)", evaluated: "8" },
      { example: "Math.pow(10, 2)", evaluated: "100" },
    ],
  },
  {
    name: "sqrt",
    description: "返回数字的平方根",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Math/sqrt",
    args: [{ name: "x", type: "number", description: "数字" }],
    examples: [
      { example: "Math.sqrt(9)", evaluated: "3" },
      { example: "Math.sqrt(2)", evaluated: "1.414" },
    ],
  },
];

/**
 * Math 扩展映射（用于代码补全）
 */
export const mathExtensions = {
  typeName: "Math",
  functions: MathMethods,
  nativeDocs: MathNativeMethodsDocs,
};

export const MathMethodsDoc: DocMetadata[] = Object.values(MathMethods)
  .map((func) => func.doc)
  .concat(MathNativeMethodsDocs)
  .sort((a, b) => a.name.localeCompare(b.name));
