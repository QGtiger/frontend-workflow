import { useEffect, useRef } from "react";

/**
 * 处理 defaultValue 的 hook
 * 在组件首次渲染时，如果 value 为 undefined 且 config 中有 defaultValue，则通过 onChange 设置默认值
 *
 * 使用方式：
 * ```tsx
 * function MyEditor(props) {
 *   useDefaultValue(props);
 *   const displayValue = props.value ?? props.config?.defaultValue;
 *   // 使用 displayValue 渲染
 * }
 * ```
 *
 * @param props 组件的 props，需包含 value、onChange、config（config 中需有 defaultValue）
 */
export function useDefaultValue(props: {
  value?: any;
  onChange?: (value: any) => void;
  config?: { defaultValue?: any };
}) {
  const { value, onChange, config } = props;
  const defaultValue = config?.defaultValue;
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (
      isFirstRender.current &&
      defaultValue !== undefined &&
      value === undefined
    ) {
      console.log("????");
      onChange?.(defaultValue);
      isFirstRender.current = false;
    }
  }, []);
}
