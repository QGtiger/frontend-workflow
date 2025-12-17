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

const get: DocFunction<
  <T>(obj: Record<string, any>, path: string, defaultValue?: T) => T | undefined
> = (obj, path, defaultValue) => {
  const keys = path.replace(/\[(\d+)\]/g, ".$1").split(".");
  let result: any = obj;
  for (const key of keys) {
    if (result == null) return defaultValue;
    result = result[key];
  }
  return result === undefined ? defaultValue : result;
};
get.doc = {
  name: "get",
  description: "安全获取嵌套属性值，支持路径字符串和默认值",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "obj", type: "object", description: "目标对象" },
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
    { example: "Object.get({ a: { b: 1 } }, 'a.b')", evaluated: "1" },
    { example: "Object.get({ a: [{ b: 2 }] }, 'a[0].b')", evaluated: "2" },
    { example: "Object.get({}, 'a.b', 'default')", evaluated: "'default'" },
  ],
};

const has: DocFunction<(obj: Record<string, any>, key: string) => boolean> = (
  obj,
  key
) => Object.prototype.hasOwnProperty.call(obj, key);
has.doc = {
  name: "has",
  description: "判断对象是否拥有指定的自有属性",
  returnType: "boolean",
  isFunction: true,
  args: [
    { name: "obj", type: "object", description: "目标对象" },
    { name: "key", type: "string", description: "属性名" },
  ],
  examples: [
    { example: "Object.has({ a: 1 }, 'a')", evaluated: "true" },
    { example: "Object.has({ a: 1 }, 'b')", evaluated: "false" },
  ],
};

const pick: DocFunction<
  <T extends object, K extends keyof T>(obj: T, ...keys: K[]) => Pick<T, K>
> = (obj, ...keys) => {
  const result = {} as any;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
};
pick.doc = {
  name: "pick",
  description: "选取对象中指定的属性，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "obj", type: "object", description: "目标对象" },
    {
      name: "keys",
      type: "string[]",
      variadic: true,
      description: "要选取的键名",
    },
  ],
  examples: [
    {
      example: "Object.pick({ a: 1, b: 2, c: 3 }, 'a', 'c')",
      evaluated: "{ a: 1, c: 3 }",
    },
  ],
};

const omit: DocFunction<
  <T extends object, K extends keyof T>(obj: T, ...keys: K[]) => Omit<T, K>
> = (obj, ...keys) => {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
};
omit.doc = {
  name: "omit",
  description: "排除对象中指定的属性，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "obj", type: "object", description: "目标对象" },
    {
      name: "keys",
      type: "string[]",
      variadic: true,
      description: "要排除的键名",
    },
  ],
  examples: [
    {
      example: "Object.omit({ a: 1, b: 2, c: 3 }, 'b')",
      evaluated: "{ a: 1, c: 3 }",
    },
  ],
};

const merge: DocFunction<
  <T extends object, U extends object>(target: T, source: U) => T & U
> = (target, source) => ({ ...target, ...source });
merge.doc = {
  name: "merge",
  description: "浅合并两个对象，返回新对象（不修改原对象）",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "target", type: "object", description: "目标对象" },
    { name: "source", type: "object", description: "源对象" },
  ],
  examples: [
    {
      example: "Object.merge({ a: 1 }, { b: 2 })",
      evaluated: "{ a: 1, b: 2 }",
    },
    { example: "Object.merge({ a: 1 }, { a: 2 })", evaluated: "{ a: 2 }" },
  ],
};

const isEmpty: DocFunction<(obj: Record<string, any>) => boolean> = (obj) =>
  Object.keys(obj).length === 0;
isEmpty.doc = {
  name: "isEmpty",
  description: "判断对象是否为空（没有自有属性）",
  returnType: "boolean",
  isFunction: true,
  args: [{ name: "obj", type: "object", description: "目标对象" }],
  examples: [
    { example: "Object.isEmpty({})", evaluated: "true" },
    { example: "Object.isEmpty({ a: 1 })", evaluated: "false" },
  ],
};

const size: DocFunction<(obj: Record<string, any>) => number> = (obj) =>
  Object.keys(obj).length;
size.doc = {
  name: "size",
  description: "获取对象的属性数量",
  returnType: "number",
  isFunction: true,
  args: [{ name: "obj", type: "object", description: "目标对象" }],
  examples: [
    { example: "Object.size({ a: 1, b: 2, c: 3 })", evaluated: "3" },
    { example: "Object.size({})", evaluated: "0" },
  ],
};

// ============ 导出 Object 扩展 ============

export const ObjectMethods = {
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
 * Object 扩展映射（用于代码补全）
 */
export const objectExtensions = {
  typeName: "Object",
  functions: ObjectMethods,
};
