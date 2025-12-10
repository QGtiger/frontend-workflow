import {
  FlowNodeRegistry,
  useClientContext,
  useNodeRender,
} from "@flowgram.ai/fixed-layout-editor";
import type { WithNodeProps } from "./type";
import { useCustomNodeData } from "./hooks";
import classNames from "classnames";
import { Button, Dropdown, Typography } from "antd";
import { FlowCommandId } from "@/components/WorkflowLayout/shortcuts/constants";
import type { PropsWithChildren } from "react";
import { useCreation } from "ahooks";
import { MoreOutlined } from "@ant-design/icons";

function DropdownContent({ node, children }: PropsWithChildren<WithNodeProps>) {
  const { deleteNode } = useNodeRender(node);
  const clientContext = useClientContext();
  const registry = node.getNodeRegistry<FlowNodeRegistry>();

  const deleteDisabled = useCreation(() => {
    if (registry.canDelete) {
      return !registry.canDelete(clientContext, node);
    }
    return registry.meta!.deleteDisable;
  }, [registry, node]);

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "copy",
            label: "Copy",
            onClick: () => {
              clientContext.playground.commandService.executeCommand(
                FlowCommandId.COPY,
                node
              );
            },
            disabled: registry.meta!.copyDisable === true,
          },
          {
            key: "delete",
            label: "Delete",
            onClick: deleteNode,
            disabled: deleteDisabled,
          },
        ],
      }}
    >
      {children}
    </Dropdown>
  );
}

export function CustomNodeHeader({ node }: WithNodeProps) {
  const { startDrag, readonly } = useNodeRender(node);
  const { name, description, icon } = useCustomNodeData(node);
  return (
    <div
      onMouseDown={(e) => {
        startDrag(e);
        e.stopPropagation();
      }}
      className={classNames(
        " flex justify-between items-center w-full rounded-t-lg p-2 cursor-move overflow-hidden"
      )}
      style={{
        background: "linear-gradient(#f2f2ff 0%, rgb(251, 251, 251) 100%)",
      }}
    >
      <div className="flex gap-2 items-center flex-1">
        <img src={icon} alt={name} className="w-6 h-6 scale-0.8 rounded-md" />
        <Typography.Text ellipsis={{ tooltip: true }}>{name}</Typography.Text>
      </div>
      {readonly ? undefined : (
        <Dropdown>
          <DropdownContent node={node}>
            <Button
              size="small"
              type="text"
              icon={<MoreOutlined rotate={90} />}
            />
          </DropdownContent>
        </Dropdown>
      )}
    </div>
  );
}
