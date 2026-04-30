import { Form } from "antd";
import type { ObjectEditorType } from "../types";
import SchemaFormItemComponent from "../components/SchemaFormItem";
import useRealEditorProps from "../hooks/useRealEditorProps";
import { MyFormItemGroup } from "../components/MyFormItem";

/**
 * Object 编辑器 - 纯展示组件
 * 不关心数据源是静态还是动态，由上层通过 properties prop 注入
 * 职责：递归渲染子表单项
 *
 * 注意：ObjectEditor 不参与 Form name 路径管理。
 * 它依赖外层 Form.Item 已经建立的路径上下文，内部子字段直接用 item.code 作为 name。
 * 这样无论是作为普通字段还是数组项，路径继承都能正常工作。
 */
export default function ObjectEditor(props: any) {
  const { config, schema } =
    useRealEditorProps<ObjectEditorType["config"]>(props);
  const form = Form.useFormInstance();
  const { properties, isDynamic } = config;
  if (isDynamic) {
    throw new Error("ObjectEditor: 动态对象不支持");
  }

  console.log("ObjectEditor", props);

  if (!properties || properties.length === 0) {
    return null;
  }

  return (
    <div className="rounded-md bg-gray-50 px-4 pt-2">
      <MyFormItemGroup prefix={[schema.code]}>
        {properties.map((item) => (
          <SchemaFormItemComponent key={item.code} schema={item} form={form} />
        ))}
      </MyFormItemGroup>
    </div>
  );
}
