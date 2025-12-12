import { Form, type FormProps } from "antd";
import type { IPaasFormSchema } from "./type";
import CreateSchemaFormItem from "./components/CreateSchemaFormItem";
import {
  createIpaasSchemaStore,
  type IpaasSchemaStoreConfig,
  type IpaasSchemaStoreType,
  StoreContext,
  useIpaasSchemaStore,
} from "./store";
import { useRef } from "react";
import { formValueNormalize } from "./utils";

function Wrapper({ schema }: { schema: IPaasFormSchema[] }) {
  const { normalize } = useIpaasSchemaStore();
  const values = Form.useWatch([]);

  // normalize 一下
  // {a: {value: 1}} => {a: 1}
  const formValues = formValueNormalize(values, normalize);

  return <CreateSchemaFormItem schema={schema} formValues={formValues} />;
}

export function IpaasSchemaForm(
  props: {
    schema: IPaasFormSchema[];
  } & IpaasSchemaStoreConfig & {
      formProps?: FormProps;
    }
) {
  const { schema, formProps } = props;
  const [form] = Form.useForm();
  const storeRef = useRef<IpaasSchemaStoreType>(null);

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    storeRef.current = createIpaasSchemaStore(props);
  }

  return (
    // eslint-disable-next-line react-hooks/refs
    <StoreContext.Provider value={storeRef.current}>
      <div className="ipaas-schema-form ">
        <Form form={form} layout="vertical" {...formProps}>
          <Wrapper schema={schema} />
        </Form>
      </div>
    </StoreContext.Provider>
  );
}

export * from "./type";

export { useEditor, useIpaasSchemaStore } from "./store";

export { default as CustomInputWithCopy } from "./components/material/CustomInputWithCopy";
