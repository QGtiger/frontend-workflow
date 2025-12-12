import classNames from "classnames";
import { CustomNodeRenderModel, useCustomNodeData } from "./model";
import { Typography } from "antd";
import { NodeDropdown } from "./NodeDropdown";

export function CustomNode() {
  const {
    nodeRender: { startDrag },
  } = CustomNodeRenderModel.useModel();
  const { name, description, icon } = useCustomNodeData();
  return (
    <div className=" w-full">
      <div
        onMouseDown={(e) => {
          startDrag(e);
          e.stopPropagation();
        }}
        className={classNames(
          " flex justify-between items-center w-full rounded-lg p-2 cursor-move overflow-hidden"
        )}
        style={{
          background: "linear-gradient(#f2f2ff 0%, rgb(251, 251, 251) 100%)",
        }}
      >
        <div className="flex gap-2 items-center flex-1 overflow-hidden">
          <img src={icon} alt={name} className="w-6 h-6 scale-0.8 rounded-md" />
          <Typography.Text ellipsis={{ tooltip: true }}>{name}</Typography.Text>
        </div>
        <NodeDropdown />
      </div>
      <div className="p-2">
        <Typography.Paragraph
          ellipsis={{
            rows: 2,
            expandable: "collapsible",
            tooltip: true,
          }}
          className=" text-xs! text-gray-500! mb-0! leading-[18px]"
        >
          {description}
        </Typography.Paragraph>
      </div>
    </div>
  );
}
