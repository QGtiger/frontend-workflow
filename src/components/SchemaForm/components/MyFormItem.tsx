import { Form, type FormItemProps } from "antd";
import type { FormListProps } from "antd/es/form";
import React from "react";

const MyFormItemContext = React.createContext<(string | number)[]>([]);

interface MyFormItemGroupProps {
  prefix: string | number | (string | number)[];
}

function toArr(
  str: string | number | (string | number)[],
): (string | number)[] {
  return Array.isArray(str) ? str : [str];
}

export const MyFormItemGroup: React.FC<
  React.PropsWithChildren<MyFormItemGroupProps>
> = ({ prefix, children }) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatPath = React.useMemo(
    () => [...prefixPath, ...toArr(prefix)],
    [prefixPath, prefix],
  );

  return (
    <MyFormItemContext.Provider value={concatPath}>
      {children}
    </MyFormItemContext.Provider>
  );
};

export const MyFormItem = ({ name, ...props }: FormItemProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.Item name={concatName} {...props} />;
};

export const MyFormList = ({ name, ...props }: FormListProps) => {
  const prefixPath = React.useContext(MyFormItemContext);
  const concatName =
    name !== undefined ? [...prefixPath, ...toArr(name)] : undefined;

  return <Form.List name={concatName || []} {...props} />;
};
