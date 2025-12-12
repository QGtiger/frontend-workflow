import { IpaasSchemaForm } from "@/components/IPaaSForm";
import { SideBarHeader } from "./SideBarHeader";

import "./SideBarRender.css";
import { executeScript } from "./utils";
import { Button, Form } from "antd";
import { useCallback } from "react";

// 提取常量，避免重复
const COMMON_DESCRIPTION =
  "请输入有效的标识符，仅支持 **字母**、**数字** 和 **下划线**。[查看文档](https://docs.example.com)";

// 动态表单脚本
const DYNAMIC_FORM_SCRIPT = `async function main() {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    {
      code: 'va',
      name: '测试2',
      type: 'string',
      required: true,
      description: "${COMMON_DESCRIPTION}",
      editor: {
        kind: "Input",
        config: {
          placeholder: "测试2",
          defaultValue: "测试2",
        },
      },
    },
  ]
}`;

export function SideBarRender() {
  const [form] = Form.useForm();

  const handleValuesChange = useCallback(
    (changedFields: any, allFields: any) => {
      // TODO: 生产环境移除调试日志
      if (process.env.NODE_ENV === "development") {
        console.log("changedFields", changedFields);
        console.log("allFields", allFields);
      }
    },
    []
  );

  const handleDynamicScript = useCallback(
    ({ script }: { script: string }) => executeScript(script),
    []
  );

  const handleSubmit = useCallback(() => {
    form.validateFields().then(console.log);
  }, [form]);

  return (
    <div className="flex flex-col h-full">
      <SideBarHeader />
      <div className="px-4 h-1 flex-1 overflow-auto">
        <IpaasSchemaForm
          formProps={{
            requiredMark: "optional",
            onValuesChange: handleValuesChange,
            form,
            initialValues: {
              a: "",
              params: {
                va: "va",
              },
            },
          }}
          dynamicScriptExcuteWithFormSchema={handleDynamicScript}
          renderEditor={({ schema, Fc, props }) => {
            return (
              <div>
                {schema.code}
                <div className=" whitespace-break-spaces">
                  {JSON.stringify(props, null, 2)}
                </div>
                <Fc {...props} />
              </div>
            );
          }}
          schema={[
            {
              code: "a",
              name: "测试",
              type: "string",
              required: true,
              description: COMMON_DESCRIPTION,
              editor: {
                kind: "Select",
                config: {
                  placeholder: "请输入22",
                  defaultValue: "123",
                  options: [
                    {
                      label: "123",
                      value: "123",
                    },
                  ],
                },
              },
            },
            {
              code: "params",
              name: "测试2",
              type: "object",
              required: false,
              description: COMMON_DESCRIPTION,
              editor: {
                kind: "DynamicActionForm",
                config: {
                  dynamicScript: DYNAMIC_FORM_SCRIPT,
                },
              },
            },
          ]}
        />
      </div>
    </div>
  );
}
