import { Alert } from "antd";
import ReactMarkdown from "react-markdown";
import type { RichEditorConfig } from "../types";

interface RichEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  config: RichEditorConfig;
}

/**
 * 富文本编辑器 - 使用 markdown 渲染 + Banner 展示
 * config.content 为 markdown 内容
 */
export default function RichEditor(props: RichEditorProps) {
  const { config } = props;
  return (
    <Alert
      type="info"
      message={<ReactMarkdown>{config.content || ""}</ReactMarkdown>}
      showIcon
    />
  );
}
