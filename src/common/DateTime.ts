import type { DocMetadata } from "./type";

/**
 * 带文档的函数类型
 */
type DocFunction<T extends (...args: any[]) => any> = T & { doc: DocMetadata };

// ============ 静态方法实现 ============

const now: DocFunction<() => Date> = () => new Date();
now.doc = {
  name: "now",
  description: "返回当前日期时间",
  returnType: "Date",
  isFunction: true,
  examples: [
    { example: "DateTime.now()", evaluated: "2024-01-15T10:30:00.000Z" },
  ],
};

const today: DocFunction<() => Date> = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};
today.doc = {
  name: "today",
  description: "返回今天的日期（时间为 00:00:00）",
  returnType: "Date",
  isFunction: true,
  examples: [
    { example: "DateTime.today()", evaluated: "2024-01-15T00:00:00.000Z" },
  ],
};

const format: DocFunction<(date: Date, pattern?: string) => string> = (
  date,
  pattern = "YYYY-MM-DD HH:mm:ss"
) => {
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1);
  const day = pad(date.getDate());
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  return pattern
    .replace("YYYY", year.toString())
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds);
};
format.doc = {
  name: "format",
  description: "将日期格式化为字符串",
  returnType: "string",
  isFunction: true,
  args: [
    { name: "date", type: "Date", description: "要格式化的日期" },
    {
      name: "pattern",
      type: "string",
      optional: true,
      description: "格式模式，默认 YYYY-MM-DD HH:mm:ss",
    },
  ],
  examples: [
    {
      example: "DateTime.format(DateTime.now(), 'YYYY-MM-DD')",
      evaluated: "'2024-01-15'",
    },
    {
      example: "DateTime.format(DateTime.now(), 'HH:mm')",
      evaluated: "'10:30'",
    },
  ],
};

const timestamp: DocFunction<(date?: Date) => number> = (date) =>
  (date || new Date()).getTime();
timestamp.doc = {
  name: "timestamp",
  description: "获取时间戳（毫秒）",
  returnType: "number",
  isFunction: true,
  args: [
    {
      name: "date",
      type: "Date",
      optional: true,
      description: "日期，默认当前时间",
    },
  ],
  examples: [{ example: "DateTime.timestamp()", evaluated: "1705312200000" }],
};

const isToday: DocFunction<(date: Date) => boolean> = (date) => {
  const today = new Date();
  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
};
isToday.doc = {
  name: "isToday",
  description: "判断日期是否是今天",
  returnType: "boolean",
  isFunction: true,
  args: [{ name: "date", type: "Date", description: "要判断的日期" }],
  examples: [
    { example: "DateTime.isToday(DateTime.now())", evaluated: "true" },
  ],
};

// ============ 导出 DateTime 对象 ============

export const DateTime = {
  now,
  today,
  format,
  timestamp,
  isToday,
} as const;

/**
 * DateTime 扩展映射（用于代码补全）
 */
export const dateTimeExtensions = {
  typeName: "DateTime",
  functions: {
    now,
    today,
    format,
    timestamp,
    isToday,
  },
};
