import type { DocFunction } from "./type";

// ============ 静态方法实现 ============

const keys: DocFunction<<T extends object>(obj: T) => (keyof T)[]> = (obj) =>
  Object.keys(obj) as (keyof typeof obj)[];
keys.doc = {
  name: "keys",
  description: "获取对象的所有键",
  returnType: "string[]",
  isFunction: true,
  args: [{ name: "obj", type: "object", description: "目标对象" }],
  examples: [
    { example: "Object.keys({ a: 1, b: 2 })", evaluated: "['a', 'b']" },
    { example: "Object.keys({})", evaluated: "[]" },
  ],
};

const values: DocFunction<<T extends object>(obj: T) => T[keyof T][]> = (obj) =>
  Object.values(obj);
values.doc = {
  name: "values",
  description: "获取对象的所有值",
  returnType: "any[]",
  isFunction: true,
  args: [{ name: "obj", type: "object", description: "目标对象" }],
  examples: [
    { example: "Object.values({ a: 1, b: 2 })", evaluated: "[1, 2]" },
    { example: "Object.values({})", evaluated: "[]" },
  ],
};

const entries: DocFunction<
  <T extends object>(obj: T) => [keyof T, T[keyof T]][]
> = (obj) =>
  Object.entries(obj) as [keyof typeof obj, (typeof obj)[keyof typeof obj]][];
entries.doc = {
  name: "entries",
  description: "获取对象的所有键值对",
  returnType: "[string, any][]",
  isFunction: true,
  args: [{ name: "obj", type: "object", description: "目标对象" }],
  examples: [
    {
      example: "Object.entries({ a: 1, b: 2 })",
      evaluated: "[['a', 1], ['b', 2]]",
    },
  ],
};

const assign: DocFunction<(...sources: any[]) => any> = (...sources) => {
  return Object.assign({}, ...sources);
};
assign.doc = {
  name: "assign",
  description: "合并多个对象，返回一个全新的对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    {
      name: "sources",
      type: "object[]",
      variadic: true,
      description: "要合并的对象",
    },
  ],
  examples: [
    {
      example: "Object.assign({ a: 1 }, { b: 2 })",
      evaluated: "{ a: 1, b: 2 }",
    },
    {
      example: "Object.assign({ a: 1 }, { a: 2 }, { c: 3 })",
      evaluated: "{ a: 2, c: 3 }",
    },
  ],
};

// ============ 导出 Object 扩展 ============

export const ObjectMethods = {
  keys,
  values,
  entries,
  assign,
} as const;

/**
 * Object 扩展映射（用于代码补全）
 */
export const objectExtensions = {
  typeName: "Object",
  functions: ObjectMethods,
};
