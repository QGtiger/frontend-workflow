import { IpaasSchemaForm } from "@/components/IPaaSForm";
import { SideBarHeader } from "./SideBarHeader";

import "./SideBarRender.css";
import { executeScript } from "./utils";
import { Button, Form } from "antd";

export function SideBarRender() {
  const [form] = Form.useForm();
  return (
    <div className="">
      <SideBarHeader />
      <div className="px-4">
        <IpaasSchemaForm
          formProps={{
            requiredMark: "optional",
            onValuesChange: (changedFields, allFields) => {
              console.log("changedFields", changedFields);
              console.log("allFields", allFields);
            },
            form,
            initialValues: {
              a: "aa",
              params: {
                va: "va",
              },
            },
          }}
          dynamicScriptExcuteWithFormSchema={({ script }) => {
            return executeScript(script);
          }}
          schema={[
            {
              code: "a",
              name: "测试",
              type: "string",
              required: true,
              description:
                "请输入有效的标识符，仅支持 **字母**、**数字** 和 **下划线**。[查看文档](https://docs.example.com)",
              editor: {
                kind: "Input",
                config: {
                  placeholder: "请输入22",
                  defaultValue: "123",
                },
              },
            },
            {
              code: "params",
              name: "测试2",
              type: "object",
              required: false,
              description:
                "请输入有效的标识符，仅支持 **字母**、**数字** 和 **下划线**。[查看文档](https://docs.example.com)",
              editor: {
                kind: "DynamicActionForm",
                config: {
                  dynamicScript: `async function main() {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    return [
                      {
                        code: 'va',
                        name: '测试2',
                        type: 'string',
                        required: true,
                        description:
                          "请输入有效的标识符，仅支持 **字母**、**数字** 和 **下划线**。[查看文档](https://docs.example.com)",
                        editor: {
                          kind: "Input",
                          config: {
                            placeholder: "测试2",
                            defaultValue: "测试2",
                          },
                        },
                      },
                    ]
                  }`,
                },
              },
            },
          ]}
        />
        <Button
          block
          type="primary"
          onClick={() => {
            form.validateFields().then(console.log);
          }}
        >
          完成
        </Button>
      </div>
    </div>
  );
}
