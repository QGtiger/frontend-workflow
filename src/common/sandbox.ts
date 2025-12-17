import { ObjectMethods } from "./Object";
import { DateTimeMethods } from "./DateTime";
import { JSONMethods } from "./JSON";
import { MathMethods } from "./Math";
import { ArrayMethods } from "./Array";

/**
 * 沙盒执行结果
 */
export interface SandboxResult<T = any> {
  success: boolean;
  value?: T;
  error?: string;
}

/**
 * 沙盒上下文配置
 */
export interface SandboxContext {
  /** 自定义的 $ 函数，用于访问特定数据 */
  $?: (key: string) => any;
  /** 额外的全局变量 */
  globals?: Record<string, any>;
  /** 是否启用严格模式，默认 true */
  strict?: boolean;
}

/**
 * 创建安全的沙盒执行环境
 *
 * @example
 * // 基本表达式
 * executeSandbox('1 + 1') // { success: true, value: 2 }
 *
 * // 使用内置方法
 * executeSandbox('JSON.parse(\'{"a":1}\')') // { success: true, value: { a: 1 } }
 * executeSandbox('Object.keys({ a: 1, b: 2 })') // { success: true, value: ['a', 'b'] }
 *
 * // 使用注入变量
 * executeSandbox('$workflow.name', { workflow: { name: 'John' } }) // { success: true, value: 'John' }
 *
 * // 使用 $ 函数
 * executeSandbox('$("user.id")', {
 *   $: (key) => ({ 'user.id': 123 })[key]
 * }) // { success: true, value: 123 }
 */
export function executeSandbox<T = any>(
  expression: string,
  context: SandboxContext = {}
): SandboxResult<T> {
  try {
    const { $ = () => undefined, globals = {}, strict = true } = context;

    // 创建安全的全局对象，只暴露必要的方法
    const safeGlobals = {
      // 原生对象的安全方法
      Object: {
        ...ObjectMethods,
        // 保留一些原生的安全方法
        freeze: Object.freeze,
        seal: Object.seal,
        create: Object.create,
        is: Object.is,
      },
      JSON: {
        ...JSONMethods,
      },
      Math: {
        ...MathMethods,
        // 保留 Math 的原生常量和方法
        PI: Math.PI,
        E: Math.E,
        max: Math.max,
        min: Math.min,
        pow: Math.pow,
        sqrt: Math.sqrt,
        sin: Math.sin,
        cos: Math.cos,
        tan: Math.tan,
        log: Math.log,
        exp: Math.exp,
      },
      Array: {
        ...ArrayMethods,
        from: Array.from,
        of: Array.of,
      },
      DateTime: DateTimeMethods,

      // 原生类型和构造函数（只读）
      Number: Number,
      String: String,
      Boolean: Boolean,
      Date: Date,
      RegExp: RegExp,

      // 常用工具
      parseInt: parseInt,
      parseFloat: parseFloat,
      isNaN: isNaN,
      isFinite: isFinite,
      encodeURIComponent: encodeURIComponent,
      decodeURIComponent: decodeURIComponent,

      // 用户自定义的全局变量
      ...globals,
      $: $,

      // 禁止访问危险对象
      window: undefined,
      document: undefined,
      globalThis: undefined,
      eval: undefined,
      Function: undefined,
      setTimeout: undefined,
      setInterval: undefined,
      XMLHttpRequest: undefined,
      fetch: undefined,
      WebSocket: undefined,
      Worker: undefined,
      SharedWorker: undefined,
      importScripts: undefined,
      navigator: undefined,
      location: undefined,
      localStorage: undefined,
      sessionStorage: undefined,
      indexedDB: undefined,
    };

    // 构建参数名和参数值
    const paramNames = Object.keys(safeGlobals);
    const paramValues = Object.values(safeGlobals);

    // 构建函数体
    const strictMode = strict ? "'use strict';" : "";
    const functionBody = `
      ${strictMode}
      return (${expression});
    `;

    // 使用 Function 构造函数创建沙盒函数
    // 这样可以控制作用域，避免访问外部变量
    const sandboxFunction = new Function(...paramNames, functionBody);

    // 执行沙盒函数
    const result = sandboxFunction(...paramValues);

    return {
      success: true,
      value: result as T,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

/**
 * 执行沙盒表达式（同步版本，抛出异常）
 *
 * @example
 * executeSandboxSync('1 + 1') // 2
 * executeSandboxSync('invalid') // 抛出异常
 */
export function executeSandboxSync<T = any>(
  expression: string,
  context: SandboxContext = {}
): T {
  if (!isSafeExpression(expression)) {
    throw new Error("表达式包含不安全的操作");
  }
  const result = executeSandbox<T>(expression, context);
  if (result.success) {
    return result.value as T;
  } else {
    throw new Error(result.error || "沙盒执行失败");
  }
}

// /**
//  * 批量执行沙盒表达式
//  *
//  * @example
//  * executeSandboxBatch([
//  *   { expr: '1 + 1' },
//  *   { expr: '$workflow.name', context: { workflow: { name: 'John' } } },
//  * ])
//  */
// export function executeSandboxBatch(
//   items: Array<{ expr: string; context?: SandboxContext }>
// ): SandboxResult[] {
//   return items.map(({ expr, context }) => executeSandbox(expr, context));
// }

/**
 * 检查表达式是否安全（不包含危险操作）
 */
function isSafeExpression(expression: string): boolean {
  // 检查是否包含危险关键字
  const dangerousPatterns = [
    /\beval\b/,
    /\bFunction\b/,
    /\bnew\s+Function\b/,
    /\bwindow\b/,
    /\bdocument\b/,
    /\bglobalThis\b/,
    /\bsetTimeout\b/,
    /\bsetInterval\b/,
    /\bfetch\b/,
    /\bXMLHttpRequest\b/,
    /\bWebSocket\b/,
    /\bWorker\b/,
    /\bimport\b/,
    /\brequire\b/,
    /\b__proto__\b/,
    /\bconstructor\b/,
    /\bprototype\b/,
  ];

  return !dangerousPatterns.some((pattern) => pattern.test(expression));
}

// /**
//  * 验证并执行沙盒表达式（会先检查安全性）
//  */
// export function executeSafeSandbox<T = any>(
//   expression: string,
//   context: SandboxContext = {}
// ): SandboxResult<T> {
//   if (!isSafeExpression(expression)) {
//     return {
//       success: false,
//       error: "表达式包含不安全的操作",
//     };
//   }
//   return executeSandbox<T>(expression, context);
// }
