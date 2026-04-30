import { Form, type FormProps } from "antd";
import { forwardRef, useMemo, useImperativeHandle } from "react";
import type { SchemaFormProps } from "./types";
import { SchemaFormContext, type SchemaFormContextValue } from "./context";
import { defaultEditorRegistry } from "./editors/registry";
import SchemaFormItemComponent from "./components/SchemaFormItem";

// 默认布局包装
const defaultLayout: SchemaFormContextValue["editorLayout"] = ({
  editor,
  desc,
  title,
}) => (
  <div className="flex flex-col gap-1">
    {title}
    {desc}
    {editor}
  </div>
);

export default function SchemaForm(props: SchemaFormProps & FormProps) {
  const {
    schema,
    initialValues,
    onValuesChange,
    editors: customEditors = {},
    dynamicScriptExcute,
    dynamicScriptExcuteWithFormSchema,
    normalize,
    validatefield,
    editorLayout,
    renderEditor,
    dynamicDebounce = 300,
    form,
  } = props;

  // 暴露 实例给父组件
  // useImperativeHandle(ref, () => finalFormInstance, [finalFormInstance]);

  // 合并默认编辑器注册表和自定义编辑器
  const mergedEditors = useMemo(
    () => ({
      ...defaultEditorRegistry,
      ...customEditors,
    }),
    [customEditors],
  );

  // 构建 context value
  const contextValue = useMemo<SchemaFormContextValue>(
    () => ({
      editors: mergedEditors,
      dynamicScriptExcute,
      dynamicScriptExcuteWithFormSchema,
      normalize: normalize || ((v: any) => v),
      validatefield,
      editorLayout: editorLayout || defaultLayout,
      renderEditor,
      dynamicDebounce,
    }),
    [
      mergedEditors,
      dynamicScriptExcute,
      dynamicScriptExcuteWithFormSchema,
      normalize,
      validatefield,
      editorLayout,
      renderEditor,
      dynamicDebounce,
    ],
  );

  return (
    <SchemaFormContext.Provider value={contextValue}>
      <Form
        form={form}
        initialValues={initialValues}
        onValuesChange={onValuesChange}
      >
        {schema.map((item) => (
          <SchemaFormItemComponent key={item.code} schema={item} form={form} />
        ))}
      </Form>
    </SchemaFormContext.Provider>
  );
}
export * from "./types";
