import { IpaasSchemaForm } from "@/components/IPaaSForm";
import { SideBarHeader } from "./SideBarHeader";

import "./SideBarRender.css";
import { executeScript, getBuiltInRegistryInputsSchema } from "./utils";
import { Button, Form, Skeleton } from "antd";
import { useCallback, type ComponentType } from "react";
import { CustomNodeRenderModel, useCustomNodeData } from "./model";
import type { CustomNodeData } from "../../types";
import { useRequest } from "ahooks";
import { FormItemWithExpression } from "./components/FormItemWithExpression";
import ConditionEditor from "./components/ConditionEditor";
import { ConnectorSelectorModel } from "../../models";

// // 提取常量，避免重复
// const COMMON_DESCRIPTION =
//   "请输入有效的标识符，仅支持 **字母**、**数字** 和 **下划线**。[查看文档](https://docs.example.com)";

// // 动态表单脚本
// const DYNAMIC_FORM_SCRIPT = `async function main() {
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return [
//     {
//       code: 'va',
//       name: '测试2',
//       type: 'string',
//       required: true,
//       description: "${COMMON_DESCRIPTION}",
//       editor: {
//         kind: "Input",
//         config: {
//           placeholder: "测试2",
//           defaultValue: "测试2",
//         },
//       },
//     },
//   ]
// }`;

// [
//   {
//     code: "a",
//     name: "测试",
//     type: "string",
//     required: true,
//     description: COMMON_DESCRIPTION,
//     editor: {
//       kind: "Select",
//       config: {
//         placeholder: "请输入22",
//         defaultValue: "123",
//         options: [
//           {
//             label: "123",
//             value: "123",
//           },
//         ],
//       },
//     },
//   },
//   {
//     code: "params",
//     name: "测试2",
//     type: "object",
//     required: false,
//     description: COMMON_DESCRIPTION,
//     editor: {
//       kind: "DynamicActionForm",
//       config: {
//         dynamicScript: DYNAMIC_FORM_SCRIPT,
//       },
//     },
//   },
// ]

const extraEditorMap: Record<string, ComponentType<any>> = {
  ConditionEditor,
};

export function SideBarRender() {
  const [form] = Form.useForm();
  const data = useCustomNodeData<CustomNodeData>();
  const { registry, updateData } = CustomNodeRenderModel.useModel();
  const { queryIPaaSConnectorAction } = ConnectorSelectorModel.useModel();

  const { data: inputsSchema, loading: inputsSchemaLoading } = useRequest(
    async () => {
      if (registry.type === "custom") {
        const action = await queryIPaaSConnectorAction({
          code: data.connectorCode,
          version: data.version,
          actionCode: data.actionCode,
        });
        return action.inputsSchema;
      } else {
        return getBuiltInRegistryInputsSchema(registry.type);
      }
    },
    {
      loadingDelay: 1000,
    }
  );

  const handleDynamicScript = useCallback(
    ({ script }: { script: string }) => executeScript(script),
    []
  );

  return (
    <div className="flex flex-col h-full">
      <SideBarHeader />
      <div className="px-4 h-1 flex-1 overflow-auto">
        {inputsSchemaLoading ? null : inputsSchema?.length ? (
          <IpaasSchemaForm
            formProps={{
              requiredMark: "optional",
              onValuesChange: () => {
                updateData({
                  inputs: form.getFieldsValue(),
                });
              },
              form,
              initialValues: data.inputs,
            }}
            dynamicScriptExcuteWithFormSchema={handleDynamicScript}
            renderEditor={({ schema, Fc, props }) => {
              if (extraEditorMap[schema.editor?.kind]) {
                return <Fc {...props} />;
              }
              return (
                <FormItemWithExpression
                  Componet={Fc}
                  {...props}
                ></FormItemWithExpression>
              );
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
            schema={inputsSchema}
            editorMap={extraEditorMap}
          />
        ) : null}
      </div>
    </div>
  );
}
