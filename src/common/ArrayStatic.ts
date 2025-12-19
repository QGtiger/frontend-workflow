import type { DocMetadata } from "./type";

export const ArrayStaticMethodsDoc: DocMetadata[] = [
  {
    name: "isArray",
    description: "判断一个值是否是数组",
    returnType: "boolean",
    isFunction: true,
    args: [{ name: "value", type: "any", description: "要判断的值" }],
    examples: [
      { example: "Array.isArray([1, 2, 3])", evaluated: "true" },
      { example: "Array.isArray('hello')", evaluated: "false" },
      { example: "Array.isArray({})", evaluated: "false" },
    ],
  },
  {
    name: "from",
    description: "从类数组对象或可迭代对象创建一个新数组",
    returnType: "any[]",
    isFunction: true,
    args: [
      {
        name: "arrayLike",
        type: "ArrayLike<any> | Iterable<any>",
        description: "类数组对象或可迭代对象",
      },
      {
        name: "mapFn",
        type: "(value: any, index: number) => any",
        optional: true,
        description: "映射函数",
      },
    ],
    examples: [
      {
        example: "Array.from('hello')",
        evaluated: "['h', 'e', 'l', 'l', 'o']",
      },
      { example: "Array.from([1, 2, 3], x => x * 2)", evaluated: "[2, 4, 6]" },
      {
        example: "Array.from({length: 3}, (_, i) => i)",
        evaluated: "[0, 1, 2]",
      },
    ],
  },
  {
    name: "of",
    description: "创建一个包含所有传入参数的新数组",
    returnType: "any[]",
    isFunction: true,
    args: [
      {
        name: "items",
        type: "any[]",
        variadic: true,
        description: "要创建数组的元素",
      },
    ],
    examples: [
      { example: "Array.of(1, 2, 3)", evaluated: "[1, 2, 3]" },
      { example: "Array.of('a', 'b', 'c')", evaluated: "['a', 'b', 'c']" },
      { example: "Array.of(1)", evaluated: "[1]" },
    ],
  },
];
