/**
 * 解析模板字符串，将 {{表达式}} 替换为表达式的执行结果
 *
 * @param template - 模板字符串，如 "11 {{[1,2,3]}} 22" 或 "{{expression}}"
 * @param parseExpression - 表达式解析函数
 * @returns
 *   - 纯表达式（如 "{{[1,2,3]}}"）：返回原始类型 [1,2,3]
 *   - 混合文本（如 "11 {{[1,2,3]}} 22"）：返回字符串 "11 1,2,3 22"
 *   - 无匹配（如 "plain text"）：返回原字符串
 *   - 空字符串：返回 undefined
 *
 * @example
 * // 纯表达式，返回原始类型
 * parseTemplateWithExpression("{{[1,2,3]}}", parse) // → [1,2,3]
 * parseTemplateWithExpression("{{123}}", parse)     // → 123
 *
 * // 混合文本，字符串拼接
 * parseTemplateWithExpression("11 {{[1,2,3]}} 22", parse) // → "11 1,2,3 22"
 * parseTemplateWithExpression("值: {{user.name}}", parse)  // → "值: John"
 *
 * // 多个表达式
 * parseTemplateWithExpression("{{firstName}} {{lastName}}", parse) // → "John Doe"
 */
export function parseTemplateWithExpression(
  template: string,
  parseExpression: (expression: string) => any
): any {
  // 边界情况：空字符串
  if (!template) {
    return undefined;
  }

  // 匹配 {{表达式}} 的正则表达式（非贪婪匹配）
  const regex = /\{\{(.*?)\}\}/g;
  let match: RegExpExecArray | null = null;

  let preIndex = 0;
  const matchValues: any[] = [];
  regex.lastIndex = 0;
  while ((match = regex.exec(template))) {
    const [str, variable] = match;
    const index = match.index;

    const s = template.slice(preIndex, index);
    s && matchValues.push(s);

    matchValues.push(parseExpression(variable.trim()));
    preIndex = index + str.length;
  }

  const lastValue = template.slice(preIndex);
  lastValue && matchValues.push(lastValue);

  let result = undefined;
  for (const value of matchValues) {
    result = result ? result + value : value;
  }
  return result;
}
