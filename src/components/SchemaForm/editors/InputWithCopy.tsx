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
    config: { copyText, btnText = "复制" },
    editorProps,
  } = useRealEditorProps(props);

  return (
    <Input
      {...editorProps}
      value={copyText}
      readOnly
      addonAfter={
        <span
          style={{ cursor: "pointer" }}
          onClick={() => {
            navigator.clipboard.writeText(copyText || "");
          }}
        >
          {btnText}
        </span>
      }
    />
  );
}
