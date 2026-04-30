import React from "react";
import { useDefaultValue } from "../hooks/useDefaultValue";

/**
 * 高阶组件：自动处理 defaultValue
 *
 * 包装编辑器组件，自动处理以下逻辑：
 * 1. 首次渲染时，如果 value 为 undefined 且 config 中有 defaultValue，通过 onChange 同步到 Form
 * 2. 渲染时使用 value ?? config.defaultValue 作为显示值
 *
 * 使用方式：
 * ```tsx
 * const StringInput = withDefaultValue((props) => {
 *   const { value, onChange, config, ...rest } = props;
 *   return <Input value={value} onChange={...} />;
 * });
 * ```
 */
export function withDefaultValue<
  P extends {
    value?: any;
    onChange?: (value: any) => void;
    config?: { defaultValue?: any };
  },
>(WrappedComponent: React.ComponentType<P>): React.ComponentType<P> {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || "Component";

  const ComponentWithDefaultValue = (props: P) => {
    useDefaultValue(props);

    const displayValue =
      props.value !== undefined ? props.value : props.config?.defaultValue;

    const newProps = {
      ...props,
      value: displayValue,
    } as P;

    return <WrappedComponent {...newProps} />;
  };

  ComponentWithDefaultValue.displayName = `withDefaultValue(${displayName})`;

  return ComponentWithDefaultValue;
}
