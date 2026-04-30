import { Input } from "antd";
import type { TextareaConfig } from "../types";
import useRealEditorProps from "../hooks/useRealEditorProps";

const { TextArea } = Input;

export default function Textarea(props: any) {
  const {
    editorProps,
    config: { minRows, maxRows },
  } = useRealEditorProps<TextareaConfig>(props);

  return (
    <TextArea
      autoSize={{
        minRows,
        maxRows,
      }}
      {...editorProps}
    />
  );
}
