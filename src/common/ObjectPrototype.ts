import type { DocFunction } from "./type";

// ============ 原型方法实现 ============

const keys: DocFunction<() => string[]> = function (this: Record<string, any>) {
  return Object.keys(this);
} as any;
keys.doc = {
  name: "keys",
  description: "获取对象的所有键",
  returnType: "string[]",
  isFunction: true,
  examples: [
    { example: "({ a: 1, b: 2 }).keys()", evaluated: "['a', 'b']" },
    { example: "({}).keys()", evaluated: "[]" },
  ],
};

const values: DocFunction<() => any[]> = function (this: Record<string, any>) {
  return Object.values(this);
} as any;
values.doc = {
  name: "values",
  description: "获取对象的所有值",
  returnType: "any[]",
  isFunction: true,
  examples: [
    { example: "({ a: 1, b: 2 }).values()", evaluated: "[1, 2]" },
    { example: "({}).values()", evaluated: "[]" },
  ],
};

const entries: DocFunction<() => [string, any][]> = function (
  this: Record<string, any>
) {
  return Object.entries(this);
} as any;
entries.doc = {
  name: "entries",
  description: "获取对象的所有键值对",
  returnType: "[string, any][]",
  isFunction: true,
  examples: [
    {
      example: "({ a: 1, b: 2 }).entries()",
      evaluated: "[['a', 1], ['b', 2]]",
    },
  ],
};

const get: DocFunction<(path: string, defaultValue?: any) => any> = function (
  this: Record<string, any>,
  path: string,
  defaultValue?: any
) {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  const result = keys.reduce((obj: any, key: string) => {
    return obj?.[key];
  }, this);
  return result === undefined ? defaultValue : result;
} as any;
get.doc = {
  name: "get",
  description: "安全获取嵌套属性值，支持路径字符串和默认值",
  returnType: "any",
  isFunction: true,
  args: [
    {
      name: "path",
      type: "string",
      description: "属性路径，如 'a.b.c' 或 'a[0].b'",
    },
    {
      name: "defaultValue",
      type: "any",
      optional: true,
      description: "默认值",
    },
  ],
  examples: [
    { example: "({ a: { b: 1 } }).get('a.b')", evaluated: "1" },
    { example: "({ a: [{ b: 2 }] }).get('a[0].b')", evaluated: "2" },
    { example: "({}).get('a.b', 'default')", evaluated: "'default'" },
  ],
};

const has: DocFunction<(key: string) => boolean> = function (
  this: Record<string, any>,
  key: string
) {
  return Object.prototype.hasOwnProperty.call(this, key);
} as any;
has.doc = {
  name: "has",
  description: "判断对象是否拥有指定的自有属性",
  returnType: "boolean",
  isFunction: true,
  args: [{ name: "key", type: "string", description: "属性名" }],
  examples: [
    { example: "({ a: 1 }).has('a')", evaluated: "true" },
    { example: "({ a: 1 }).has('b')", evaluated: "false" },
  ],
};

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

const size: DocFunction<() => number> = function (this: Record<string, any>) {
  return Object.keys(this).length;
} as any;
size.doc = {
  name: "size",
  description: "获取对象的属性数量",
  returnType: "number",
  isFunction: true,
  examples: [
    { example: "({ a: 1, b: 2, c: 3 }).size()", evaluated: "3" },
    { example: "({}).size()", evaluated: "0" },
  ],
};

// ============ 导出 ObjectPrototype 扩展 ============

export const ObjectPrototypeMethods = {
  keys,
  values,
  entries,
  get,
  has,
  pick,
  omit,
  merge,
  isEmpty,
  size,
} as const;

/**
 * ObjectPrototype 扩展映射（用于代码补全）
 */
export const objectPrototypeExtensions = {
  typeName: "ObjectPrototype",
  functions: ObjectPrototypeMethods,
};
