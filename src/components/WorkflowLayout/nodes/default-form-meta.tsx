import type {
  FormMeta,
  FormRenderProps,
} from "@flowgram.ai/fixed-layout-editor";
import type { FlowNodeJSON } from "../typings";
import { FormHeader } from "../form-components/form-header";
import { FormContent } from "../form-components/form-content";

const renderForm = ({ form }: FormRenderProps<FlowNodeJSON["data"]>) => (
  <>
    <FormHeader />
    <FormContent />
  </>
);

export const defaultFormMeta: FormMeta<FlowNodeJSON["data"]> = {
  render: renderForm,
};
