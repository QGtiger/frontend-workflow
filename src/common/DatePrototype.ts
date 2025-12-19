import type { DocFunction, DocMetadata } from "./type";

// ============ 自定义原型方法实现 ============

const format: DocFunction<(pattern: string) => string> = function (
  this: Date,
  pattern: string
) {
  const year = this.getFullYear();
  const month = String(this.getMonth() + 1).padStart(2, "0");
  const day = String(this.getDate()).padStart(2, "0");
  const hours = String(this.getHours()).padStart(2, "0");
  const minutes = String(this.getMinutes()).padStart(2, "0");
  const seconds = String(this.getSeconds()).padStart(2, "0");

  return pattern
    .replace("YYYY", String(year))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
} as any;
format.doc = {
  name: "format",
  description: "格式化日期为指定格式的字符串",
  returnType: "string",
  isFunction: true,
  args: [
    {
      name: "pattern",
      type: "string",
      description: "格式模板：YYYY-年，MM-月，DD-日，HH-时，mm-分，ss-秒",
    },
  ],
  examples: [
    {
      example: "new Date('2024-01-15 14:30:45').format('YYYY-MM-DD')",
      evaluated: "'2024-01-15'",
    },
    {
      example: "new Date('2024-01-15 14:30:45').format('YYYY/MM/DD HH:mm:ss')",
      evaluated: "'2024/01/15 14:30:45'",
    },
    {
      example: "new Date('2024-01-15').format('MM-DD')",
      evaluated: "'01-15'",
    },
  ],
};

const diff: DocFunction<(date: Date, unit?: string) => number> = function (
  this: Date,
  date: Date,
  unit: string = "milliseconds"
) {
  const diffMs = this.getTime() - date.getTime();

  switch (unit) {
    case "seconds":
      return Math.floor(diffMs / 1000);
    case "minutes":
      return Math.floor(diffMs / (1000 * 60));
    case "hours":
      return Math.floor(diffMs / (1000 * 60 * 60));
    case "days":
      return Math.floor(diffMs / (1000 * 60 * 60 * 24));
    default:
      return diffMs;
  }
} as any;
diff.doc = {
  name: "diff",
  description: "计算与另一个日期的时间差",
  returnType: "number",
  isFunction: true,
  args: [
    { name: "date", type: "Date", description: "要比较的日期" },
    {
      name: "unit",
      type: "string",
      optional: true,
      description: "单位：milliseconds, seconds, minutes, hours, days",
    },
  ],
  examples: [
    {
      example: "new Date('2024-01-15').diff(new Date('2024-01-10'), 'days')",
      evaluated: "5",
    },
    {
      example:
        "new Date('2024-01-15 14:00').diff(new Date('2024-01-15 12:00'), 'hours')",
      evaluated: "2",
    },
  ],
};

const fromNow: DocFunction<() => string> = function (this: Date) {
  const now = new Date();
  const diffMs = now.getTime() - this.getTime();
  const isFuture = diffMs < 0;
  const absDiffMs = Math.abs(diffMs);

  const seconds = Math.floor(absDiffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  let result = "";
  if (years > 0) result = `${years}年`;
  else if (months > 0) result = `${months}个月`;
  else if (days > 0) result = `${days}天`;
  else if (hours > 0) result = `${hours}小时`;
  else if (minutes > 0) result = `${minutes}分钟`;
  else result = `${seconds}秒`;

  return isFuture ? `${result}后` : `${result}前`;
} as any;
fromNow.doc = {
  name: "fromNow",
  description: "返回相对于当前时间的描述（如：3天前，2小时后）",
  returnType: "string",
  isFunction: true,
  examples: [
    {
      example: "new Date(Date.now() - 3600000).fromNow()",
      evaluated: "'1小时前'",
    },
    {
      example: "new Date(Date.now() - 86400000 * 3).fromNow()",
      evaluated: "'3天前'",
    },
    {
      example: "new Date(Date.now() + 3600000).fromNow()",
      evaluated: "'1小时后'",
    },
  ],
};

// ============ 导出自定义扩展方法 ============

export const DatePrototypeMethods = {
  format,
  diff,
  fromNow,
} as const;

// ============ 原生方法的文档定义 ============

export const DatePrototypeNativeMethodsDocs: DocMetadata[] = [
  {
    name: "getTime",
    description: "返回自 1970-01-01 00:00:00 UTC 以来的毫秒数（时间戳）",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getTime",
    examples: [
      {
        example: "new Date('2024-01-01').getTime()",
        evaluated: "1704067200000",
      },
      { example: "new Date().getTime()", evaluated: "1704524400000" },
    ],
  },
  {
    name: "getFullYear",
    description: "返回四位数年份",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getFullYear",
    examples: [
      { example: "new Date('2024-01-15').getFullYear()", evaluated: "2024" },
      { example: "new Date('2023-12-31').getFullYear()", evaluated: "2023" },
    ],
  },
  {
    name: "getMonth",
    description: "返回月份（0-11，0 表示一月）",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getMonth",
    examples: [
      { example: "new Date('2024-01-15').getMonth()", evaluated: "0" },
      { example: "new Date('2024-12-15').getMonth()", evaluated: "11" },
    ],
  },
  {
    name: "getDate",
    description: "返回月份中的某一天（1-31）",
    returnType: "number",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/getDate",
    examples: [
      { example: "new Date('2024-01-15').getDate()", evaluated: "15" },
      { example: "new Date('2024-01-01').getDate()", evaluated: "1" },
    ],
  },
  {
    name: "toISOString",
    description: "返回 ISO 8601 格式的日期时间字符串（UTC 时区）",
    returnType: "string",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString",
    examples: [
      {
        example: "new Date('2024-01-15T12:00:00Z').toISOString()",
        evaluated: "'2024-01-15T12:00:00.000Z'",
      },
    ],
  },
  {
    name: "toLocaleDateString",
    description: "返回本地化的日期字符串",
    returnType: "string",
    isFunction: true,
    docURL:
      "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString",
    args: [
      {
        name: "locales",
        type: "string",
        optional: true,
        description: "语言代码，如 'zh-CN'",
      },
      {
        name: "options",
        type: "Intl.DateTimeFormatOptions",
        optional: true,
        description: "格式化选项",
      },
    ],
    examples: [
      {
        example: "new Date('2024-01-15').toLocaleDateString('zh-CN')",
        evaluated: "'2024/1/15'",
      },
      {
        example: "new Date('2024-01-15').toLocaleDateString('en-US')",
        evaluated: "'1/15/2024'",
      },
    ],
  },
];

/**
 * DatePrototype 扩展映射（用于代码补全）
 */
export const datePrototypeExtensions = {
  typeName: "DatePrototype",
  functions: DatePrototypeMethods,
  nativeDocs: DatePrototypeNativeMethodsDocs,
};

export const DatePrototypeMethodsDoc: DocMetadata[] = Object.values(
  DatePrototypeMethods
)
  .map((func) => func.doc)
  .concat(DatePrototypeNativeMethodsDocs)
  .sort((a, b) => a.name.localeCompare(b.name));
