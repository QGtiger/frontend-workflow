/**
 * 执行 JavaScript 代码
 * @param script JavaScript 代码字符串
 * @param context 执行上下文，代码中可以通过变量名直接访问
 * @param timeout 超时时间（毫秒），默认 5000ms
 * @returns 执行结果
 *
 * @example
 * executeScript('async main(a, b) { return a + b }', {a: 1, b: 2}) // => 3
 */
export function executeScript(
  script: string,
  argsMap: Record<string, any> = {},
  timeout = 30000
): any {
  try {
    // 构建函数参数列表
    const contextKeys = Object.keys(argsMap);
    const contextValues = Object.values(argsMap);

    // 创建执行函数
    // 使用 new Function 创建函数，参数是 argsMap 的所有 key，函数体是 script
    const func = new Function(
      ...contextKeys,
      `${script}
      if (!main) {
        throw new Error('main function is not defined');
      }
      return main(${contextKeys.join(", ")})`
    );

    // 设置超时
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Script execution timeout"));
      }, timeout);

      try {
        // 执行函数，传入 context 的所有 value
        const result = Promise.resolve(func(...contextValues));

        result.then(resolve, reject).finally(() => {
          clearTimeout(timer);
        });
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  } catch (error: any) {
    throw new Error(`Script execution failed: ${error.message}`);
  }
}
