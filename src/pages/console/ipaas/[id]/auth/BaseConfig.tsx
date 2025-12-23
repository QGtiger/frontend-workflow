import { Form, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useAuthType } from "./hooks";

export function BaseConfig() {
  const authType = useAuthType();

  return (
    <div className="max-w-4xl">
      <Form.Item
        label="授权类型"
        name="type"
        rules={[{ required: true, message: "请选择授权类型" }]}
      >
        <Select
          placeholder="请选择授权类型"
          options={[
            {
              value: "none",
              label: "无需授权",
              description: "连接器不需要任何授权即可使用",
            },
            {
              value: "api_key",
              label: "API Key 授权",
              description: "使用 API Key 进行简单的身份验证",
            },
            {
              value: "session_auth",
              label: "Session 授权",
              description: "使用会话授权，支持 OAuth 等复杂授权流程",
            },
          ]}
          optionRender={(option) => (
            <div>
              <div className="font-medium">{option.label}</div>
              <div className="text-xs text-gray-500">
                {option.data.description}
              </div>
            </div>
          )}
        />
      </Form.Item>

      {authType !== "none" && (
        <Form.Item
          label="授权文档"
          name="doc"
          tooltip="描述如何使用此授权方式，用户在授权时会看到此说明"
        >
          <TextArea
            rows={8}
            placeholder="请输入授权文档说明，支持 Markdown 格式&#10;例如：&#10;1. 登录到服务提供商的管理控制台&#10;2. 创建新的 API 凭证&#10;3. 复制 API Key 和 Secret&#10;4. 在下方填入对应的字段"
            showCount
            maxLength={2000}
          />
        </Form.Item>
      )}

      {authType === "none" && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <p className="text-blue-800 mb-0">
            💡
            当前选择了"无需授权"模式，连接器将不需要用户提供任何凭证即可使用。
          </p>
        </div>
      )}
    </div>
  );
}
