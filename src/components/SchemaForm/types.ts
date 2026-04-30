// ============================================================
// SchemaForm 类型定义
// ============================================================

import type { SchemaFormItemType } from "@server/shared/schemaFormType";
import type { SchemaFormContextValue } from "./context";
export * from "@server/shared/schemaFormType";

// ============================================================
// SchemaForm 组件 Props 类型
// ============================================================

/**
 * 简化交叉类型显示（可选，让结果更直观）
 */
type Simplify<T> = { [P in keyof T]: T[P] };

/**
 * 将类型 T 中的指定键 K 变为可选
 * @example
 * type Person = { name: string; age: number; address: string };
 * type PartialPerson = PartialByKeys<Person, 'name' | 'age'>;
 * // 结果: { name?: string; age?: number; address: string }
 */
type PartialByKeys<T, K extends keyof T = keyof T> = Simplify<
  Omit<T, K> & Partial<Pick<T, K>>
>;

export interface SchemaFormProps extends PartialByKeys<
  SchemaFormContextValue,
  "dynamicDebounce" | "editorLayout" | "normalize" | "editors"
> {
  /** 表单 schema 定义 */
  schema: SchemaFormItemType[];
  /** 表单初始值 */
  initialValues?: Record<string, any>;
  /** 值变化回调 */
  onValuesChange?: (
    changedValues: Record<string, any>,
    allValues: Record<string, any>,
  ) => void;
}
