import { Button, Form } from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import { MyFormItemGroup } from "../components/MyFormItem";
import useRealEditorProps from "../hooks/useRealEditorProps";
import type { SchemaFormItemType } from "../types";
import SchemaFormItem from "../components/SchemaFormItem";

/**
 * Array 编辑器
 * 自己管理数组的增删，不依赖 Form.List
 * 每一项使用 MyFormItemGroup prefix={[index]} 包裹，利用 MyFormItemContext 的路径继承
 */
export default function ArrayEditor(props: any) {
  const {
    config,
    schema,
    editorProps: { value, onChange },
  } = useRealEditorProps<{
    item: SchemaFormItemType;
  }>(props);
  const form = Form.useFormInstance();

  const checkValue = value || [];

  const handleAdd = () => {
    console.log(checkValue);
    const newValue = [...checkValue, undefined];
    onChange?.(newValue);
  };

  const handleRemove = (index: number) => {
    // 显式声明参数 i 的类型为 number
    const newValue = checkValue.filter((_: any, i: number) => i !== index);
    onChange?.(newValue);
  };

  return (
    <MyFormItemGroup prefix={schema.code}>
      <div className="flex flex-col gap-2">
        {checkValue?.map((_: any, index: number) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex-1">
              <SchemaFormItem
                schema={{
                  ...config.item,
                  // @ts-ignore
                  code: index,
                }}
                form={form}
              />
            </div>
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleRemove(index)}
            />
          </div>
        ))}
        <Button type="dashed" onClick={handleAdd} block icon={<PlusOutlined />}>
          添加
        </Button>
      </div>
    </MyFormItemGroup>
  );
}
