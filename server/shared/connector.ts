import { SchemaFormItemType } from "./schemaFormType";

interface OutputStructItem {
  code: string;
  type: string;
  label: string;
  children?: OutputStructItem[];
}

interface ConnectorAction {
  code: string;
  name: string;
  description: string;
  inputsSchema: SchemaFormItemType[];
  outputsSchema: OutputStructItem[];
}

interface Connector {
  code: string;
  name: string;
  description: string;
  icon: string;
  version: number;
  actions: ConnectorAction[];
}
