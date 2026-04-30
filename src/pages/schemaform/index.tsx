import { useState, useRef } from "react";
import {
  Button,
  Card,
  Collapse,
  Typography,
  Space,
  Divider,
  Form,
  Input,
} from "antd";
import SchemaForm from "@/components/SchemaForm";
import type { SchemaFormItemType } from "@/components/SchemaForm/types";
import { MyFormItem, MyFormItemGroup, MyFormList } from "./MyFormItem";

const { Title, Paragraph, Text } = Typography;

// ============================================================
// 场景 1: 基础表单 - 各种输入类型
// ============================================================
const basicSchema: SchemaFormItemType[] = [
  {
    code: "username",
    name: "用户名",
    description: "请输入用户名，长度 2-20 个字符",
    type: "string",
    visible: true,
    required: true,
    editor: {
      kind: "input",
      config: { placeholder: "请输入用户名", defaultValue: "默认用户" },
    },
  },
  {
    code: "bio",
    name: "个人简介",
    description: "简单介绍一下自己",
    type: "string",
    visible: true,
    required: false,
    editor: {
      kind: "textarea",
      config: { placeholder: "请输入简介", minRows: 2, maxRows: 6 },
    },
  },
  {
    code: "apiKey",
    name: "API Key",
    description: "点击复制按钮快速复制",
    type: "string",
    visible: true,
    required: true,
    editor: {
      kind: "inputWithCopy",
      config: {
        placeholder: "请输入 API Key",
        copyText: "复制的文本",
        defaultValue: "默认值",
      },
    },
  },
  {
    code: "notice",
    name: "使用说明",
    description: "富文本展示区域",
    type: "string",
    visible: true,
    required: false,
    editor: {
      kind: "richEditor",
      config: {
        content: "**注意：** 请妥善保管您的 API Key，不要泄露给他人。",
      },
    },
  },
  {
    code: "age",
    name: "年龄",
    description: "请输入年龄（1-150）",
    type: "number",
    visible: true,
    required: true,
    editor: {
      kind: "numberInput",
      config: { placeholder: "请输入年龄", defaultValue: 18, min: 1, max: 150 },
    },
  },
  {
    code: "score",
    name: "评分",
    description: "选择评分",
    type: "number",
    visible: true,
    required: false,
    editor: {
      kind: "select",
      config: {
        isDynamic: false,
        depItems: [],
        options: [
          { value: 1, label: "1 分" },
          { value: 2, label: "2 分" },
          { value: 3, label: "3 分" },
          { value: 4, label: "4 分" },
          { value: 5, label: "5 分" },
        ],
      },
    },
  },
  {
    code: "enabled",
    name: "是否启用",
    description: "控制功能的开关状态",
    type: "boolean",
    visible: true,
    required: false,
    editor: {
      kind: "switch",
      config: {
        defaultValue: true,
      },
    },
  },
];

// ============================================================
// 场景 2: Select 动态数据源
// ============================================================
const dynamicSelectSchema: SchemaFormItemType[] = [
  {
    code: "category",
    name: "分类",
    description: "选择分类（静态数据源）",
    type: "string",
    visible: true,
    required: true,
    editor: {
      kind: "select",
      config: {
        isDynamic: false,
        depItems: [],
        options: [
          { value: "tech", label: "科技" },
          { value: "life", label: "生活" },
          { value: "edu", label: "教育" },
        ],
      },
    },
  },
  {
    code: "tags",
    name: "标签",
    description: "选择多个标签（多选）",
    type: "array",
    visible: true,
    required: false,
    editor: {
      kind: "multiSelect",
      config: {
        isDynamic: false,
        depItems: [],
        options: [
          { value: "react", label: "React" },
          { value: "vue", label: "Vue" },
          { value: "angular", label: "Angular" },
          { value: "node", label: "Node.js" },
          { value: "python", label: "Python" },
        ],
      },
    },
  },
];

