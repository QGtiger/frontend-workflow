import { Button, Dropdown } from "antd";
import { useClientContext } from "@flowgram.ai/fixed-layout-editor";
import type { PropsWithChildren } from "react";
import { useCreation } from "ahooks";
import { FlowCommandId } from "@/components/WorkflowLayout/shortcuts/constants";
import { MoreOutlined } from "@ant-design/icons";
import { CustomNodeRenderModel } from "./model";

function DropdownContent({ children }: PropsWithChildren) {
  const {
    nodeRender: { deleteNode },
    node,
    registry,
  } = CustomNodeRenderModel.useModel();

  const clientContext = useClientContext();

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

export function NodeDropdown() {
  const {
    nodeRender: { readonly },
  } = CustomNodeRenderModel.useModel();
  return (
    !readonly && (
      <Dropdown>
        <DropdownContent>
          <Button
            size="small"
            type="text"
            icon={<MoreOutlined rotate={90} />}
          />
        </DropdownContent>
      </Dropdown>
    )
  );
}
