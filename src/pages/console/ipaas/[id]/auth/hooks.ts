import { Form } from "antd";

export function useAuthType() {
  const form = Form.useFormInstance();
  const authType = Form.useWatch("type", form);
  return authType;
}
