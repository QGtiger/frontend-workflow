import type { DocFunction, DocMetadata } from "./type";

// ============ 自定义原型方法实现 ============

const truncate: DocFunction<(length: number, suffix?: string) => string> =
  function (this: string, length: number, suffix: string = "...") {
    if (this.length <= length) return this;
    return this.slice(0, length - suffix.length) + suffix;
  } as any;
truncate.doc = {
  name: "truncate",
  description: "截断字符串到指定长度，超出部分用后缀替代",
  returnType: "string",
  isFunction: true,
  args: [
    { name: "length", type: "number", description: "最大长度" },
    {
      name: "suffix",
      type: "string",
      optional: true,
      description: "后缀，默认为 '...'",
    },
  ],
  examples: [
    { example: "'Hello World'.truncate(5)", evaluated: "'He...'" },
    { example: "'Hello'.truncate(10)", evaluated: "'Hello'" },
    { example: "'Hello World'.truncate(8, '~')", evaluated: "'Hello W~'" },
  ],
};

const capitalize: DocFunction<() => string> = function (this: string) {
  if (this.length === 0) return this;
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
} as any;
capitalize.doc = {
  name: "capitalize",
  description: "首字母大写，其余小写",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'hello'.capitalize()", evaluated: "'Hello'" },
    { example: "'WORLD'.capitalize()", evaluated: "'World'" },
    { example: "'hELLO'.capitalize()", evaluated: "'Hello'" },
  ],
};

const camelCase: DocFunction<() => string> = function (this: string) {
  return this.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) =>
    chr.toUpperCase()
  );
} as any;
camelCase.doc = {
  name: "camelCase",
  description: "转换为驼峰命名",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'hello world'.camelCase()", evaluated: "'helloWorld'" },
    { example: "'foo-bar-baz'.camelCase()", evaluated: "'fooBarBaz'" },
    { example: "'user_name'.camelCase()", evaluated: "'userName'" },
  ],
};

const snakeCase: DocFunction<() => string> = function (this: string) {
  return this.replace(/([A-Z])/g, "_$1")
    .toLowerCase()
    .replace(/^_/, "")
    .replace(/[^a-z0-9]+/g, "_");
} as any;
snakeCase.doc = {
  name: "snakeCase",
  description: "转换为蛇形命名（snake_case）",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'helloWorld'.snakeCase()", evaluated: "'hello_world'" },
    { example: "'fooBarBaz'.snakeCase()", evaluated: "'foo_bar_baz'" },
    { example: "'User Name'.snakeCase()", evaluated: "'user_name'" },
  ],
};

const kebabCase: DocFunction<() => string> = function (this: string) {
  return this.replace(/([A-Z])/g, "-$1")
    .toLowerCase()
    .replace(/^-/, "")
    .replace(/[^a-z0-9]+/g, "-");
} as any;
kebabCase.doc = {
  name: "kebabCase",
  description: "转换为短横线命名（kebab-case）",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'helloWorld'.kebabCase()", evaluated: "'hello-world'" },
    { example: "'fooBarBaz'.kebabCase()", evaluated: "'foo-bar-baz'" },
    { example: "'User Name'.kebabCase()", evaluated: "'user-name'" },
  ],
};

const reverse: DocFunction<() => string> = function (this: string) {
  return this.split("").reverse().join("");
} as any;
reverse.doc = {
  name: "reverse",
  description: "反转字符串",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'hello'.reverse()", evaluated: "'olleh'" },
    { example: "'12345'.reverse()", evaluated: "'54321'" },
  ],
};

const isEmail: DocFunction<() => boolean> = function (this: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(this);
} as any;
isEmail.doc = {
  name: "isEmail",
  description: "判断字符串是否为有效的邮箱地址",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "'user@example.com'.isEmail()", evaluated: "true" },
    { example: "'invalid-email'.isEmail()", evaluated: "false" },
    { example: "'test@test'.isEmail()", evaluated: "false" },
  ],
};

const isUrl: DocFunction<() => boolean> = function (this: string) {
  try {
    new URL(this);
    return true;
  } catch {
    return false;
  }
} as any;
isUrl.doc = {
  name: "isUrl",
  description: "判断字符串是否为有效的 URL",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "'https://example.com'.isUrl()", evaluated: "true" },
    { example: "'not-a-url'.isUrl()", evaluated: "false" },
    { example: "'ftp://file.com'.isUrl()", evaluated: "true" },
  ],
};

