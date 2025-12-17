import type { DocFunction } from "./type";

// new Date 的 重构参数
type DateParams = Date | number | string;

// ============ 静态方法实现 ============

const now: DocFunction<() => number> = () => Date.now();
now.doc = {
  name: "now",
  description: "返回当前时间的毫秒时间戳，等同于 Date.now()",
  returnType: "number",
  isFunction: true,
  examples: [{ example: "DateTime.now()", evaluated: "1705312200000" }],
};

const format: DocFunction<(pattern: string, date?: DateParams) => string> = (
  pattern,
  date
) => {
  const d = date ? new Date(date) : new Date();
  const pad = (n: number) => n.toString().padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  const seconds = pad(d.getSeconds());
  const milliseconds = d.getMilliseconds().toString().padStart(3, "0");

  return pattern
    .replace("YYYY", year.toString())
    .replace("YY", year.toString().slice(-2))
    .replace("MM", month)
    .replace("DD", day)
    .replace("HH", hours)
    .replace("mm", minutes)
    .replace("ss", seconds)
    .replace("SSS", milliseconds);
};
format.doc = {
  name: "format",
  description: "将日期格式化为字符串",
  returnType: "string",
  isFunction: true,
  args: [
    {
      name: "pattern",
      type: "string",
      description:
        "格式模式，支持 YYYY/YY(年)、MM(月)、DD(日)、HH(时)、mm(分)、ss(秒)、SSS(毫秒)",
    },
    {
      name: "date",
      type: "Date | number | string",
      optional: true,
      description: "要格式化的日期或时间戳，默认当前时间",
    },
  ],
  examples: [
    { example: "DateTime.format('YYYY-MM-DD')", evaluated: "'2024-01-15'" },
    {
      example: "DateTime.format('YYYY/MM/DD HH:mm:ss')",
      evaluated: "'2024/01/15 10:30:00'",
    },
    {
      example: "DateTime.format('YY年MM月DD日', 1705312200000)",
      evaluated: "'24年01月15日'",
    },
  ],
};

const isToday: DocFunction<(date?: DateParams) => boolean> = (date) => {
  const d = date ? new Date(date) : new Date();
  const today = new Date();
  return (
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate()
  );
};
isToday.doc = {
  name: "isToday",
  description: "判断日期是否是今天",
  returnType: "boolean",
  isFunction: true,
  args: [
    {
      name: "date",
      type: "Date | number | string",
      optional: true,
      description: "要判断的日期或时间戳，默认当前时间",
    },
  ],
  examples: [
    { example: "DateTime.isToday()", evaluated: "true" },
    { example: "DateTime.isToday(1705312200000)", evaluated: "false" },
  ],
};

const getDayOfWeek: DocFunction<(date?: DateParams) => number> = (date) => {
  const d = date ? new Date(date) : new Date();
  return d.getDay();
};
getDayOfWeek.doc = {
  name: "getDayOfWeek",
  description: "获取星期几（0-6，0 表示周日，1-6 表示周一到周六）",
  returnType: "number",
  isFunction: true,
  args: [
    {
      name: "date",
      type: "Date | number | string",
      optional: true,
      description: "日期或时间戳，默认当前时间",
    },
  ],
  examples: [
    { example: "DateTime.getDayOfWeek()", evaluated: "3" },
    { example: "DateTime.getDayOfWeek(1705312200000)", evaluated: "1" },
  ],
};

const isWeekend: DocFunction<(date?: DateParams) => boolean> = (date) => {
  const d = date ? new Date(date) : new Date();
  const day = d.getDay();
  return day === 0 || day === 6;
};
isWeekend.doc = {
  name: "isWeekend",
  description: "判断日期是否是周末（周六或周日）",
  returnType: "boolean",
  isFunction: true,
  args: [
    {
      name: "date",
      type: "Date | number | string",
      optional: true,
      description: "日期或时间戳，默认当前时间",
    },
  ],
  examples: [
    { example: "DateTime.isWeekend()", evaluated: "false" },
    {
      example: "DateTime.isWeekend(new Date('2024-01-13'))",
      evaluated: "true",
    },
  ],
};

// ============ 导出 DateTime 对象 ============

export const DateTimeMethods = {
  now,
  format,
  isToday,
  getDayOfWeek,
  isWeekend,
} as const;

/**
 * DateTime 扩展映射（用于代码补全）
 */
export const dateTimeExtensions = {
  typeName: "DateTime",
  functions: DateTimeMethods,
};
