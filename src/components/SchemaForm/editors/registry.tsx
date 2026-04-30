import React from "react";
import { Input, InputNumber } from "antd";
import { withDefaultValue } from "../hocs/withDefaultValue";
import StringInput from "./StringInput";
import Textarea from "./Textarea";
import InputWithCopy from "./InputWithCopy";
import RichEditor from "./RichEditor";
import Select from "./Select";
import MultiSelect from "./MultiSelect";
import ObjectEditor from "./ObjectEditor";
import NumberInput from "./NumberInput";
import Switch from "./Switch";
import ArrayEditor from "./ArrayEditor";

/**
 * 默认编辑器注册表
 * key 为 editor.kind 值，value 为对应的 React 组件
 *
 * 需要 defaultValue 支持的组件使用 withDefaultValue HOC 包装
 */
export const defaultEditorRegistry: Record<string, React.ComponentType<any>> = {
  // String
  input: withDefaultValue(StringInput),
  textarea: withDefaultValue(Textarea),
  inputWithCopy: withDefaultValue(InputWithCopy),
  richEditor: RichEditor,

  // Number
  numberInput: withDefaultValue(NumberInput),

  // Boolean
  switch: withDefaultValue(Switch),

  // Select (通用)
  select: Select,

  // Array
  multiSelect: MultiSelect,

  // Object
  objectEditor: ObjectEditor,

  // Array
  arrayEditor: ArrayEditor,
};
