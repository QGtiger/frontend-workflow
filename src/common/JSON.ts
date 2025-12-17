import type { DocFunction } from "./type";

// ============ 静态方法实现 ============

const parse: DocFunction<
  <T = any>(text: string, defaultValue?: T) => T | undefined
> = (text, defaultValue) => {
  try {
    return JSON.parse(text);
  } catch {
    return defaultValue;
  }
};
parse.doc = {
  name: "parse",
  description: "安全解析 JSON 字符串，解析失败返回默认值而不抛出异常",
  returnType: "any",
  isFunction: true,
  args: [
    { name: "text", type: "string", description: "JSON 字符串" },
    {
      name: "defaultValue",
      type: "any",
      optional: true,
      description: "解析失败时的默认值",
    },
  ],
  examples: [
    { example: "JSON.parse('{\"a\":1}')", evaluated: "{ a: 1 }" },
    { example: "JSON.parse('invalid', {})", evaluated: "{}" },
    { example: "JSON.parse('[1, 2, 3]')", evaluated: "[1, 2, 3]" },
  ],
};

const stringify: DocFunction<
  (value: any, pretty?: boolean | number) => string
> = (value, pretty = false) => {
  const space = pretty === true ? 2 : pretty === false ? undefined : pretty;
  return JSON.stringify(value, null, space);
};
stringify.doc = {
  name: "stringify",
  description: "将值序列化为 JSON 字符串，支持格式化输出",
  returnType: "string",
  isFunction: true,
  args: [
    { name: "value", type: "any", description: "要序列化的值" },
    {
      name: "pretty",
      type: "boolean | number",
      optional: true,
      description: "是否格式化，true 为 2 空格缩进，数字为指定缩进",
    },
  ],
  examples: [
    { example: "JSON.stringify({ a: 1 })", evaluated: "'{\"a\":1}'" },
    {
      example: "JSON.stringify({ a: 1 }, true)",
      evaluated: "'{\\n  \"a\": 1\\n}'",
    },
    { example: "JSON.stringify([1, 2, 3])", evaluated: "'[1,2,3]'" },
  ],
};

const isValid: DocFunction<(text: string) => boolean> = (text) => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};
isValid.doc = {
  name: "isValid",
  description: "判断字符串是否是有效的 JSON 格式",
  returnType: "boolean",
  isFunction: true,
  args: [{ name: "text", type: "string", description: "要验证的字符串" }],
  examples: [
    { example: "JSON.isValid('{\"a\":1}')", evaluated: "true" },
    { example: "JSON.isValid('invalid')", evaluated: "false" },
    { example: "JSON.isValid('[1, 2, 3]')", evaluated: "true" },
  ],
};

// ============ 导出 JSON 扩展 ============

export const JSONMethods = {
  parse,
  stringify,
  isValid,
} as const;

/**
 * JSON 扩展映射（用于代码补全）
 */
export const jsonExtensions = {
  typeName: "JSON",
  functions: JSONMethods,
};
