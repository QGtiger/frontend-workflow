import type {
  FormMeta,
  FormRenderProps,
} from "@flowgram.ai/fixed-layout-editor";
import type { FlowNodeJSON } from "../typings";
import { FormHeader } from "../form-components/form-header";

const renderForm = ({ form }: FormRenderProps<FlowNodeJSON["data"]>) => (
  <>
    <FormHeader />
  </>
);

export const defaultFormMeta: FormMeta<FlowNodeJSON["data"]> = {
  render: renderForm,
};
