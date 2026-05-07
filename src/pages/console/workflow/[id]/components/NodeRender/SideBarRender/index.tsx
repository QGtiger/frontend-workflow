import { SideBarHeader } from "./SideBarHeader";

import "./SideBarRender.css";
import { executeScript } from "../utils";
import { Button, ConfigProvider, Form, Skeleton, Tabs } from "antd";
import { useCallback, useMemo, type ComponentType } from "react";
import { CustomNodeRenderModel, useCustomNodeData } from "../model";
import type { CustomNodeData } from "../../../types";
import { useRequest } from "ahooks";
import { FormItemWithExpression } from "../components/FormItemWithExpression";
import ConditionEditor from "../components/ConditionEditor";
import { ConnectorSelectorModel } from "../../../../ConnectorSelectorModel";
import SchemaForm, { type SchemaFormItemType } from "@/components/SchemaForm";
import { useWorkflowId } from "@/pages/console/workflow/hooks";
import { getBuiltInRegistryInputsSchema } from "./constant";
import type { TabsProps } from "antd/lib";

const extraEditorMap: Record<string, ComponentType<any>> = {
  ConditionEditor,
};

function replaceTemplateText(text: string, data: any) {
  if (!text) return "";
  return text.replace(/{{(.*?)}}/g, (match, key) => {
    return data[key.trim()] || "";
  });
}

function replaceTemplateUrl(url: string, id?: string) {
  return replaceTemplateText(url, { workflowId: id, host: location.origin });
}

function ActionConfigForm({
  inputsSchema,
}: {
  inputsSchema: SchemaFormItemType[];
}) {
  const [form] = Form.useForm();
  const data = useCustomNodeData();
  const { updateData } = CustomNodeRenderModel.useModel();
  const workflowId = useWorkflowId();

  const handleDynamicScript = useCallback(
    ({ script }: { script: string }) => executeScript(script),
    [],
  );

  return (
    <SchemaForm
      form={form}
      initialValues={data.inputs}
      schema={inputsSchema}
      onValuesChange={() => {
        console.log("inputsSchema change", inputsSchema, form.getFieldsValue());
        updateData({
          inputs: form.getFieldsValue(),
        });
      }}
      renderEditor={({ schema, Fc, props }) => {
        // 复杂类型就不支持 表达式了，否则数据会很乱，特别是 数组
        if (["object", "array"].includes(schema.type)) {
          return <Fc {...props} />;
        }
        // if (extraEditorMap[schema.editor?.kind]) {
        //   return <Fc {...props} />;
        // }
        // TODO webhookUrl 参数替换
        if (props.config.copyText) {
          props.config.copyText = replaceTemplateUrl(
            props.config.copyText,
            workflowId,
          );
        }
        return (
          <FormItemWithExpression
            Componet={Fc}
            schema={schema}
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
    />
  );
}

function SideBarContent() {
  const { outputStruct } = useCustomNodeData<WorkflowAppNodeBlock["data"]>();
  const data = useCustomNodeData();
  const { registry } = CustomNodeRenderModel.useModel();
  const { queryIPaaSConnectorAction } = ConnectorSelectorModel.useModel();

  const { data: inputsSchema, loading: inputsSchemaLoading } = useRequest(
    async () => {
      if (["custom", "start"].includes(registry.type as string)) {
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

  const tabItems = useMemo(() => {
    const list: TabsProps["items"] = [];

    if (inputsSchema?.length) {
      list.push({
        key: "config",
        label: "设置",
        children: <ActionConfigForm inputsSchema={inputsSchema} />,
      });
    }

    if (outputStruct) {
      list.push({
        key: "outputs",
        label: "出参",
        children: "TODO",
      });
    }
    return list;
  }, [outputStruct, inputsSchema]);

  if (inputsSchemaLoading) {
    return <Skeleton active />;
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Tabs: {
            horizontalMargin: "0 0 4px",
            horizontalItemGutter: 16,
          },
          Form: {
            itemMarginBottom: 12,
          },
        },
      }}
    >
      {tabItems.length ? (
        <Tabs
          className="-mt-2"
          size="small"
          styles={{
            header: {
              fontWeight: 600,
            },
            content: {
              marginTop: 8,
            },
          }}
          items={tabItems}
        />
      ) : null}
    </ConfigProvider>
  );
}

export function SideBarRender() {
  return (
    <div className="flex flex-col h-full">
      <SideBarHeader />
      <div className="px-4 h-1 flex-1 overflow-auto mt-2 pt-2">
        <SideBarContent />
      </div>
    </div>
  );
}
