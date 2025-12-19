import type { DocFunction, DocMetadata } from "./type";

// ============ 原型方法实现 ============

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
  first,
  last,
  randomItem,
  sum,
  append,
  prepend,
  unique,
  shuffle,
} as const;

// ============ 原生方法的文档定义 ============

export const ArrayPrototypeNativeMethodsDocs: DocMetadata[] = [
  {
    name: "at",
    description: "获取指定索引的元素，支持负数索引（-1 表示最后一个）",
    returnType: "any",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/at",
    args: [{ name: "index", type: "number", description: "索引，支持负数" }],
    examples: [
      { example: "[1, 2, 3].at(0)", evaluated: "1" },
      { example: "[1, 2, 3].at(-1)", evaluated: "3" },
      { example: "[1, 2, 3].at(-2)", evaluated: "2" },
    ],
  },
  {
    name: "map",
    description:
      "创建一个新数组，其结果是该数组中的每个元素都调用一次提供的函数后的返回值",
    returnType: "any[]",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/map",
    args: [
      {
        name: "callback",
        type: "(value: any, index: number, array: any[]) => any",
        description: "回调函数",
      },
    ],
    examples: [
      { example: "[1, 2, 3].map(x => x * 2)", evaluated: "[2, 4, 6]" },
      { example: "['a', 'b'].map((x, i) => x + i)", evaluated: "['a0', 'b1']" },
    ],
  },
  {
    name: "filter",
    description: "创建一个新数组，包含所有通过测试的元素",
    returnType: "any[]",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/filter",
    args: [
      {
        name: "callback",
        type: "(value: any, index: number, array: any[]) => boolean",
        description: "测试函数",
      },
    ],
    examples: [
      { example: "[1, 2, 3, 4].filter(x => x > 2)", evaluated: "[3, 4]" },
      {
        example: "['a', 'b', 'c'].filter((_, i) => i % 2 === 0)",
        evaluated: "['a', 'c']",
      },
    ],
  },
  {
    name: "reduce",
    description:
      "对数组中的每个元素执行一个 reducer 函数，将其结果汇总为单个返回值",
    returnType: "any",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce",
    args: [
      {
        name: "callback",
        type: "(accumulator: any, current: any, index: number, array: any[]) => any",
        description: "reducer 函数",
      },
      {
        name: "initialValue",
        type: "any",
        optional: true,
        description: "初始值",
      },
    ],
    examples: [
      { example: "[1, 2, 3].reduce((acc, x) => acc + x, 0)", evaluated: "6" },
      {
        example: "['a', 'b', 'c'].reduce((acc, x) => acc + x)",
        evaluated: "'abc'",
      },
    ],
  },
];

/**
 * ArrayPrototype 扩展映射（用于代码补全）
 */
export const arrayPrototypeExtensions = {
  typeName: "ArrayPrototype",
  functions: ArrayPrototypeMethods,
  nativeDocs: ArrayPrototypeNativeMethodsDocs,
};

export const ArrayPrototypeMethodsDoc: DocMetadata[] = Object.values(
  ArrayPrototypeMethods
)
  .map((func) => func.doc)
  .concat(ArrayPrototypeNativeMethodsDocs);
