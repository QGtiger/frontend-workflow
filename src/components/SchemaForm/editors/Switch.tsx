import { Switch as AntdSwitch } from "antd";
import useRealEditorProps from "../hooks/useRealEditorProps";

/**
 * Switch 包装组件
 * 防止被父容器拉伸为 block
 */
export default function Switch(props: any) {
  const { editorProps } = useRealEditorProps(props);

  return (
    <span style={{ display: "inline-block" }}>
      <AntdSwitch {...editorProps} />
    </span>
  );
}
