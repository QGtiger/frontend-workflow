import type { SandboxResult } from "@/common/sandbox";
// ============ 模板展示解析 ============

/**
 * 表达式状态类型
 */
type ExpressionState = "valid" | "invalid";

/**
 * 解析后的文本片段
 */
export interface ParsedSegment {
  text: string; // 显示文本
  from: number; // 在新文本中的起始位置
  to: number; // 在新文本中的结束位置
  state: ExpressionState; // 表达式状态
  isExpression: boolean; // 是否是表达式结果
}

/**
 * 解析结果
 */
export interface ParsedTemplateResult {
  displayText: string; // 最终显示的文本
  segments: ParsedSegment[]; // 所有片段信息
}

/**
 * 判断表达式的状态
 */
function getExpressionState(error?: Error): ExpressionState {
  if (!error) return "valid";

  return "invalid";
}

/**
 * 获取值的类型
 */
function getValueType(value: any): string {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (Array.isArray(value)) return "Array";
  if (value instanceof Date) return "Date";
  if (typeof value === "object") return "Object";
  return typeof value;
}

/**
 * 将计算结果转换为字符串（用于混合文本）
 */
function resultToString(result: any): string {
  if (result === null) return "null";
  if (result === undefined) return "undefined";
  if (typeof result === "object") {
    try {
      return JSON.stringify(result);
    } catch {
      return String(result);
    }
  }
  return String(result);
}

/**
 * 格式化单表达式的显示（带类型前缀）
 * @param result - 计算结果
 * @returns 格式化后的字符串，如 "[Array: [1,2,3]]"
 */
function formatSingleExpression(result: any): string {
  const type = getValueType(result);

  if (result === null) return "null";
  if (result === undefined) return "undefined";

  // 基础类型直接返回
  if (type === "string" || type === "number" || type === "boolean") {
    return String(result);
  }

  // 复杂类型添加类型前缀
  let valueStr: string;
  try {
    if (result instanceof Date) {
      valueStr = result.toISOString();
    } else {
      valueStr = JSON.stringify(result);
    }
  } catch {
    valueStr = String(result);
  }

  return `[${type}: ${valueStr}]`;
}

/**
 * 解析模板字符串用于展示
 * 将 {{ expression }} 替换为计算后的真实值，并记录每个片段的位置和状态
 *
 * @param template - 模板字符串，如 "1 {{ 1+1 }} 3"
 * @param evaluateExpression - 表达式计算函数
 * @returns 包含显示文本和片段信息的对象
 *
 * @example
 * // 混合文本
 * parseTemplateForDisplay("1 {{ 1+1 }} 3", eval)
 * // => "1 2 3"
 *
 * // 单表达式（复杂类型带前缀）
 * parseTemplateForDisplay("{{ [1,2,3] }}", eval)
 * // => "[Array: [1,2,3]]"
 *
 * parseTemplateForDisplay("{{ {a: 2} }}", eval)
 * // => "[Object: {\"a\":2}]"
 */
export function parseTemplateForDisplay(
  template: string,
  evaluateExpression: (expr: string) => SandboxResult
): ParsedTemplateResult {
  // 边界情况：空模板
  if (!template) {
    return {
      displayText: "",
      segments: [],
    };
  }

  const regex = /\{\{(.+?)\}\}/g;
  const segments: ParsedSegment[] = [];
  let displayText = "";
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let matchCount = 0;

  // 检测是否为单表达式（整个模板只有一个 {{ }} 且前后无其他文本）
  const trimmedTemplate = template.trim();
  const isSingleExpression =
    trimmedTemplate.startsWith("{{") &&
    trimmedTemplate.endsWith("}}") &&
    !trimmedTemplate.slice(2).includes("{{"); // 没有第二个 {{

  while ((match = regex.exec(template)) !== null) {
    matchCount++;
    const matchStart = match.index;
    const matchEnd = matchStart + match[0].length;
    const exprContent = match[1].trim();

    // 1. 处理表达式前的普通文本
    if (matchStart > lastIndex) {
      const plainText = template.slice(lastIndex, matchStart);
      segments.push({
        text: plainText,
        from: displayText.length,
        to: displayText.length + plainText.length,
        state: "valid",
        isExpression: false,
      });
      displayText += plainText;
    }

    // 2. 计算表达式并生成显示文本
    const { result, error } = evaluateExpression(exprContent);
    const state = getExpressionState(error);
    let expressionText: string;

    if (error) {
      // 有错误时显示 [Error]
      expressionText = "[Error]";
    } else if (isSingleExpression && matchCount === 1) {
      // 单表达式：使用带类型前缀的格式
      expressionText = formatSingleExpression(result);
    } else {
      // 混合文本：使用 toString() 格式
      expressionText = resultToString(result);
    }

    segments.push({
      text: expressionText,
      from: displayText.length,
      to: displayText.length + expressionText.length,
      state,
      isExpression: true,
    });
    displayText += expressionText;

    lastIndex = matchEnd;
  }

  // 3. 处理最后一段普通文本
  if (lastIndex < template.length) {
    const plainText = template.slice(lastIndex);
    segments.push({
      text: plainText,
      from: displayText.length,
      to: displayText.length + plainText.length,
      state: "valid",
      isExpression: false,
    });
    displayText += plainText;
  }

  return {
    displayText,
    segments,
  };
}
