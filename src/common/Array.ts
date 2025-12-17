import type { DocFunction } from "./type";

// ============ 静态方法实现 ============

const isArray: DocFunction<(value: any) => boolean> = (value) =>
  Array.isArray(value);
isArray.doc = {
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
};

// ============ 导出 Array 扩展 ============

export const ArrayMethods = {
  isArray,
} as const;

/**
 * Array 扩展映射（用于代码补全）
 */
export const arrayExtensions = {
  typeName: "Array",
  functions: ArrayMethods,
};
