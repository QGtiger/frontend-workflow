import type { DocFunction } from "./type";

// ============ 静态方法实现 ============

const abs: DocFunction<(n: number) => number> = (n) => Math.abs(n);
abs.doc = {
  name: "abs",
  description: "返回数字的绝对值",
  returnType: "number",
  isFunction: true,
  args: [{ name: "n", type: "number", description: "数字" }],
  examples: [
    { example: "Math.abs(-5)", evaluated: "5" },
    { example: "Math.abs(3)", evaluated: "3" },
  ],
};

const round: DocFunction<(n: number, precision?: number) => number> = (
  n,
  precision = 0
) => {
  const factor = Math.pow(10, precision);
  return Math.round(n * factor) / factor;
};
round.doc = {
  name: "round",
  description: "四舍五入，可指定小数位数",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "n", type: "number", description: "数字" },
    {
      name: "precision",
      type: "number",
      optional: true,
      description: "小数位数，默认 0",
    },
  ],
  examples: [
    { example: "Math.round(3.456)", evaluated: "3" },
    { example: "Math.round(3.456, 2)", evaluated: "3.46" },
    { example: "Math.round(3.456, 1)", evaluated: "3.5" },
  ],
};

const floor: DocFunction<(n: number, precision?: number) => number> = (
  n,
  precision = 0
) => {
  const factor = Math.pow(10, precision);
  return Math.floor(n * factor) / factor;
};
floor.doc = {
  name: "floor",
  description: "向下取整，可指定小数位数",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "n", type: "number", description: "数字" },
    {
      name: "precision",
      type: "number",
      optional: true,
      description: "小数位数，默认 0",
    },
  ],
  examples: [
    { example: "Math.floor(3.9)", evaluated: "3" },
    { example: "Math.floor(3.456, 2)", evaluated: "3.45" },
  ],
};

const ceil: DocFunction<(n: number, precision?: number) => number> = (
  n,
  precision = 0
) => {
  const factor = Math.pow(10, precision);
  return Math.ceil(n * factor) / factor;
};
ceil.doc = {
  name: "ceil",
  description: "向上取整，可指定小数位数",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "n", type: "number", description: "数字" },
    {
      name: "precision",
      type: "number",
      optional: true,
      description: "小数位数，默认 0",
    },
  ],
  examples: [
    { example: "Math.ceil(3.1)", evaluated: "4" },
    { example: "Math.ceil(3.441, 2)", evaluated: "3.45" },
  ],
};

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

const random: DocFunction<(min?: number, max?: number) => number> = (
  min = 0,
  max = 1
) => Math.random() * (max - min) + min;
random.doc = {
  name: "random",
  description: "生成指定范围内的随机浮点数",
  returnType: "number",
  isFunction: true,
  args: [
    {
      name: "min",
      type: "number",
      optional: true,
      description: "最小值，默认 0",
    },
    {
      name: "max",
      type: "number",
      optional: true,
      description: "最大值，默认 1",
    },
  ],
  examples: [
    { example: "Math.random()", evaluated: "0.7234" },
    { example: "Math.random(1, 10)", evaluated: "5.382" },
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

const percentage: DocFunction<
  (value: number, total: number, precision?: number) => number
> = (value, total, precision = 2) => {
  if (total === 0) return 0;
  const factor = Math.pow(10, precision);
  return Math.round((value / total) * 100 * factor) / factor;
};
percentage.doc = {
  name: "percentage",
  description: "计算百分比",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "value", type: "number", description: "当前值" },
    { name: "total", type: "number", description: "总值" },
    {
      name: "precision",
      type: "number",
      optional: true,
      description: "小数位数，默认 2",
    },
  ],
  examples: [
    { example: "Math.percentage(25, 100)", evaluated: "25" },
    { example: "Math.percentage(1, 3)", evaluated: "33.33" },
    { example: "Math.percentage(1, 3, 0)", evaluated: "33" },
  ],
};

const inRange: DocFunction<(n: number, min: number, max: number) => boolean> = (
  n,
  min,
  max
) => n >= min && n <= max;
inRange.doc = {
  name: "inRange",
  description: "判断数字是否在指定范围内（包含边界）",
  returnType: "boolean",
  isFunction: true,
  args: [
    { name: "n", type: "number", description: "数字" },
    { name: "min", type: "number", description: "最小值" },
    { name: "max", type: "number", description: "最大值" },
  ],
  examples: [
    { example: "Math.inRange(5, 0, 10)", evaluated: "true" },
    { example: "Math.inRange(15, 0, 10)", evaluated: "false" },
    { example: "Math.inRange(0, 0, 10)", evaluated: "true" },
  ],
};

// ============ 导出 Math 扩展 ============

export const MathMethods = {
  abs,
  round,
  floor,
  ceil,
  clamp,
  random,
  randomInt,
  average,
  percentage,
  inRange,
} as const;

/**
 * Math 扩展映射（用于代码补全）
 */
export const mathExtensions = {
  typeName: "Math",
  functions: MathMethods,
};
