import type { TemplateSegment } from "./types";

export function getResultBySegment<T = any>(segment: TemplateSegment<T>): any {
  if (typeof segment === "string") {
    return segment;
  }
  if (segment.error) {
    throw segment.error;
  }
  return segment.result;
}

export function parseTemplateForSegments<T = any>(
  template: string,
  parseExpression: (expression: string) => T
): TemplateSegment<T>[] {
  // 边界情况：空字符串
  if (!template) {
    return [];
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

  return matchValues;
}

export function getResultValue(v: any) {
  if (v === null || v === undefined) {
    return null;
  }
  return v;
}
