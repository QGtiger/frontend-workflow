/**
 * 递归规范化表单值
 */
export function formValueNormalize(
  value: any,
  normalize?: (value: any) => any,
): any {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return Object.entries(value).reduce(
      (acc, [key, val]) => {
        acc[key] = formValueNormalize(
          normalize ? normalize(val) : val,
          normalize,
        );
        return acc;
      },
      {} as Record<string, any>,
    );
  }
  return value;
}
