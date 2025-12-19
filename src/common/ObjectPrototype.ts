import type { DocFunction, DocMetadata } from "./type";

// ============ 原型方法实现 ============

const pick: DocFunction<(...keys: string[]) => any> = function (
  this: Record<string, any>,
  ...keys: string[]
) {
  const result: any = {};
  for (const key of keys) {
    if (key in this) {
      result[key] = this[key];
    }
  }
  return result;
} as any;
pick.doc = {
  name: "pick",
  description: "选取对象中指定的属性，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    {
      name: "keys",
      type: "string[]",
      variadic: true,
      description: "要选取的键名",
    },
  ],
  examples: [
    {
      example: "({ a: 1, b: 2, c: 3 }).pick('a', 'c')",
      evaluated: "{ a: 1, c: 3 }",
    },
  ],
};

const omit: DocFunction<(...keys: string[]) => any> = function (
  this: Record<string, any>,
  ...keys: string[]
) {
  const result = { ...this };
  for (const key of keys) {
    delete result[key];
  }
  return result;
} as any;
omit.doc = {
  name: "omit",
  description: "排除对象中指定的属性，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    {
      name: "keys",
      type: "string[]",
      variadic: true,
      description: "要排除的键名",
    },
  ],
  examples: [
    {
      example: "({ a: 1, b: 2, c: 3 }).omit('b')",
      evaluated: "{ a: 1, c: 3 }",
    },
  ],
};

const merge: DocFunction<(source: any) => any> = function (
  this: Record<string, any>,
  source: any
) {
  return { ...this, ...source };
} as any;
merge.doc = {
  name: "merge",
  description: "浅合并另一个对象，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [{ name: "source", type: "object", description: "要合并的对象" }],
  examples: [
    {
      example: "({ a: 1 }).merge({ b: 2 })",
      evaluated: "{ a: 1, b: 2 }",
    },
    { example: "({ a: 1 }).merge({ a: 2 })", evaluated: "{ a: 2 }" },
  ],
};

const isEmpty: DocFunction<() => boolean> = function (
  this: Record<string, any>
) {
  return Object.keys(this).length === 0;
} as any;
isEmpty.doc = {
  name: "isEmpty",
  description: "判断对象是否为空（没有自有属性）",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "({}).isEmpty()", evaluated: "true" },
    { example: "({ a: 1 }).isEmpty()", evaluated: "false" },
  ],
};

// ============ 导出 ObjectPrototype 扩展 ============

export const ObjectPrototypeMethods = {
  pick,
  omit,
  merge,
  isEmpty,
} as const;

// ============ 原生方法的文档定义 ============

export const ObjectPrototypeNativeMethodsDocs: DocMetadata[] = [
  {
    name: "hasOwnProperty",
    description: "判断对象自身是否拥有指定的属性（不包括原型链）",
    returnType: "boolean",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty",
    args: [{ name: "prop", type: "string", description: "属性名" }],
    examples: [
      { example: "({ a: 1 }).hasOwnProperty('a')", evaluated: "true" },
      { example: "({ a: 1 }).hasOwnProperty('b')", evaluated: "false" },
      { example: "({ a: 1 }).hasOwnProperty('toString')", evaluated: "false" },
    ],
  },
  {
    name: "toString",
    description: "返回对象的字符串表示",
    returnType: "string",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/toString",
    examples: [
      { example: "({ a: 1 }).toString()", evaluated: "'[object Object]'" },
      { example: "[1, 2, 3].toString()", evaluated: "'1,2,3'" },
    ],
  },
];

/**
 * ObjectPrototype 扩展映射（用于代码补全）
 */
export const objectPrototypeExtensions = {
  typeName: "ObjectPrototype",
  functions: ObjectPrototypeMethods,
  nativeDocs: ObjectPrototypeNativeMethodsDocs,
};

export const ObjectPrototypeMethodsDoc: DocMetadata[] = Object.values(
  ObjectPrototypeMethods
)
  .map((func) => func.doc)
  .concat(ObjectPrototypeNativeMethodsDocs)
  .sort((a, b) => a.name.localeCompare(b.name));
