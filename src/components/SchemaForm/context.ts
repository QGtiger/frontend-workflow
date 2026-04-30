import React, { createContext, useContext } from "react";
import type { SchemaFormItemType } from "./types";
import type { CommonEditorProps } from "./editorType";

export interface SchemaFormContextValue {
  /** 自定义编辑器组件映射，key 为 kind 值 */
  editors: Record<string, React.ComponentType<CommonEditorProps<any, any>>>;
  /** 动态脚本执行函数 - 用于获取 Select options */
  dynamicScriptExcute?: (config: {
    script: string;
    extParams: Record<string, any>;
  }) => Promise<{ value: any; label: any }[]>;
  /** 动态脚本执行函数 - 用于获取动态表单 schema */
  dynamicScriptExcuteWithFormSchema?: (config: {
    script: string;
  }) => Promise<SchemaFormItemType[]>;
  /** 值规范化函数 */
  normalize: (value: any) => any;
  /** 自定义校验函数 */
  validatefield?: (cfg: {
    form: any;
    name: string | string[];
    value: any;
    validate: (v: any) => Promise<void>;
  }) => Promise<void>;
  /** 编辑器布局包装器（带描述） */
  editorLayout: (opt: {
    editor: React.ReactNode;
    desc: React.ReactNode;
    title: React.ReactNode;
  }) => React.ReactNode;
  /** 自定义渲染编辑器 */
  renderEditor?: (opts: {
    schema: SchemaFormItemType;
    form: any;
    Fc: React.ComponentType<any>;
    props: any;
  }) => React.ReactNode;
  /** 动态请求防抖时间 */
  dynamicDebounce: number;
}

export const SchemaFormContext = createContext<SchemaFormContextValue>(
  {} as SchemaFormContextValue,
);

export function useSchemaFormContext() {
  return useContext(SchemaFormContext);
}
