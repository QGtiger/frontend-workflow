import type { SchemaFormItemType } from "./schemaFormType";

export interface OutputStructItem {
  code: string;
  type: string;
  label: string;
  children?: OutputStructItem[];
}

export interface ConnectorAction {
  code: string;
  name: string;
  description: string;
  inputsSchema: SchemaFormItemType[];
  outputsSchema: OutputStructItem[];
}

export interface Connector {
  code: string;
  name: string;
  description: string;
  icon: string;
  version: string;
  actions?: ConnectorAction[];
  triggers?: ConnectorAction[];
}
