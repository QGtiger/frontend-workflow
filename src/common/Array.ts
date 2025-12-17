import type { DocFunction } from "./type";

// ============ 静态方法实现 ============

const at: DocFunction<
  <T>(arr: readonly T[], index: number) => T | undefined
> = (arr, index) => {
  const len = arr.length;
  const i = index < 0 ? len + index : index;
  return arr[i];
};
at.doc = {
  name: "at",
  description: "获取指定索引的元素，支持负数索引（-1 表示最后一个）",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "arr", type: "any[]", description: "目标数组" },
    { name: "index", type: "number", description: "索引，支持负数" },
  ],
  examples: [
    { example: "Array.at([1, 2, 3], 0)", evaluated: "1" },
    { example: "Array.at([1, 2, 3], -1)", evaluated: "3" },
  ],
};

const first: DocFunction<<T>(arr: readonly T[]) => T | undefined> = (arr) =>
  arr[0];
first.doc = {
  name: "first",
  description: "获取数组的第一个元素",
  returnType: "any",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.first([1, 2, 3])", evaluated: "1" },
    { example: "Array.first([])", evaluated: "undefined" },
  ],
};

const last: DocFunction<<T>(arr: readonly T[]) => T | undefined> = (arr) =>
  arr[arr.length - 1];
last.doc = {
  name: "last",
  description: "获取数组的最后一个元素",
  returnType: "any",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.last([1, 2, 3])", evaluated: "3" },
    { example: "Array.last([])", evaluated: "undefined" },
  ],
};

const randomItem: DocFunction<<T>(arr: readonly T[]) => T | undefined> = (
  arr
) => {
  if (arr.length === 0) return undefined;
  const index = Math.floor(Math.random() * arr.length);
  return arr[index];
};
randomItem.doc = {
  name: "randomItem",
  description: "随机获取数组中的一个元素",
  returnType: "any",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.randomItem([1, 2, 3])", evaluated: "2" },
    { example: "Array.randomItem(['a', 'b', 'c'])", evaluated: "'b'" },
  ],
};

const sum: DocFunction<(arr: readonly number[]) => number> = (arr) =>
  arr.reduce((acc, cur) => acc + cur, 0);
sum.doc = {
  name: "sum",
  description: "计算数字数组的总和",
  returnType: "number",
  isFunction: true,
  args: [{ name: "arr", type: "number[]", description: "数字数组" }],
  examples: [
    { example: "Array.sum([1, 2, 3, 4, 5])", evaluated: "15" },
    { example: "Array.sum([])", evaluated: "0" },
  ],
};

const reverse: DocFunction<<T>(arr: readonly T[]) => T[]> = (arr) =>
  [...arr].reverse();
reverse.doc = {
  name: "reverse",
  description: "反转数组，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.reverse([1, 2, 3])", evaluated: "[3, 2, 1]" },
    { example: "Array.reverse(['a', 'b', 'c'])", evaluated: "['c', 'b', 'a']" },
  ],
};

const append: DocFunction<<T>(arr: readonly T[], ...items: T[]) => T[]> = (
  arr,
  ...items
) => [...arr, ...items];
append.doc = {
  name: "append",
  description: "在数组末尾添加元素，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [
    { name: "arr", type: "any[]", description: "目标数组" },
    {
      name: "items",
      type: "any[]",
      variadic: true,
      description: "要添加的元素",
    },
  ],
  examples: [
    { example: "Array.append([1, 2], 3, 4)", evaluated: "[1, 2, 3, 4]" },
    { example: "Array.append(['a'], 'b')", evaluated: "['a', 'b']" },
  ],
};

const prepend: DocFunction<<T>(arr: readonly T[], ...items: T[]) => T[]> = (
  arr,
  ...items
) => [...items, ...arr];
prepend.doc = {
  name: "prepend",
  description: "在数组开头添加元素，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [
    { name: "arr", type: "any[]", description: "目标数组" },
    {
      name: "items",
      type: "any[]",
      variadic: true,
      description: "要添加的元素",
    },
  ],
  examples: [
    { example: "Array.prepend([3, 4], 1, 2)", evaluated: "[1, 2, 3, 4]" },
    { example: "Array.prepend(['b'], 'a')", evaluated: "['a', 'b']" },
  ],
};

const unique: DocFunction<<T>(arr: readonly T[]) => T[]> = (arr) => [
  ...new Set(arr),
];
unique.doc = {
  name: "unique",
  description: "数组去重，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.unique([1, 2, 2, 3, 3, 3])", evaluated: "[1, 2, 3]" },
    { example: "Array.unique(['a', 'a', 'b'])", evaluated: "['a', 'b']" },
  ],
};

const shuffle: DocFunction<<T>(arr: readonly T[]) => T[]> = (arr) => {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};
shuffle.doc = {
  name: "shuffle",
  description: "随机打乱数组顺序，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [{ name: "arr", type: "any[]", description: "目标数组" }],
  examples: [
    { example: "Array.shuffle([1, 2, 3, 4, 5])", evaluated: "[3, 1, 5, 2, 4]" },
  ],
};

// ============ 导出 Array 扩展 ============

export const ArrayMethods = {
  at,
  first,
  last,
  randomItem,
  sum,
  reverse,
  append,
  prepend,
  unique,
  shuffle,
} as const;

/**
 * Array 扩展映射（用于代码补全）
 */
export const arrayExtensions = {
  typeName: "Array",
  functions: ArrayMethods,
};
