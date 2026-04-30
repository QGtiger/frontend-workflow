import { Input } from "antd";
import type { InputWithCopyConfig } from "../types";
import type { CommonEditorProps } from "../editorType";
import useRealEditorProps from "../hooks/useRealEditorProps";

/**
 * InputWithCopy - 可编辑输入框，带复制按钮
 * - config.copyText 用于覆盖「复制」按钮的文案
 * - config.defaultValue 作为默认值（由 withDefaultValue HOC 处理）
 * - 用户可编辑输入框内容，点击复制按钮复制当前内容
 */
export default function InputWithCopy(
  props: CommonEditorProps<string, InputWithCopyConfig>,
) {
  const {
    config: { copyText },
    editorProps,
  } = useRealEditorProps(props);

  const copyLabel = copyText || "复制";

  return (
    <Input
      {...editorProps}
      addonAfter={
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard.writeText(editorProps.value || "");
          }}
        >
          {copyLabel}
        </span>
      }
    />
  );
}
