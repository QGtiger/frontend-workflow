import type { DocMetadata } from "./type";

export const ObjectStaticMethodsDoc: DocMetadata[] = [
  {
    name: "keys",
    description: "返回对象自身可枚举属性的键名数组",
    returnType: "string[]",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/keys",
    args: [{ name: "obj", type: "object", description: "目标对象" }],
    examples: [
      { example: "Object.keys({ a: 1, b: 2 })", evaluated: "['a', 'b']" },
      { example: "Object.keys({})", evaluated: "[]" },
      { example: "Object.keys([1, 2, 3])", evaluated: "['0', '1', '2']" },
    ],
  },
  {
    name: "values",
    description: "返回对象自身可枚举属性的值数组",
    returnType: "any[]",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/values",
    args: [{ name: "obj", type: "object", description: "目标对象" }],
    examples: [
      { example: "Object.values({ a: 1, b: 2 })", evaluated: "[1, 2]" },
      { example: "Object.values({})", evaluated: "[]" },
      { example: "Object.values([1, 2, 3])", evaluated: "[1, 2, 3]" },
    ],
  },
  {
    name: "entries",
    description: "返回对象自身可枚举属性的键值对数组",
    returnType: "[string, any][]",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/entries",
    args: [{ name: "obj", type: "object", description: "目标对象" }],
    examples: [
      {
        example: "Object.entries({ a: 1, b: 2 })",
        evaluated: "[['a', 1], ['b', 2]]",
      },
      { example: "Object.entries({})", evaluated: "[]" },
      {
        example: "Object.entries({ name: 'Alice', age: 25 })",
        evaluated: "[['name', 'Alice'], ['age', 25]]",
      },
    ],
  },
  {
    name: "assign",
    description: "将所有可枚举属性的值从一个或多个源对象复制到目标对象",
    returnType: "object",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Object/assign",
    args: [
      { name: "target", type: "object", description: "目标对象" },
      {
        name: "sources",
        type: "object[]",
        variadic: true,
        description: "源对象",
      },
    ],
    examples: [
      {
        example: "Object.assign({}, { a: 1 }, { b: 2 })",
        evaluated: "{ a: 1, b: 2 }",
      },
      {
        example: "Object.assign({ a: 1 }, { a: 2 }, { c: 3 })",
        evaluated: "{ a: 2, c: 3 }",
      },
    ],
  },
];
