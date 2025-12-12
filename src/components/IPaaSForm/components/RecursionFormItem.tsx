import { Form } from "antd";
import { type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { excuteScriptByValidateRules } from "../utils/excuteScript";
import { formValueNormalize, replaceHtmlATagsWithMarkdown } from "../utils";
import { useEditor, useIpaasSchemaStore } from "../store";
import type { IPaasDynamicFormItem } from "../type";
import { useCreation } from "ahooks";

const customLinkRenderer = ({ href, children }: any) => {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const DefaultConfig = {
  placeholder: "请输入",
};

function CommonLayout(node1: ReactNode, node2: ReactNode) {
  return (
    <div className="flex flex-col gap-1">
      {node2}
      {node1}
    </div>
  );
}

function WrapperFieldComponent(props: {
  formItemState: IPaasDynamicFormItem;
  [x: string]: any;
}) {
  const { formItemState, ...otherProps } = props;
  const { type, payload } = props.formItemState;
  const FieldComponent = useEditor(type);
  const { editorLayoutWithDesc } = useIpaasSchemaStore();
  const _config = {
    ...DefaultConfig,
    ...payload.editor.config,
  };

  const _editorLayoutWithDesc = editorLayoutWithDesc || CommonLayout;
  return (
    <div className="relative">
      {_editorLayoutWithDesc(
        // eslint-disable-next-line react-hooks/static-components
        <FieldComponent
          name={payload.code}
          editorkind={payload.editor.kind}
          {...otherProps}
          {..._config}
        />,
        payload.description && (
          <div className="desc text-[#888f9d] text-xs">
            <ReactMarkdown
              components={{
                a: customLinkRenderer,
              }}
            >
              {replaceHtmlATagsWithMarkdown(payload.description)}
            </ReactMarkdown>
          </div>
        )
      )}
    </div>
  );
}

export default function RecursionFormItem({
  formItemState,
}: {
  formItemState: IPaasDynamicFormItem;
}) {
  const { payload, next } = formItemState;
  const { normalize, validatefield } = useIpaasSchemaStore();

  const nextFieldItem = useCreation(() => {
    let current: IPaasDynamicFormItem | null = formItemState;
    if (!next || !current) return null;

    // 获取所有祖先节点
    const acients: IPaasDynamicFormItem[] = [];
    acients.unshift(current);
    while ((current = current.parent)) {
      acients.unshift(current);
    }

    // 递归渲染
    const item = next(formItemState, acients);
    if (!item) return null;
    return <RecursionFormItem formItemState={item} />;
  }, [formItemState]);

  return (
    <>
      <Form.Item
        key={payload.code.toString()}
        label={payload.name}
        name={payload.code}
        required={payload.required}
        rules={[
          (form) => ({
            validator(_, v) {
              function originValidateField(v: any) {
                const { getFieldsValue } = form;
                const formValues = formValueNormalize(
                  getFieldsValue(),
                  normalize
                );
                const value = normalize?.(v);
                return new Promise<void>((r, j) => {
                  let errorMessages = "";
                  // 必填校验
                  if (payload.required) {
                    if (value === undefined || value === null || value === "") {
                      errorMessages = "不能为空";
                    }
                  }

                  if (payload.validateRules) {
                    const [suc, errorMsg = "格式不正确"] =
                      excuteScriptByValidateRules(
                        payload.validateRules,
                        value,
                        formValues
                      );
                    if (!suc) {
                      errorMessages = errorMsg;
                    }
                  }
                  if (errorMessages) {
                    j(new Error(errorMessages));
                  } else {
                    r();
                  }
                });
              }

              return (
                validatefield?.({
                  // @ts-expect-error TODO: fix this
                  form,
                  name: payload.code,
                  value: v,
                  validate: originValidateField,
                }) || originValidateField(v)
              );
            },
          }),
        ]}
      >
        <WrapperFieldComponent formItemState={formItemState} />
      </Form.Item>
      {nextFieldItem}
    </>
  );
}
