import { ObjectMethods } from "./Object";
import { DateTimeMethods } from "./DateTime";
import { JSONMethods } from "./JSON";
import { MathMethods } from "./Math";
import { ArrayPrototypeMethods } from "./ArrayPrototype";
import { ObjectPrototypeMethods } from "./ObjectPrototype";
import { NumberPrototypeMethods } from "./NumberPrototype";
import { StringPrototypeMethods } from "./StringPrototype";

// ============ 初始化：扩展原型方法 ============
// 在 Web 端直接扩展原型，方便沙盒使用

// Array 和 Number 可以直接扩展
Object.assign(Array.prototype, ArrayPrototypeMethods);
Object.assign(Number.prototype, NumberPrototypeMethods);
Object.assign(String.prototype, StringPrototypeMethods);

// Object.prototype 需要特殊处理，使用 defineProperty 设置为不可枚举
// 这样不会影响 for...in 循环和 Object.keys() 等
Object.keys(ObjectPrototypeMethods).forEach((key) => {
  Object.defineProperty(Object.prototype, key, {
    value: ObjectPrototypeMethods[key as keyof typeof ObjectPrototypeMethods],
    writable: true,
    enumerable: false, // 关键：不可枚举
    configurable: false,
  });
});

/**
 * 沙盒执行结果
 */
export interface SandboxResult<T = any> {
  result?: T;
  error?: Error;
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

function validateExpression(expression: string) {
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
    /\barguments\b/,
    /\bthis\b/,
    /\bSymbol\b/,
    /\bProxy\b/,
    /\bReflect\b/,
    /\bMap\b/,
    /\bSet\b/,
    /\bWeakMap\b/,
    /\bWeakSet\b/,
  ];

  for (const pattern of dangerousPatterns) {
    if (pattern.test(expression)) {
      throw new Error(`由于安全性，不可访问 ${pattern.source}`);
    }
  }
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
function executeSandbox<T = any>(
  expression: string,
  context: SandboxContext = {}
): T {
  validateExpression(expression);

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
    DateTime: DateTimeMethods,

    // 原生类型和构造函数（直接透传，原型方法已在模块初始化时扩展）
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
    // 严格模式不能访问 eval 和 arguments
    // eval: undefined,
    // arguments: undefined,
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

    Symbol: undefined,
    Proxy: undefined,
    Reflect: undefined,
    Map: undefined,
    Set: undefined,
    WeakMap: undefined,
    WeakSet: undefined,
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
  return sandboxFunction(...paramValues);
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
): SandboxResult<T> {
  try {
    const result = executeSandbox<T>(expression, context);
    return {
      result,
    };
  } catch (error) {
    return {
      error: error as Error,
    };
  }
}