// ============================================================
// 场景 3: 可见性规则
// ============================================================
const visibleRulesSchema: SchemaFormItemType[] = [
  {
    code: "showDetail",
    name: "显示详细信息",
    description: "开启后显示更多配置项",
    type: "boolean",
    visible: true,
    required: false,
    editor: { kind: "switch" },
  },
  {
    code: "detailInfo",
    name: "详细信息",
    description: "当上方开关开启时显示",
    type: "string",
    visible: true,
    visibleRules: "showDetail === true",
    required: false,
    editor: { kind: "input", config: { placeholder: "请输入详细信息" } },
  },
  {
    code: "level",
    name: "等级",
    description: "选择等级后显示对应配置",
    type: "string",
    visible: true,
    required: true,
    editor: {
      kind: "select",
      config: {
        isDynamic: false,
        depItems: [],
        options: [
          { value: "beginner", label: "初级" },
          { value: "advanced", label: "高级" },
        ],
      },
    },
  },
  {
    code: "advancedConfig",
    name: "高级配置",
    description: "仅高级用户可见",
    type: "string",
    visible: true,
    visibleRules: "level === 'advanced'",
    required: false,
    editor: { kind: "input", config: { placeholder: "高级配置项" } },
  },
];

// ============================================================
// 场景 4: 校验规则
// ============================================================
const validateSchema: SchemaFormItemType[] = [
  {
    code: "email",
    name: "邮箱",
    description: "请输入有效的邮箱地址",
    type: "string",
    visible: true,
    required: true,
    validateRules: `
      function main(value, formValue) {
        if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(value)) {
          throw new Error('请输入有效的邮箱地址');
        }
      }
    `,
    editor: { kind: "input", config: { placeholder: "example@mail.com" } },
  },
  {
    code: "phone",
    name: "手机号",
    description: "请输入 11 位手机号",
    type: "string",
    visible: true,
    required: true,
    validateRules: `
      function main(value, formValue) {
        if (!/^1[3-9]\\d{9}$/.test(value)) {
          throw new Error('请输入有效的手机号');
        }
      }
    `,
    editor: { kind: "input", config: { placeholder: "13800138000" } },
  },
  {
    code: "password",
    name: "密码",
    description: "密码至少 6 位",
    type: "string",
    visible: true,
    required: true,
    validateRules: `
      function main(value, formValue) {
        if (value.length < 6) {
          throw new Error('密码至少 6 位');
        }
      }
    `,
    editor: { kind: "input", config: { placeholder: "请输入密码" } },
  },
  {
    code: "confirmPassword",
    name: "确认密码",
    description: "两次密码需一致",
    type: "string",
    visible: true,
    required: true,
    validateRules: `
      function main(value, formValue) {
        if (value !== formValue.password) {
          throw new Error('两次密码不一致');
        }
      }
    `,
    editor: { kind: "input", config: { placeholder: "请再次输入密码" } },
  },
];

// ============================================================
// 场景 5: 嵌套对象
// ============================================================
const objectSchema: SchemaFormItemType[] = [
  {
    code: "userInfo",
    name: "用户信息",
    description: "嵌套的用户信息对象",
    type: "object",
    visible: true,
    required: false,
    editor: {
      kind: "objectEditor",
      config: {
        isDynamic: false,
        depItems: [],
        properties: [
          {
            code: "firstName",
            name: "名",
            type: "string",
            visible: true,
            required: true,
            editor: { kind: "input", config: { placeholder: "请输入名" } },
          },
          {
            code: "lastName",
            name: "姓",
            type: "string",
            visible: true,
            required: true,
            editor: { kind: "input", config: { placeholder: "请输入姓" } },
          },
          {
            code: "address",
            name: "地址",
            description: "嵌套的地址对象",
            type: "object",
            visible: true,
            required: false,
            editor: {
              kind: "objectEditor",
              config: {
                isDynamic: false,
                depItems: [],
                properties: [
                  {
                    code: "city",
                    name: "城市",
                    type: "string",
                    visible: true,
                    required: true,
                    editor: {
                      kind: "input",
                      config: { placeholder: "请输入城市" },
                    },
                  },
                  {
                    code: "zip",
                    name: "邮编",
                    type: "string",
                    visible: true,
                    required: false,
                    editor: {
                      kind: "input",
                      config: { placeholder: "请输入邮编" },
                    },
                  },
                ],
              },
            },
          },
        ],
      },
    },
  },
];

