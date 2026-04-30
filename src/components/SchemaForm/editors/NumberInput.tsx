import { InputNumber } from "antd";
import type { NumberInputConfig } from "../types";
import type { CommonEditorProps } from "../editorType";
import useRealEditorProps from "../hooks/useRealEditorProps";

export default function NumberInput(
  props: CommonEditorProps<number, NumberInputConfig>,
) {
  const { editorProps } = useRealEditorProps(props);

  return <InputNumber style={{ width: "100%" }} {...editorProps} />;
}
