// @ts-nocheck

import type { CommonEditorProps } from "../editorType";

export default function useRealEditorProps<T>(
  props: CommonEditorProps<any, T>,
) {
  const { config, schema, ...rest } = props;

  // 处理一些不能给 真实输入应用的，别的都给输入组件
  const {
    // @ts-expect-error 尝试解析，错误也没事
    isDynamic,
    // @ts-expect-error 尝试解析，错误也没事
    dynamicScript,
    // @ts-expect-error 尝试解析，错误也没事
    depItems,
    // @ts-expect-error 尝试解析，错误也没事
    properties,
    maxRows,
    minRows,
    copyText,
    ...otherEditorProps
  } = config;

  return {
    config,
    schema,
    editorProps: {
      placeholder: "请输入",
      ...rest,
      ...otherEditorProps,
    },
  };
}
