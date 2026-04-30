import type { ConnectorAction } from "@server/shared/connector";
import classNames from "classnames";

interface TriggerCardProps {
  trigger: ConnectorAction;
  onClick?: (trigger: ConnectorAction) => void;
  isActive?: boolean;
}

export function TriggerCard({ trigger, onClick, isActive }: TriggerCardProps) {
  return (
    <div
      onClick={() => {
        onClick?.(trigger);
      }}
      className={classNames(
        "flex flex-col gap-1 p-3 border border-gray-200 rounded-md hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all",
        {
          "border-blue-400 bg-blue-50": isActive,
        },
      )}
    >
      <div className="font-medium text-sm text-gray-800">{trigger.name}</div>
      {trigger.description && (
        <div className="text-xs text-gray-500 line-clamp-2">
          {trigger.description}
        </div>
      )}
    </div>
  );
}