// ============================================================
// 场景 6: 数组编辑器（可增删列表）
// ============================================================
const arraySchema: SchemaFormItemType[] = [
  {
    code: "hobbies",
    name: "兴趣爱好",
    description: "添加您的兴趣爱好（字符串数组）",
    type: "array",
    visible: true,
    required: false,
    editor: {
      kind: "arrayEditor",
      config: {
        item: {
          code: "hobby",
          name: "兴趣爱好",
          type: "string",
          visible: true,
          required: false,
          editor: {
            kind: "input",
            config: { placeholder: "请输入兴趣爱好" },
          },
        },
      },
    },
  },
  {
    code: "scores",
    name: "成绩列表",
    description: "添加各科成绩（数字数组）",
    type: "array",
    visible: true,
    required: false,
    editor: {
      kind: "arrayEditor",
      config: {
        item: {
          code: "score",
          name: "成绩",
          type: "number",
          visible: true,
          required: false,
          editor: {
            kind: "numberInput",
            config: { placeholder: "请输入成绩", min: 0, max: 100 },
          },
        },
      },
    },
  },
  {
    code: "members",
    name: "团队成员",
    description: "添加团队成员（对象数组）",
    type: "array",
    visible: true,
    required: false,
    editor: {
      kind: "arrayEditor",
      config: {
        item: {
          code: "member",
          name: "成员",
          type: "object",
          visible: true,
          required: false,
          editor: {
            kind: "objectEditor",
            config: {
              isDynamic: false,
              depItems: [],
              properties: [
                {
                  code: "name",
                  name: "姓名",
                  type: "string",
                  visible: true,
                  required: true,
                  editor: {
                    kind: "input",
                    config: { placeholder: "请输入姓名" },
                  },
                },
                {
                  code: "role",
                  name: "角色",
                  type: "string",
                  visible: true,
                  required: true,
                  editor: {
                    kind: "select",
                    config: {
                      isDynamic: false,
                      depItems: [],
                      options: [
                        { value: "dev", label: "开发" },
                        { value: "design", label: "设计" },
                        { value: "pm", label: "产品" },
                      ],
                    },
                  },
                },
                {
                  code: "active",
                  name: "是否在职",
                  type: "boolean",
                  visible: true,
                  required: false,
                  editor: { kind: "switch" },
                },
              ],
            },
          },
        },
      },
    },
  },
];

// ============================================================
// 场景 7: 综合场景 - 所有类型混合
// ============================================================
const complexSchema: SchemaFormItemType[] = [
  {
    code: "projectName",
    name: "项目名称",
    type: "string",
    visible: true,
    required: true,
    editor: { kind: "input", config: { placeholder: "请输入项目名称" } },
  },
  {
    code: "description",
    name: "项目描述",
    type: "string",
    visible: true,
    required: false,
    editor: {
      kind: "textarea",
      config: { placeholder: "请输入项目描述", minRows: 3 },
    },
  },
  {
    code: "config",
    name: "项目配置",
    description: "嵌套的配置对象",
    type: "object",
    visible: true,
    required: false,
    editor: {
      kind: "objectEditor",
      config: {
        isDynamic: false,
        depItems: [],
        properties: [
          {
            code: "env",
            name: "环境",
            type: "string",
            visible: true,
            required: true,
            editor: {
              kind: "select",
              config: {
                isDynamic: false,
                depItems: [],
                options: [
                  { value: "dev", label: "开发" },
                  { value: "staging", label: "预发布" },
                  { value: "prod", label: "生产" },
                ],
              },
            },
          },
          {
            code: "debug",
            name: "调试模式",
            type: "boolean",
            visible: true,
            required: false,
            editor: { kind: "switch" },
          },
          {
            code: "tags",
            name: "标签",
            type: "array",
            visible: true,
            required: false,
            editor: {
              kind: "multiSelect",
              config: {
                isDynamic: false,
                depItems: [],
                options: [
                  { value: "frontend", label: "前端" },
                  { value: "backend", label: "后端" },
                  { value: "ops", label: "运维" },
                ],
              },
            },
          },
        ],
      },
    },
  },
  {
    code: "servers",
    name: "服务器列表",
    description: "添加服务器（对象数组）",
    type: "array",
    visible: true,
    required: false,
    editor: {
      kind: "arrayEditor",
      config: {
        item: {
          code: "server",
          name: "服务器",
          type: "object",
          visible: true,
          required: false,
          editor: {
            kind: "objectEditor",
            config: {
              isDynamic: false,
              depItems: [],
              properties: [
                {
                  code: "host",
                  name: "主机地址",
                  type: "string",
                  visible: true,
                  required: true,
                  editor: {
                    kind: "input",
                    config: { placeholder: "例如: 192.168.1.1" },
                  },
                },
                {
                  code: "port",
                  name: "端口",
                  type: "number",
                  visible: true,
                  required: true,
                  editor: {
                    kind: "numberInput",
                    config: {
                      placeholder: "例如: 8080",
                      defaultValue: 8080,
                      min: 1,
                      max: 65535,
                    },
                  },
                },
              ],
            },
          },
        },
      },
    },
  },
];

