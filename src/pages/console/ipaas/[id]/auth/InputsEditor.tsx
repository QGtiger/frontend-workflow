import { Empty, Form } from "antd";
import IPaasSchemaEditor from "./IPaasSchemaEditor";
// import IPaasSchemaEditor from "./IPaasSchemaEditor";

export function InputsEditor() {
  const form = Form.useFormInstance();
  const authType = Form.useWatch("type", form);

  return (
    <div className="max-w-4xl">
      {authType === "none" ? (
        <Empty
          description="无需授权模式不需要配置输入字段"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div>
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">📝 配置说明</h4>
            <p className="text-sm text-gray-600 mb-0">
              配置用户在授权时需要填写的字段。例如：API Key、API
              Secret、服务器地址等。
            </p>
          </div>

          <Form.Item name="inputs" tooltip="定义用户在授权时需要填写的表单字段">
            <IPaasSchemaEditor placeholder="点击添加输入字段..." />
          </Form.Item>

          {authType === "api_key" && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
              <p className="text-yellow-800 mb-0">
                ⚠️ API Key 授权模式通常需要配置以下字段：
                <br />• API Key 或 Access Key
                <br />• API Secret（可选）
                <br />• 服务器地址（可选）
              </p>
            </div>
          )}

          {authType === "session_auth" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
              <p className="text-green-800 mb-0">
                ℹ️ Session 授权模式通常用于 OAuth、账号密码登录等场景。
                <br />
                配置好输入字段后，还需要在"执行协议"中配置授权接口。
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
