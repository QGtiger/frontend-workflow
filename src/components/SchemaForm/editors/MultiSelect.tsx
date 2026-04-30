import { Select as AntSelect } from "antd";
import type { SelectConfig } from "../types";
import type { CommonEditorProps } from "../editorType";
import useRealEditorProps from "../hooks/useRealEditorProps";

/**
 * MultiSelect 组件 - 纯展示组件
 * 不关心数据源是静态还是动态，由上层通过 options prop 注入
 */
export default function MultiSelect(
  props: CommonEditorProps<any[], SelectConfig>,
) {
  const {
    config: { isDynamic },
    editorProps,
  } = useRealEditorProps(props);

  if (isDynamic) {
    throw new Error("暂不支持动态数据");
  }

  return <AntSelect mode="multiple" allowClear {...editorProps} />;
}
