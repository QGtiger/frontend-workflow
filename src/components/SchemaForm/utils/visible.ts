/**
 * 判断 visibleRules 表达式是否通过
 * 表达式示例: code === '22'
 */
export function isVisible(
  visibleRules: string | undefined,
  formValue: Record<string, any>,
): boolean {
  if (!visibleRules) return true;

  try {
    return new Function(
      "context",
      `
      try {
        with(context) {
          return !!(${visibleRules});
        }
      } catch (e) {
        return false;
      }
    `,
    )(formValue);
  } catch {
    return false;
  }
}
