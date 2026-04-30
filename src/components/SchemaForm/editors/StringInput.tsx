import { Input } from "antd";
import type { InputConfig } from "../types";
import useRealEditorProps from "../hooks/useRealEditorProps";

export default function StringInput(props: any) {
  const { editorProps } = useRealEditorProps<InputConfig>(props);

  return <Input {...editorProps} />;
}
