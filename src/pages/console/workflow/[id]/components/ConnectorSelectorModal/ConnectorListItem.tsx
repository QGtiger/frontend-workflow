import type { FlowNodeRegistry } from "@/components/WorkflowLayout/typings";

export interface ConnectorItem {
  code: string;
  name: string;
  description: string;
  icon: string;
  category: "built-in" | "app";
  registry?: FlowNodeRegistry;
  version?: number;
}

// 连接器列表项组件
export function ConnectorListItem({
  connector,
  isSelected,
  onClick,
}: {
  connector: ConnectorItem;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full cursor-pointer flex items-center gap-3 p-3 rounded-lg text-left transition-all mb-1 ${
        isSelected
          ? "bg-[#f6f6f6] border border-gray-200 shadow-sm"
          : "hover:bg-[#f9f9f9] border border-transparent"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-md flex items-center justify-center shrink-0 ${
          connector.category === "built-in" ? "bg-blue-50" : "bg-purple-50"
        }`}
      >
        <img
          src={connector.icon}
          alt={connector.name}
          className="w-5 h-5 object-contain"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-gray-900 mb-0.5 truncate">
          {connector.name}
        </div>
        <div className="text-xs text-gray-500 line-clamp-1">
          {connector.description}
        </div>
      </div>
      {/* <RightOutlined
        className={classNames("text-gray-400 shrink-0 text-xs", {
          "opacity-0": !isSelected,
        })}
      /> */}
    </button>
  );
}
