// ============================================================
// SchemaForm 类型定义
// ============================================================

// 公共基础字段
export interface BaseSchemaFormItem {
  /** 表单项唯一标识 */
  code: string;
  /** 显示名称 */
  name: string;
  /** 描述说明 */
  description?: string;
  /** 对应类型 */
  type: "string" | "number" | "boolean" | "object" | "array";

  /** 是否可见 */
  visible?: boolean;
  /** 显示规则，是一段表达式  code === '22' */
  visibleRules?: string;

  /** 是否必填 */
  required?: boolean;
  /** 校验规则，是一段js 脚本 function main(value, formValue) {//...} */
  validateRules?: string;

  // 编辑器类型 all 是既可以表达式，也是基础 ， 默认是all
  editorType?: "expression" | "base";
}

interface CommonEditorConfig {
  placeholder?: string;
}

// ============================================================
// Select 配置（通用）
// ============================================================
export interface SelectConfig extends CommonEditorConfig {
  /** 是否是动态的 */
  isDynamic: boolean;
  /** 静态数据源 */
  options?: Array<{ value: any; label: string }>;
  /** 动态数据源 */
  dynamicScript?: string;
  /** 依赖项，当依赖项修改，重新调用动态数据源 */
  depItems: string[];
}

// ============================================================
// String 类型编辑器
// ============================================================
export interface CommonStringInputConfig {
  placeholder?: string;
  defaultValue?: string;
}

export type InputConfig = CommonStringInputConfig;

export interface TextareaConfig extends CommonStringInputConfig {
  minRows?: number;
  maxRows?: number;
}

export interface InputWithCopyConfig {
  copyText?: string;
  btnText?: string;
}

export interface RichEditorConfig {
  content: string;
}

export type StringEditorType =
  | { kind: "input"; config: InputConfig }
  | { kind: "textarea"; config: TextareaConfig }
  | { kind: "inputWithCopy"; config: InputWithCopyConfig }
  | { kind: "richEditor"; config: RichEditorConfig }
  | { kind: "select"; config: SelectConfig };

export interface StringSchemaFormItem extends BaseSchemaFormItem {
  type: "string";
  editor: StringEditorType;
}

// ============================================================
// Number 类型编辑器
// ============================================================
export interface CommonNumberInputConfig {
  placeholder?: string;
  defaultValue?: number;
}

export interface NumberInputConfig extends CommonNumberInputConfig {
  min?: number;
  max?: number;
}

export type NumberEditorType =
  | { kind: "numberInput"; config: NumberInputConfig }
  | { kind: "select"; config: SelectConfig };

export interface NumberSchemaFormItem extends BaseSchemaFormItem {
  type: "number";
  editor: NumberEditorType;
}

// ============================================================
// Boolean 类型编辑器
// ============================================================
export interface BooleanEditorType {
  kind: "switch";
  config?: { defaultValue?: boolean };
}

export interface BooleanSchemaFormItem extends BaseSchemaFormItem {
  type: "boolean";
  editor: BooleanEditorType;
}

// ============================================================
// Object 类型编辑器
// ============================================================
export interface ObjectEditorType {
  kind: "objectEditor";
  config: {
    isDynamic: boolean;
    /** 动态数据源 function main(value, formValue) {//...}  return SchemaFormItemType[] */
    dynamicScript?: string;
    /** 依赖项，当依赖项修改，重新调用动态数据源 */
    depItems: string[];
    /** 对象的属性定义 */
    properties: SchemaFormItemType[];
  };
}

export interface ObjectSchemaFormItem extends BaseSchemaFormItem {
  type: "object";
  editor: ObjectEditorType;
}

// ============================================================
// Array 类型编辑器
// ============================================================

export type ArrayEditorType =
  | { kind: "multiSelect"; config: SelectConfig }
  // 这里 item 为数组元素定义 里面的  code 会被后续 数据的 index 取代
  | { kind: "arrayEditor"; config: { item: SchemaFormItemType } };

export interface ArraySchemaFormItem extends BaseSchemaFormItem {
  type: "array";
  editor: ArrayEditorType;
}

// ============================================================
// 联合类型
// ============================================================
export type SchemaFormItemType =
  | StringSchemaFormItem
  | NumberSchemaFormItem
  | BooleanSchemaFormItem
  | ObjectSchemaFormItem
  | ArraySchemaFormItem;
