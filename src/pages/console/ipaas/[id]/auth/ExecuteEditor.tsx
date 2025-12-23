import { Empty, Form, Input, Select } from "antd";
import { useAuthType } from "./hooks";
import TextArea from "antd/es/input/TextArea";

export function ExecuteEditor() {
  const authType = useAuthType();

  return (
    <div className="max-w-4xl">
      {authType === "api_key" ? (
        <Empty
          description="API Key 授权模式不需要配置执行协议"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        >
          <p className="text-gray-500 text-sm">
            API Key
            会在每次请求时自动添加到请求头或参数中，无需额外的授权接口调用。
          </p>
        </Empty>
      ) : authType === "none" ? (
        <Empty
          description="无需授权模式不需要配置执行协议"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      ) : (
        <div>
          <div className="mb-4 bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">⚡ 执行协议说明</h4>
            <p className="text-sm text-gray-600 mb-0">
              配置如何使用用户提供的凭证获取访问令牌。通常是调用服务提供商的授权接口。
            </p>
          </div>

          <Form.Item
            label="执行模式"
            name={["excuteProtocol", "mode"]}
            rules={[{ required: true, message: "请选择执行模式" }]}
          >
            <Select
              placeholder="请选择执行模式"
              options={[
                {
                  value: "http",
                  label: "HTTP 请求",
                  description: "通过 HTTP 请求获取授权令牌",
                },
                {
                  value: "code",
                  label: "代码执行",
                  description: "通过自定义代码获取授权令牌",
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

          {/* HTTP 模式配置 */}
          <Form.Item
            noStyle
            shouldUpdate={(prevValues, currentValues) =>
              prevValues.excuteProtocol?.mode !==
              currentValues.excuteProtocol?.mode
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(["excuteProtocol", "mode"]) === "http" ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">HTTP 请求配置</h4>

                  <Form.Item
                    label="请求方法"
                    name={["excuteProtocol", "httpModeConfig", "method"]}
                    rules={[{ required: true, message: "请选择请求方法" }]}
                  >
                    <Select
                      options={[
                        { value: "GET", label: "GET" },
                        { value: "POST", label: "POST" },
                        { value: "PUT", label: "PUT" },
                        { value: "DELETE", label: "DELETE" },
                        { value: "PATCH", label: "PATCH" },
                      ]}
                      placeholder="请选择请求方法"
                    />
                  </Form.Item>

                  <Form.Item
                    label="请求 URL"
                    name={["excuteProtocol", "httpModeConfig", "url"]}
                    rules={[{ required: true, message: "请输入请求 URL" }]}
                  >
                    <Input placeholder="https://api.example.com/oauth/token" />
                  </Form.Item>

                  <Form.Item
                    label="请求头"
                    name={["excuteProtocol", "httpModeConfig", "headers"]}
                    tooltip="JSON 格式的请求头配置"
                  >
                    <TextArea
                      rows={4}
                      placeholder='{"Content-Type": "application/json"}'
                    />
                  </Form.Item>

                  <Form.Item
                    label="请求体"
                    name={["excuteProtocol", "httpModeConfig", "body"]}
                    tooltip="JSON 格式的请求体配置，可以使用 {{变量名}} 引用输入字段"
                  >
                    <TextArea
                      rows={4}
                      placeholder='{"api_key": "{{apiKey}}", "api_secret": "{{apiSecret}}"}'
                    />
                  </Form.Item>
                </div>
              ) : getFieldValue(["excuteProtocol", "mode"]) === "code" ? (
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3">代码执行配置</h4>

                  <Form.Item
                    label="执行脚本"
                    name={["excuteProtocol", "codeModeConfig", "script"]}
                    rules={[{ required: true, message: "请输入执行脚本" }]}
                  >
                    <TextArea
                      rows={12}
                      placeholder={`// 编写授权逻辑代码
// 可以访问 context 对象获取用户输入
async function authorize(context) {
const { apiKey, apiSecret } = context.inputs;

// 调用授权接口
const response = await fetch('https://api.example.com/auth', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ api_key: apiKey, api_secret: apiSecret })
});

const data = await response.json();

// 返回授权结果
return {
accessToken: data.access_token,
refreshToken: data.refresh_token,
expiresIn: data.expires_in
};
}`}
                      style={{ fontFamily: "monospace" }}
                    />
                  </Form.Item>
                </div>
              ) : null
            }
          </Form.Item>

          {/* Token 配置 */}
          <div className="border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium mb-3">Token 配置</h4>

            <Form.Item
              label="自动刷新 Token"
              name={["tokenConfig", "isAutoRefresh"]}
              valuePropName="checked"
              tooltip="当 Token 失效时是否自动刷新"
            >
              <Select
                options={[
                  { value: true, label: "启用" },
                  { value: false, label: "禁用" },
                ]}
                placeholder="请选择是否自动刷新 Token"
              />
            </Form.Item>

            <Form.Item
              label="Token 有效期（毫秒）"
              name={["tokenConfig", "activeTimesMs"]}
              tooltip="设置 Token 的有效时间，系统会在过期前自动刷新"
            >
              <Input
                type="number"
                placeholder="3600000 (1小时)"
                addonAfter="毫秒"
              />
            </Form.Item>
          </div>

          {/* 输出配置 */}
          <div className="border border-gray-200 rounded-lg p-4 mt-4">
            <h4 className="font-medium mb-3">输出配置</h4>
            <p className="text-sm text-gray-500 mb-3">
              定义授权接口返回的数据结构，这些数据将被存储并用于后续的 API
              调用。
            </p>

            <Form.Item label="输出字段" name="outputs">
              <TextArea
                rows={6}
                placeholder={`配置授权接口的返回数据结构 (JSON 格式):
[
{
"name": "accessToken",
"label": "访问令牌",
"type": "string"
},
{
"name": "refreshToken", 
"label": "刷新令牌",
"type": "string"
}
]`}
              />
            </Form.Item>
          </div>
        </div>
      )}
    </div>
  );
}
