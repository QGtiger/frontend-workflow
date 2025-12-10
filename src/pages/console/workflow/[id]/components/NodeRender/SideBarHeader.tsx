import classNames from "classnames";
import { Typography } from "antd";
import { NodeDropdown } from "./NodeDropdown";
import { useCustomNodeData } from "./model";

export function SideBarHeader() {
  const { name, icon } = useCustomNodeData();
  return (
    <div
      className={classNames(
        " flex justify-between items-center w-full rounded-lg  overflow-hidden p-4"
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
  );
}
