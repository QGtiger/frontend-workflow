import { Form } from "antd";
import type { SchemaFormItemType } from "../types";
import { useSchemaFormContext } from "../context";
import { isVisible } from "../utils/visible";
import { executeValidateRules } from "../utils/validate";
import { formValueNormalize } from "../utils/normalize";
import WrapperFieldComponent from "./WrapperFieldComponent";
import { MyFormItem } from "./MyFormItem";

interface SchemaFormItemProps {
  schema: SchemaFormItemType;
  form: any;
}

/**
 * 核心表单项渲染组件
 * 职责：
 * 1. 可见性判断
 * 2. 校验规则执行
 * 3. 动态数据源管理（Select options / Object properties）
 * 4. 编辑器组件分发
 */
export default function SchemaFormItem(props: SchemaFormItemProps) {
  const { schema, form } = props;
  const { normalize, validatefield } = useSchemaFormContext();

  const { visible, visibleRules, required, validateRules, code } = schema;

  // 所有 hooks 必须在任何条件返回之前调用
  const formValues = (Form.useWatch([], form) || {}) as Record<string, any>;

  // 1. 可见性判断
  if (visible === false) return null;
  if (visibleRules && !isVisible(visibleRules, formValues)) {
    return null;
  }

  // 5. 校验规则
  const rules = [
    (form: any) => ({
      validator(_: any, value: any) {
        function originValidateField(v: any) {
          const allValues = form.getFieldsValue();
          const normalizedFormValues = formValueNormalize(allValues, normalize);
          const normalizedValue = normalize?.(v) ?? v;

          return new Promise<void>((resolve, reject) => {
            let errorMessages = "";

            // 必填校验
            if (required) {
              if (
                normalizedValue === undefined ||
                normalizedValue === null ||
                normalizedValue === ""
              ) {
                errorMessages = "不能为空";
              }
            }

            // 自定义校验规则
            if (validateRules) {
              const [suc, errorMsg = "格式不正确"] = executeValidateRules(
                validateRules,
                normalizedValue,
                normalizedFormValues,
              );
              if (!suc) {
                errorMessages = errorMsg;
              }
            }

            if (errorMessages) {
              reject(new Error(errorMessages));
            } else {
              resolve();
            }
          });
        }

        return (
          validatefield?.({
            form,
            name: code,
            value,
            validate: originValidateField,
          }) || originValidateField(value)
        );
      },
    }),
  ];

  return (
    <MyFormItem key={code} name={code} rules={rules}>
      <WrapperFieldComponent schema={schema} />
    </MyFormItem>
  );
}