// ============================================================
// 场景配置
// ============================================================
interface SceneConfig {
  key: string;
  title: string;
  description: string;
  schema: SchemaFormItemType[];
}

const scenes: SceneConfig[] = [
  {
    key: "basic",
    title: "基础表单",
    description:
      "各种基础输入类型：input、textarea、inputWithCopy、richEditor、numberInput、select、switch",
    schema: basicSchema,
  },
  {
    key: "dynamicSelect",
    title: "Select 与多选",
    description: "静态数据源的 select 和 multiSelect",
    schema: dynamicSelectSchema,
  },
  {
    key: "visibleRules",
    title: "可见性规则",
    description: "通过 visibleRules 控制表单项的显示/隐藏",
    schema: visibleRulesSchema,
  },
  {
    key: "validate",
    title: "校验规则",
    description: "自定义校验规则：邮箱、手机号、密码一致性",
    schema: validateSchema,
  },
  {
    key: "object",
    title: "嵌套对象",
    description: "对象编辑器，支持多层嵌套（对象套对象）",
    schema: objectSchema,
  },
  {
    key: "array",
    title: "数组编辑器",
    description: "可增删的数组列表：字符串数组、数字数组、对象数组",
    schema: arraySchema,
  },
  {
    key: "complex",
    title: "综合场景",
    description: "所有类型混合：string、number、boolean、object、array 嵌套",
    schema: complexSchema,
  },
];

