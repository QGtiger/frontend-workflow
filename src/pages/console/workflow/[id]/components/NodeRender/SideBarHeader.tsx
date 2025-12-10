import classNames from "classnames";
import { Input, Typography, type InputProps } from "antd";
import { NodeDropdown } from "./NodeDropdown";
import { CustomNodeRenderModel, useCustomNodeData } from "./model";
import { useState } from "react";

function InputWithOutlined(
  props: InputProps & {
    updateKey: "name" | "description" | "icon";
  }
) {
  const { updateKey } = props;
  const data = useCustomNodeData();
  const finalValue = data[updateKey];
  const [value, setValue] = useState(finalValue);
  const { updateData } = CustomNodeRenderModel.useModel();
  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={() => {
        if (value !== finalValue && value) {
          console.log("updateData", updateKey, value);
          updateData({
            [updateKey]: value,
          });
        } else {
          setValue(finalValue);
        }
      }}
      variant="underlined"
      className={classNames(
        "p-0! transition-all duration-300 bg-transparent! border-b-transparent! focus:border-b-[#aaa8a829]! focus:shadow-xs",
        props.className
      )}
    />
  );
}

export function SideBarHeader() {
  const { name, icon } = useCustomNodeData();
  return (
    <div>
      <div
        className={classNames(
          " flex justify-between items-center w-full rounded-lg p-4 pb-2"
        )}
        style={{
          background: "linear-gradient(#f2f2ff 0%, rgb(251, 251, 251) 100%)",
        }}
      >
        <div className="flex gap-2 items-center flex-1">
          <img src={icon} alt={name} className="w-6 h-6 scale-0.8 rounded-md" />
          <InputWithOutlined
            placeholder="请输入名称"
            className=" font-semibold"
            updateKey="name"
          />
        </div>
        <NodeDropdown />
      </div>
      <div className="px-4">
        <InputWithOutlined
          placeholder="请输入描述"
          className=" text-xs! py-1! -mx-1! px-1!"
          updateKey="description"
        />
      </div>
    </div>
  );
}
