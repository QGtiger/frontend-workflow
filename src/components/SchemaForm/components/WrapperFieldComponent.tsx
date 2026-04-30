import { Form } from "antd";
import { type ComponentType } from "react";
import ReactMarkdown from "react-markdown";
import type { SchemaFormItemType } from "../types";
import { useSchemaFormContext } from "../context";
import type { CommonEditorProps } from "../editorType";

// 默认渲染
const defaultRenderEditor = ({
  Fc,
  props,
}: {
  Fc: ComponentType<CommonEditorProps<any, any>>;
  props: any;
}) => <Fc {...props} />;

/**
 * 桥接组件
 *
 * 作为 Form.Item 的直接子元素，接收 Form.Item 通过 name 注入的 value 和 onChange，
 * 然后与 editorProps 合并后透传给编辑器组件。
 *
 * 同时处理布局包装（带描述信息）。
 */
export default function WrapperFieldComponent(props: {
  schema: SchemaFormItemType;
}) {
  const { editorLayout, renderEditor, editors } = useSchemaFormContext();
  const { schema, ...otherProps } = props;
  const { editor, name, description } = schema;
  const form = Form.useFormInstance();

  // 获取编辑器组件
  const Fc = editors[editor.kind];

  if (!Fc) {
    console.warn(`SchemaForm: 未找到编辑器组件 kind="${editor.kind}"`);
    return null;
  }

  const renderFn = renderEditor || defaultRenderEditor;

  // otherProps 包含 Form.Item 注入的 value、onChange 等
  // editorProps 包含 config、动态数据等
  const mergedProps = {
    ...otherProps,
    config: editor.config || {},
    schema,
  };

  return (
    <div className="relative">
      {editorLayout({
        editor: renderFn({
          schema,
          form,
          Fc,
          props: mergedProps,
        }),
        desc: description && (
          <div className="desc text-[#888f9d] text-xs">
            <ReactMarkdown>{description}</ReactMarkdown>
          </div>
        ),
        title: name,
      })}
    </div>
  );
}