// ============================================================
// 调试区域：ArrayEditor 数据丢失问题验证
// ============================================================
function ArrayDebugPanel() {
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const formRef = useRef<any>(null);

  const debugSchema: SchemaFormItemType[] = [
    {
      code: "hobbies",
      name: "兴趣爱好",
      description: "添加兴趣爱好（字符串数组）",
      type: "array",
      visible: true,
      required: false,
      editor: {
        kind: "arrayEditor",
        config: {
          item: {
            code: "hobby",
            name: "兴趣爱好",
            type: "string",
            visible: true,
            required: false,
            editor: {
              kind: "input",
              config: { placeholder: "请输入兴趣爱好" },
            },
          },
        },
      },
    },
    {
      code: "members",
      name: "团队成员",
      description: "添加团队成员（对象数组）",
      type: "array",
      visible: true,
      required: false,
      editor: {
        kind: "arrayEditor",
        config: {
          item: {
            code: "member",
            name: "成员",
            type: "object",
            visible: true,
            required: false,
            editor: {
              kind: "objectEditor",
              config: {
                isDynamic: false,
                depItems: [],
                properties: [
                  {
                    code: "name",
                    name: "姓名",
                    type: "string",
                    visible: true,
                    required: true,
                    editor: {
                      kind: "input",
                      config: { placeholder: "请输入姓名" },
                    },
                  },
                  {
                    code: "role",
                    name: "角色",
                    type: "string",
                    visible: true,
                    required: true,
                    editor: {
                      kind: "select",
                      config: {
                        isDynamic: false,
                        depItems: [],
                        options: [
                          { value: "dev", label: "开发" },
                          { value: "design", label: "设计" },
                          { value: "pm", label: "产品" },
                        ],
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
    },
  ];

  return (
    <Card title="🔍 ArrayEditor 调试面板" className="mb-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <SchemaForm
            ref={formRef}
            schema={debugSchema}
            onValuesChange={(changedValues, allValues) => {
              console.log(
                "调试面板值变化:",
                JSON.stringify(changedValues),
                JSON.stringify(allValues),
              );
            }}
          />
          <Space className="mt-4">
            <Button
              type="primary"
              onClick={() => {
                const values = formRef.current?.getFieldsValue();
                setFormData(values);
                console.log("当前表单值:", JSON.stringify(values));
              }}
            >
              打印当前值
            </Button>
            <Button onClick={() => formRef.current?.resetFields()}>重置</Button>
          </Space>
        </div>
        <div>
          <Card title="表单数据">
            {formData ? (
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(formData, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">点击"打印当前值"查看</Text>
            )}
          </Card>
        </div>
      </div>
    </Card>
  );
}

export default function SchemaFormDemo() {
  const [activeScene, setActiveScene] = useState<string>("basic");
  const [formData, setFormData] = useState<Record<string, any> | null>(null);
  const [schemaJson, setSchemaJson] = useState<string>("");
  const formRef = useRef<any>(null);

  const currentScene = scenes.find((s) => s.key === activeScene)!;

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current
        .validateFields()
        .then((values: any) => {
          setFormData(values);
          setSchemaJson(JSON.stringify(currentScene.schema, null, 2));
        })
        .catch((err: any) => {
          console.error("校验失败:", err);
        });
    }
  };

  const handleReset = () => {
    if (formRef.current) {
      formRef.current.resetFields();
      setFormData(null);
      setSchemaJson("");
    }
  };

  const handleSetFormData = () => {
    if (formRef.current) {
      formRef.current.setFieldsValue({
        username: "预设用户",
        age: 25,
        enabled: true,
        email: "test@example.com",
        phone: "13800138000",
      });
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Title level={2}>SchemaForm 组件测试</Title>
      <Paragraph>
        基于 schema 配置动态渲染表单，覆盖所有编辑器类型和功能特性。
      </Paragraph>

      <Divider />

      {/* 场景选择 */}
      <Card title="选择测试场景" className="mb-4">
        <Space wrap>
          {scenes.map((scene) => (
            <Button
              key={scene.key}
              type={activeScene === scene.key ? "primary" : "default"}
              onClick={() => {
                setActiveScene(scene.key);
                setFormData(null);
                setSchemaJson("");
              }}
            >
              {scene.title}
            </Button>
          ))}
        </Space>
        <div className="mt-2">
          <Text type="secondary">{currentScene.description}</Text>
        </div>
      </Card>

      {/* 表单区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 左侧：表单 */}
        <Card
          title={currentScene.title}
          extra={
            <Space>
              <Button onClick={handleSetFormData}>设置预设值</Button>
              <Button onClick={handleReset}>重置</Button>
              <Button type="primary" onClick={handleSubmit}>
                提交
              </Button>
            </Space>
          }
        >
          <SchemaForm
            ref={formRef}
            schema={currentScene.schema}
            onValuesChange={(changedValues, allValues) => {
              console.log(
                "值变化:",
                changedValues,
                JSON.stringify(allValues, null, 2),
              );
            }}
          />
        </Card>

        {/* 右侧：结果展示 */}
        <div className="flex flex-col gap-4">
          {/* 提交数据 */}
          <Card title="提交数据">
            {formData ? (
              <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-60">
                {JSON.stringify(formData, null, 2)}
              </pre>
            ) : (
              <Text type="secondary">点击"提交"按钮查看表单数据</Text>
            )}
          </Card>

          {/* Schema 定义 */}
          <Collapse
            items={[
              {
                key: "schema",
                label: "当前 Schema 定义",
                children: schemaJson ? (
                  <pre className="bg-gray-50 p-3 rounded text-sm overflow-auto max-h-80">
                    {schemaJson}
                  </pre>
                ) : (
                  <Text type="secondary">提交后显示当前场景的 Schema 定义</Text>
                ),
              },
            ]}
          />
        </div>
      </div>

      <Divider />

      {/* 调试面板 */}
      <ArrayDebugPanel />

      <Form onFinish={(values) => console.log(values)}>
        <MyFormItem name="age2333" label="Age2333">
          <Input />
        </MyFormItem>
        <MyFormItemGroup prefix={["good"]}>
          <MyFormItemGroup prefix={["name"]}>
            <MyFormItem name="firstName" label="First Name">
              <Input />
            </MyFormItem>
            <MyFormItem name="lastName" label="Last Name">
              <Input />
            </MyFormItem>
          </MyFormItemGroup>

          <MyFormItem name="lf" label="LF">
            <MyFormItemGroup prefix={["lf"]}>
              <MyFormItem name={0} label="First Name">
                <Input />
              </MyFormItem>
              <MyFormItemGroup prefix={[1]}>
                <MyFormItem name="test" label="test">
                  <Input />
                </MyFormItem>
                <MyFormItem name="test2" label="test2">
                  <Input />
                </MyFormItem>
              </MyFormItemGroup>

              <MyFormItem name={2} label="Last Name">
                <Input />
              </MyFormItem>
            </MyFormItemGroup>
          </MyFormItem>

          <MyFormItem name="age" label="Age">
            <Input />
          </MyFormItem>
        </MyFormItemGroup>

        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}
