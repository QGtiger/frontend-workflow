import type { SchemaFormItemType } from "./types";

export type CommonEditorProps<T, C = any> = {
  value?: T;
  onChange?: (value: any) => void;
  config: C;
  schema: SchemaFormItemType;
};