const toNumber: DocFunction<() => number> = function (this: string) {
  const num = Number(this);
  return Number.isNaN(num) ? 0 : num;
} as any;
toNumber.doc = {
  name: "toNumber",
  description: "转换为数字，无法转换时返回 0",
  returnType: "number",
  isFunction: true,
  examples: [
    { example: "'123'.toNumber()", evaluated: "123" },
    { example: "'3.14'.toNumber()", evaluated: "3.14" },
    { example: "'abc'.toNumber()", evaluated: "0" },
  ],
};

const isEmpty: DocFunction<() => boolean> = function (this: string) {
  return this.trim().length === 0;
} as any;
isEmpty.doc = {
  name: "isEmpty",
  description: "判断字符串是否为空（忽略空白字符）",
  returnType: "boolean",
  isFunction: true,
  examples: [
    { example: "''.isEmpty()", evaluated: "true" },
    { example: "'   '.isEmpty()", evaluated: "true" },
    { example: "'hello'.isEmpty()", evaluated: "false" },
  ],
};

const mask: DocFunction<
  (start: number, end?: number, char?: string) => string
> = function (this: string, start: number, end?: number, char: string = "*") {
  const endPos = end ?? this.length;
  const beforeMask = this.slice(0, start);
  const masked = char.repeat(endPos - start);
  const afterMask = this.slice(endPos);
  return beforeMask + masked + afterMask;
} as any;
mask.doc = {
  name: "mask",
  description: "遮罩字符串的部分内容",
  returnType: "string",
  isFunction: true,
  args: [
    { name: "start", type: "number", description: "开始位置" },
    { name: "end", type: "number", optional: true, description: "结束位置" },
    {
      name: "char",
      type: "string",
      optional: true,
      description: "遮罩字符，默认为 '*'",
    },
  ],
  examples: [
    { example: "'1234567890'.mask(3, 7)", evaluated: "'123****890'" },
    { example: "'password'.mask(0, 4)", evaluated: "'****word'" },
    { example: "'secret'.mask(2, 5, '#')", evaluated: "'se###t'" },
  ],
};

const removeSpaces: DocFunction<() => string> = function (this: string) {
  return this.replace(/\s+/g, "");
} as any;
removeSpaces.doc = {
  name: "removeSpaces",
  description: "移除所有空白字符",
  returnType: "string",
  isFunction: true,
  examples: [
    { example: "'hello world'.removeSpaces()", evaluated: "'helloworld'" },
    { example: "'a b  c   d'.removeSpaces()", evaluated: "'abcd'" },
  ],
};

const words: DocFunction<() => string[]> = function (this: string) {
  return this.match(/[a-zA-Z0-9]+/g) || [];
} as any;
words.doc = {
  name: "words",
  description: "分割字符串为单词数组",
  returnType: "string[]",
  isFunction: true,
  examples: [
    { example: "'hello world'.words()", evaluated: "['hello', 'world']" },
    { example: "'foo-bar_baz'.words()", evaluated: "['foo', 'bar', 'baz']" },
  ],
};

const count: DocFunction<(substring: string) => number> = function (
  this: string,
  substring: string
) {
  if (substring.length === 0) return 0;
  let count = 0;
  let position = 0;
  while ((position = this.indexOf(substring, position)) !== -1) {
    count++;
    position += substring.length;
  }
  return count;
} as any;
count.doc = {
  name: "count",
  description: "统计子字符串出现的次数",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "substring", type: "string", description: "要统计的子字符串" },
  ],
  examples: [
    { example: "'hello world'.count('l')", evaluated: "3" },
    { example: "'aaa'.count('aa')", evaluated: "1" },
    { example: "'test'.count('x')", evaluated: "0" },
  ],
};

// ============ 导出自定义扩展方法 ============

export const StringPrototypeMethods = {
  truncate,
  capitalize,
  camelCase,
  snakeCase,
  kebabCase,
  reverse,
  isEmail,
  isUrl,
  toNumber,
  isEmpty,
  mask,
  removeSpaces,
  words,
  count,
} as const;

// ============ 原生方法的文档定义 ============

