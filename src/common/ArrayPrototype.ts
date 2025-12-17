import type { DocFunction } from "./type";

// ============ 原型方法实现 ============

const at: DocFunction<(index: number) => any> = function (
  this: any[],
  index: number
) {
  const len = this.length;
  const i = index < 0 ? len + index : index;
  return this[i];
} as any;
at.doc = {
  name: "at",
  description: "获取指定索引的元素，支持负数索引（-1 表示最后一个）",
  returnType: "any",
  isFunction: true,
  args: [{ name: "index", type: "number", description: "索引，支持负数" }],
  examples: [
    { example: "[1, 2, 3].at(0)", evaluated: "1" },
    { example: "[1, 2, 3].at(-1)", evaluated: "3" },
  ],
};

const first: DocFunction<() => any> = function (this: any[]) {
  return this[0];
} as any;
first.doc = {
  name: "first",
  description: "获取数组的第一个元素",
  returnType: "any",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3].first()", evaluated: "1" },
    { example: "[].first()", evaluated: "undefined" },
  ],
};

const last: DocFunction<() => any> = function (this: any[]) {
  return this[this.length - 1];
} as any;
last.doc = {
  name: "last",
  description: "获取数组的最后一个元素",
  returnType: "any",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3].last()", evaluated: "3" },
    { example: "[].last()", evaluated: "undefined" },
  ],
};

const randomItem: DocFunction<() => any> = function (this: any[]) {
  if (this.length === 0) return undefined;
  const index = Math.floor(Math.random() * this.length);
  return this[index];
} as any;
randomItem.doc = {
  name: "randomItem",
  description: "随机获取数组中的一个元素",
  returnType: "any",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3].randomItem()", evaluated: "2" },
    { example: "['a', 'b', 'c'].randomItem()", evaluated: "'b'" },
  ],
};

const sum: DocFunction<() => number> = function (this: number[]) {
  return this.reduce((acc, cur) => acc + cur, 0);
} as any;
sum.doc = {
  name: "sum",
  description: "计算数字数组的总和",
  returnType: "number",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3, 4, 5].sum()", evaluated: "15" },
    { example: "[].sum()", evaluated: "0" },
  ],
};

const reverse: DocFunction<() => any[]> = function (this: any[]) {
  return [...this].reverse();
} as any;
reverse.doc = {
  name: "reverse",
  description: "反转数组，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3].reverse()", evaluated: "[3, 2, 1]" },
    { example: "['a', 'b', 'c'].reverse()", evaluated: "['c', 'b', 'a']" },
  ],
};

const append: DocFunction<(...items: any[]) => any[]> = function (
  this: any[],
  ...items: any[]
) {
  return [...this, ...items];
} as any;
append.doc = {
  name: "append",
  description: "在数组末尾添加元素，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [
    {
      name: "items",
      type: "any[]",
      variadic: true,
      description: "要添加的元素",
    },
  ],
  examples: [
    { example: "[1, 2].append(3, 4)", evaluated: "[1, 2, 3, 4]" },
    { example: "['a'].append('b')", evaluated: "['a', 'b']" },
  ],
};

const prepend: DocFunction<(...items: any[]) => any[]> = function (
  this: any[],
  ...items: any[]
) {
  return [...items, ...this];
} as any;
prepend.doc = {
  name: "prepend",
  description: "在数组开头添加元素，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  args: [
    {
      name: "items",
      type: "any[]",
      variadic: true,
      description: "要添加的元素",
    },
  ],
  examples: [
    { example: "[3, 4].prepend(1, 2)", evaluated: "[1, 2, 3, 4]" },
    { example: "['b'].prepend('a')", evaluated: "['a', 'b']" },
  ],
};

const unique: DocFunction<() => any[]> = function (this: any[]) {
  return [...new Set(this)];
} as any;
unique.doc = {
  name: "unique",
  description: "数组去重，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  examples: [
    { example: "[1, 2, 2, 3, 3, 3].unique()", evaluated: "[1, 2, 3]" },
    { example: "['a', 'a', 'b'].unique()", evaluated: "['a', 'b']" },
  ],
};

const shuffle: DocFunction<() => any[]> = function (this: any[]) {
  const result = [...this];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
} as any;
shuffle.doc = {
  name: "shuffle",
  description: "随机打乱数组顺序，返回新数组（不修改原数组）",
  returnType: "any[]",
  isFunction: true,
  examples: [
    { example: "[1, 2, 3, 4, 5].shuffle()", evaluated: "[3, 1, 5, 2, 4]" },
  ],
};

// ============ 导出 ArrayPrototype 扩展 ============

export const ArrayPrototypeMethods = {
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
 * ArrayPrototype 扩展映射（用于代码补全）
 */
export const arrayPrototypeExtensions = {
  typeName: "ArrayPrototype",
  functions: ArrayPrototypeMethods,
};
