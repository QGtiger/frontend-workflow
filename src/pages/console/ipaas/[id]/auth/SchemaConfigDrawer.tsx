import type {
  IPaasFormFieldEditorKind,
  IPaasFormSchema,
} from "@/components/IPaaSForm";
import {
  Button,
  Divider,
  Drawer,
  Form,
  Input,
  InputNumber,
  message,
  Select,
  Space,
  Switch,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import { EditorKindEnum } from "./constant";

// 编辑器类型选项
const EDITOR_KIND_OPTIONS = Object.entries(EditorKindEnum).map(
  ([value, label]) => ({ value, label })
);

// 数据类型选项
const DATA_TYPE_OPTIONS = [
  { value: "string", label: "字符串" },
  { value: "number", label: "数字" },
  { value: "boolean", label: "布尔值" },
  { value: "object", label: "对象" },
  { value: "array", label: "数组" },
];

// 日期格式选项
const DATETIME_FORMAT_OPTIONS = [
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
  { value: "YYYY-MM-DD HH:mm:ss", label: "YYYY-MM-DD HH:mm:ss" },
  { value: "accurateToSeconds", label: "精确到秒（时间戳）" },
  { value: "accurateToMilliseconds", label: "精确到毫秒（时间戳）" },
];

// 编辑器配置表单
function EditorConfigForm({ kind }: { kind: IPaasFormFieldEditorKind }) {
  switch (kind) {
    case "Input":
    case "Textarea":
      return (
        <>
          <Form.Item label="默认值" name={["editor", "config", "defaultValue"]}>
            {kind === "Textarea" ? (
              <TextArea placeholder="请输入默认值" rows={3} />
            ) : (
              <Input placeholder="请输入默认值" />
            )}
          </Form.Item>
          <Form.Item label="占位符" name={["editor", "config", "placeholder"]}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
        </>
      );

    case "InputNumber":
      return (
        <>
          <Form.Item label="默认值" name={["editor", "config", "defaultValue"]}>
            <InputNumber placeholder="请输入默认值" className="w-full!" />
          </Form.Item>
          <Form.Item label="占位符" name={["editor", "config", "placeholder"]}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
        </>
      );

    case "DatetimePicker":
      return (
        <>
          <Form.Item label="占位符" name={["editor", "config", "placeholder"]}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
          <Form.Item
            label="日期格式"
            name={["editor", "config", "valueFormat"]}
          >
            <Select
              options={DATETIME_FORMAT_OPTIONS}
              placeholder="请选择日期格式"
            />
          </Form.Item>
        </>
      );

    case "InputWithCopy":
      return (
        <>
          <Form.Item label="默认值" name={["editor", "config", "defaultValue"]}>
            <Input placeholder="请输入默认值" />
          </Form.Item>
          <Form.Item label="按钮文本" name={["editor", "config", "btnText"]}>
            <Input placeholder="复制" />
          </Form.Item>
        </>
      );

    case "Select":
      return (
        <>
          <Form.Item label="默认值" name={["editor", "config", "defaultValue"]}>
            <Input placeholder="请输入默认值" />
          </Form.Item>
          <Form.Item label="占位符" name={["editor", "config", "placeholder"]}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
          <Form.Item
            label="动态选项"
            name={["editor", "config", "isDynamic"]}
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          <Form.Item
            noStyle
            shouldUpdate={(prev, cur) =>
              prev?.editor?.config?.isDynamic !== cur?.editor?.config?.isDynamic
            }
          >
            {({ getFieldValue }) =>
              getFieldValue(["editor", "config", "isDynamic"]) && (
                <>
                  <Form.Item
                    label="依赖字段"
                    name={["editor", "config", "depItems"]}
                  >
                    <Select
                      mode="tags"
                      placeholder="输入字段 code，回车添加"
                      tokenSeparators={[","]}
                    />
                  </Form.Item>
                  <Form.Item
                    label="动态脚本"
                    name={["editor", "config", "dynamicScript"]}
                  >
                    <TextArea
                      rows={6}
                      placeholder="编写动态选项脚本"
                      style={{ fontFamily: "monospace" }}
                    />
                  </Form.Item>
                </>
              )
            }
          </Form.Item>
        </>
      );

    case "MultiSelect":
      return (
        <>
          <Form.Item label="占位符" name={["editor", "config", "placeholder"]}>
            <Input placeholder="请输入占位符" />
          </Form.Item>
          <Form.Item label="依赖字段" name={["editor", "config", "depItems"]}>
            <Select
              mode="tags"
              placeholder="输入字段 code，回车添加"
              tokenSeparators={[","]}
            />
          </Form.Item>
          <Form.Item
            label="动态脚本"
            name={["editor", "config", "dynamicScript"]}
          >
            <TextArea
              rows={6}
              placeholder="编写动态选项脚本"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>
        </>
      );

    case "DynamicActionForm":
      return (
        <>
          <Form.Item label="依赖字段" name={["editor", "config", "depItems"]}>
            <Select
              mode="tags"
              placeholder="输入字段 code，回车添加"
              tokenSeparators={[","]}
            />
          </Form.Item>
          <Form.Item
            label="动态脚本"
            name={["editor", "config", "dynamicScript"]}
          >
            <TextArea
              rows={8}
              placeholder="编写动态表单脚本"
              style={{ fontFamily: "monospace" }}
            />
          </Form.Item>
        </>
      );

    case "Upload":
      return (
        <div className="text-gray-500 text-sm py-2">
          文件上传组件无需额外配置
        </div>
      );

    default:
      return null;
  }
}

// Schema 配置 Drawer
export function SchemaConfigDrawer({
  initialValues,
  isEdit,
  onClose,
  onSave,
}: {
  isEdit?: boolean;
  onClose: () => void;
  onSave: (values: IPaasFormSchema) => Promise<any>;
  initialValues?: IPaasFormSchema;
}) {
  const [form] = Form.useForm();
  const editorKind = Form.useWatch(["editor", "kind"], form);

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      await onSave(values);
      onClose();
    } catch (error) {
      console.error("表单验证失败:", error);
      message.error((error as Error).message);
    }
  };

  return (
    <Drawer
      title={!isEdit ? "添加字段" : "编辑字段"}
      width={860}
      open
      closable={false}
      onClose={onClose}
      maskClosable={false}
      extra={
        <Space>
          <Button onClick={onClose}>取消</Button>
          <Button type="primary" onClick={handleSave}>
            保存
          </Button>
        </Space>
      }
    >
      <Form<IPaasFormSchema>
        form={form}
        initialValues={initialValues}
        layout="vertical"
        requiredMark="optional"
      >
        {/* 基本信息 */}
        <div className="mb-2 font-medium text-gray-700">基本信息</div>
        <Form.Item
          label="字段代码"
          name="code"
          rules={[
            { required: true, message: "请输入字段代码" },
            // 字段 代码只能是字母、数字、下划线，并且不能以数字开头
            {
              pattern: /^[a-zA-Z_][a-zA-Z0-9_]*$/,
              message: "字段代码只能是字母、数字、下划线，并且不能以数字开头",
            },
          ]}
        >
          <Input placeholder="例如: apiKey" disabled={isEdit} />
        </Form.Item>

        <Form.Item
          label="字段名称"
          name="name"
          rules={[{ required: true, message: "请输入字段名称" }]}
        >
          <Input placeholder="例如: API Key" />
        </Form.Item>

        <Form.Item
          label="数据类型"
          name="type"
          rules={[{ required: true, message: "请选择数据类型" }]}
        >
          <Select options={DATA_TYPE_OPTIONS} placeholder="请选择数据类型" />
        </Form.Item>

        <Form.Item label="字段描述" name="description">
          <TextArea placeholder="字段说明" rows={2} />
        </Form.Item>

        <Form.Item label="字段分组" name="group">
          <Input placeholder="字段分组名称（可选）" />
        </Form.Item>

        <Form.Item label="是否必填" name="required" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Divider />

        {/* 可见性 */}
        <div className="mb-2 font-medium text-gray-700">可见性配置</div>
        <Form.Item label="默认可见" name="visible" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item
          noStyle
          shouldUpdate={(prev, cur) => prev?.visible !== cur?.visible}
        >
          {({ getFieldValue }) =>
            getFieldValue("visible") === false && (
              <Form.Item label="可见性规则脚本" name="visibleRules">
                <TextArea
                  placeholder="编写可见性判断脚本"
                  rows={4}
                  style={{ fontFamily: "monospace" }}
                />
              </Form.Item>
            )
          }
        </Form.Item>

        <Divider />

        {/* 验证规则 */}
        <div className="mb-2 font-medium text-gray-700">验证规则</div>
        <Form.Item name="validateRules">
          <TextArea
            placeholder="编写验证规则脚本（可选）"
            rows={4}
            style={{ fontFamily: "monospace" }}
          />
        </Form.Item>

        <Divider />

        {/* 编辑器配置 */}
        <div className="mb-2 font-medium text-gray-700">编辑器配置</div>
        <Form.Item
          label="编辑器类型"
          name={["editor", "kind"]}
          rules={[{ required: true, message: "请选择编辑器类型" }]}
        >
          <Select
            options={EDITOR_KIND_OPTIONS}
            onChange={() => {
              // 切换时重置配置
              form.setFieldValue(["editor", "config"], {});
            }}
            placeholder="请选择控件类型"
          />
        </Form.Item>

        {editorKind && <EditorConfigForm kind={editorKind} />}
      </Form>
    </Drawer>
  );
}
