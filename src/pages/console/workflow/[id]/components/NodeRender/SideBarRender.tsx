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
import { ConnectorSelectorModel } from "../../../ConnectorSelectorModel";

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
      loadingDelay: 500,
    },
  );

  const handleDynamicScript = useCallback(
    ({ script }: { script: string }) => executeScript(script),
    [],
  );

  return (
    <div className="flex flex-col h-full">
      <SideBarHeader />
      <div className="px-4 h-1 flex-1 overflow-auto">
        {inputsSchemaLoading ? (
          <Skeleton active />
        ) : inputsSchema?.length ? (
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
