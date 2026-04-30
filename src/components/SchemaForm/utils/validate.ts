/**
 * 执行 validateRules 校验脚本
 * 脚本格式: function main(value, formValue) { // ... }
 * 校验通过返回 true，不通过 throw new Error('错误信息')
 */
export function executeValidateRules(
  script: string,
  value: any,
  formValues: any,
): [boolean, string?] {
  return new Function(
    "value",
    "formValues",
    `
    try {
      ${script}
      main(value, formValues);
      return [true];
    } catch (e) {
      return [false, e.message];
    }
  `,
  )(value, formValues);
}
