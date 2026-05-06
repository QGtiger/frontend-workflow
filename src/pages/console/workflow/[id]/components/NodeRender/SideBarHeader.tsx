import classNames from "classnames";
import { Button, Divider, Input, Typography, type InputProps } from "antd";
import { NodeDropdown } from "./NodeDropdown";
import { CustomNodeRenderModel, useCustomNodeData } from "./model";
import { useState } from "react";
import { WorkflowDetailModel } from "../../models";
import { trarverseNodes } from "../../models/utils";
import { useClientContext } from "@flowgram.ai/fixed-layout-editor";
import { NodeSelectModel } from "../../nodeSelectModel";
import { BookOutlined, CloseOutlined } from "@ant-design/icons";

function InputWithOutlined(
  props: InputProps & {
    updateKey: "name" | "description" | "icon";
  },
) {
  const { updateKey, ...inputProps } = props;
  const data = useCustomNodeData();
  const finalValue = data[updateKey];
  const [value, setValue] = useState(finalValue);
  const { updateData, node } = CustomNodeRenderModel.useModel();
  const { getUniqueName } = WorkflowDetailModel.useModel();

  const { operation } = useClientContext();

  return (
    <Input
      {...inputProps}
      variant="borderless"
      value={value}
      onChange={(e) => {
        setValue(e.target.value);
      }}
      onBlur={() => {
        const fv = value.trim();
        if (fv !== finalValue && fv) {
          const uniqueName = getUniqueName(fv);
          updateData({
            [updateKey]: uniqueName,
          });

          trarverseNodes(node.document.toJSON().nodes, (n) => {
            const _inputs = n.data.inputs;
            if (_inputs) {
              const updatedInputs = JSON.parse(
                JSON.stringify(_inputs)
                  .replaceAll(`$("${finalValue}")`, `$("${uniqueName}")`)
                  .replaceAll(`$('${finalValue}')`, `$('${uniqueName}')`),
              );

              // 通过 operation 服务更新
              operation.setFormValue(n.id, "inputs", updatedInputs);
            }
            return false;
          });

          setValue(uniqueName);
        } else {
          setValue(finalValue);
        }
      }}
      className={classNames(
        "-mx-1 !p-0 !px-1 transition-all duration-300  focus:ring-1 ring-blue-300 !rounded-[2px]",
        props.className,
      )}
    />
  );
}

export function SideBarHeader() {
  const { name, icon } = useCustomNodeData();
  const { closePanel } = NodeSelectModel.useModel();
  return (
    <div>
      <div
        className={classNames(
          " flex justify-between items-center w-full p-4 pb-2 gap-2",
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
        <div className="flex items-center">
          <Button
            onClick={closePanel}
            className=" text-gray-600 text-xs"
            size="small"
            type="text"
            icon={<BookOutlined />}
          />
          <NodeDropdown />
          <Divider type="vertical" />
          <Button
            onClick={closePanel}
            className=" text-gray-600 text-xs"
            size="small"
            type="text"
            icon={<CloseOutlined />}
          />
        </div>
      </div>
      <div className="px-4">
        <InputWithOutlined
          placeholder="请输入描述"
          className="!text-xs !py-1 !-mx-1 !px-1"
          updateKey="description"
        />
      </div>
    </div>
  );
}