export const StringPrototypeNativeMethodsDocs: DocMetadata[] = [
  {
    name: "charAt",
    description: "返回指定索引位置的字符",
    returnType: "string",
    isFunction: true,
    args: [{ name: "index", type: "number", description: "字符索引" }],
    examples: [
      { example: "'hello'.charAt(0)", evaluated: "'h'" },
      { example: "'hello'.charAt(1)", evaluated: "'e'" },
    ],
  },
  {
    name: "concat",
    description: "连接两个或多个字符串",
    returnType: "string",
    isFunction: true,
    args: [
      {
        name: "strings",
        type: "string[]",
        variadic: true,
        description: "要连接的字符串",
      },
    ],
    examples: [
      { example: "'hello'.concat(' ', 'world')", evaluated: "'hello world'" },
      { example: "'a'.concat('b', 'c')", evaluated: "'abc'" },
    ],
  },
  {
    name: "includes",
    description: "判断字符串是否包含指定的子字符串",
    returnType: "boolean",
    isFunction: true,
    args: [
      { name: "searchString", type: "string", description: "要搜索的字符串" },
      {
        name: "position",
        type: "number",
        optional: true,
        description: "开始搜索的位置",
      },
    ],
    examples: [
      { example: "'hello world'.includes('world')", evaluated: "true" },
      { example: "'hello'.includes('bye')", evaluated: "false" },
    ],
  },
  {
    name: "indexOf",
    description: "返回子字符串首次出现的索引，未找到返回 -1",
    returnType: "number",
    isFunction: true,
    args: [
      { name: "searchString", type: "string", description: "要搜索的字符串" },
      {
        name: "position",
        type: "number",
        optional: true,
        description: "开始搜索的位置",
      },
    ],
    examples: [
      { example: "'hello'.indexOf('l')", evaluated: "2" },
      { example: "'hello'.indexOf('x')", evaluated: "-1" },
    ],
  },
  {
    name: "slice",
    description: "提取字符串的一部分并返回新字符串",
    returnType: "string",
    isFunction: true,
    args: [
      { name: "start", type: "number", description: "开始索引" },
      { name: "end", type: "number", optional: true, description: "结束索引" },
    ],
    examples: [
      { example: "'hello'.slice(0, 2)", evaluated: "'he'" },
      { example: "'hello'.slice(2)", evaluated: "'llo'" },
      { example: "'hello'.slice(-2)", evaluated: "'lo'" },
    ],
  },
  {
    name: "split",
    description: "将字符串分割为数组",
    returnType: "string[]",
    isFunction: true,
    args: [
      {
        name: "separator",
        type: "string | RegExp",
        description: "分隔符",
      },
      {
        name: "limit",
        type: "number",
        optional: true,
        description: "限制数量",
      },
    ],
    examples: [
      { example: "'a,b,c'.split(',')", evaluated: "['a', 'b', 'c']" },
      { example: "'hello'.split('')", evaluated: "['h', 'e', 'l', 'l', 'o']" },
    ],
  },
  {
    name: "toLowerCase",
    description: "转换为小写",
    returnType: "string",
    isFunction: true,
    examples: [{ example: "'HELLO'.toLowerCase()", evaluated: "'hello'" }],
  },
  {
    name: "toUpperCase",
    description: "转换为大写",
    returnType: "string",
    isFunction: true,
    examples: [{ example: "'hello'.toUpperCase()", evaluated: "'HELLO'" }],
  },
  {
    name: "trim",
    description: "移除字符串两端的空白字符",
    returnType: "string",
    isFunction: true,
    examples: [{ example: "'  hello  '.trim()", evaluated: "'hello'" }],
  },
  {
    name: "trimStart",
    description: "移除字符串开头的空白字符",
    returnType: "string",
    isFunction: true,
    examples: [{ example: "'  hello'.trimStart()", evaluated: "'hello'" }],
  },
  {
    name: "trimEnd",
    description: "移除字符串末尾的空白字符",
    returnType: "string",
    isFunction: true,
    examples: [{ example: "'hello  '.trimEnd()", evaluated: "'hello'" }],
  },
  {
    name: "padStart",
    description: "用指定字符填充字符串开头到指定长度",
    returnType: "string",
    isFunction: true,
    args: [
      { name: "targetLength", type: "number", description: "目标长度" },
      {
        name: "padString",
        type: "string",
        optional: true,
        description: "填充字符",
      },
    ],
    examples: [
      { example: "'5'.padStart(3, '0')", evaluated: "'005'" },
      { example: "'hello'.padStart(10, '*')", evaluated: "'*****hello'" },
    ],
  },
  {
    name: "padEnd",
    description: "用指定字符填充字符串末尾到指定长度",
    returnType: "string",
    isFunction: true,
    args: [
      { name: "targetLength", type: "number", description: "目标长度" },
      {
        name: "padString",
        type: "string",
        optional: true,
        description: "填充字符",
      },
    ],
    examples: [
      { example: "'5'.padEnd(3, '0')", evaluated: "'500'" },
      { example: "'hello'.padEnd(10, '*')", evaluated: "'hello*****'" },
    ],
  },
  {
    name: "repeat",
    description: "重复字符串指定次数",
    returnType: "string",
    isFunction: true,
    args: [{ name: "count", type: "number", description: "重复次数" }],
    examples: [
      { example: "'ha'.repeat(3)", evaluated: "'hahaha'" },
      { example: "'*'.repeat(5)", evaluated: "'*****'" },
    ],
  },
  {
    name: "replace",
    description: "替换匹配的子字符串",
    returnType: "string",
    isFunction: true,
    args: [
      {
        name: "searchValue",
        type: "string | RegExp",
        description: "要搜索的值",
      },
      {
        name: "replaceValue",
        type: "string",
        description: "替换值",
      },
    ],
    examples: [
      { example: "'hello'.replace('l', 'L')", evaluated: "'heLlo'" },
      { example: "'hello'.replace(/l/g, 'L')", evaluated: "'heLLo'" },
    ],
  },
  {
    name: "replaceAll",
    description: "替换所有匹配的子字符串",
    returnType: "string",
    isFunction: true,
    args: [
      { name: "searchValue", type: "string", description: "要搜索的值" },
      { name: "replaceValue", type: "string", description: "替换值" },
    ],
    examples: [
      { example: "'hello'.replaceAll('l', 'L')", evaluated: "'heLLo'" },
    ],
  },
  {
    name: "startsWith",
    description: "判断字符串是否以指定子字符串开头",
    returnType: "boolean",
    isFunction: true,
    args: [
      { name: "searchString", type: "string", description: "要搜索的字符串" },
      {
        name: "position",
        type: "number",
        optional: true,
        description: "开始位置",
      },
    ],
    examples: [
      { example: "'hello'.startsWith('he')", evaluated: "true" },
      { example: "'hello'.startsWith('lo')", evaluated: "false" },
    ],
  },
  {
    name: "endsWith",
    description: "判断字符串是否以指定子字符串结尾",
    returnType: "boolean",
    isFunction: true,
    args: [
      { name: "searchString", type: "string", description: "要搜索的字符串" },
      {
        name: "length",
        type: "number",
        optional: true,
        description: "限制长度",
      },
    ],
    examples: [
      { example: "'hello'.endsWith('lo')", evaluated: "true" },
      { example: "'hello'.endsWith('he')", evaluated: "false" },
    ],
  },
  {
    name: "substring",
    description: "返回两个索引之间的子字符串",
    returnType: "string",
    isFunction: true,
    args: [
      { name: "start", type: "number", description: "开始索引" },
      { name: "end", type: "number", optional: true, description: "结束索引" },
    ],
    examples: [
      { example: "'hello'.substring(1, 4)", evaluated: "'ell'" },
      { example: "'hello'.substring(2)", evaluated: "'llo'" },
    ],
  },
  {
    name: "match",
    description: "使用正则表达式匹配字符串",
    returnType: "RegExpMatchArray | null",
    isFunction: true,
    args: [{ name: "regexp", type: "RegExp", description: "正则表达式" }],
    examples: [
      { example: "'hello'.match(/l+/)", evaluated: "['ll']" },
      { example: "'test 123'.match(/\\d+/)", evaluated: "['123']" },
    ],
  },
];

/**
 * StringPrototype 扩展映射（用于代码补全）
 */
export const stringPrototypeExtensions = {
  typeName: "StringPrototype",
  functions: StringPrototypeMethods,
  nativeDocs: StringPrototypeNativeMethodsDocs,
};

export const StringPrototypeMethodsDoc: DocMetadata[] = Object.values(
  StringPrototypeMethods
)
  .map((func) => func.doc)
  .concat(StringPrototypeNativeMethodsDocs);
