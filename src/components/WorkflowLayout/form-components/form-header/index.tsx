/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { type PropsWithChildren } from "react";
import { useClientContext } from "@flowgram.ai/fixed-layout-editor";
import { Button, Dropdown, Typography } from "antd";
import { DownOutlined, LeftOutlined, MoreOutlined } from "@ant-design/icons";

import type { FlowNodeRegistry } from "../../typings";
import { FlowCommandId } from "../../shortcuts/constants";
import { Header, Operators, Icon } from "./styles";
import { NodeRenderModel, useNodeData } from "../../models/NodeRenderModal";
import { useCreation } from "ahooks";

function DropdownContent(props: PropsWithChildren) {
  const { node, deleteNode } = NodeRenderModel.useModel();
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
      {props.children}
    </Dropdown>
  );
}

export function FormHeader() {
  const { node, expanded, startDrag, toggleExpand, readonly } =
    NodeRenderModel.useModel();

  const { name, icon, description } = useNodeData();
  const handleExpand = (e: React.MouseEvent) => {
    toggleExpand();
    e.stopPropagation(); // Disable clicking prevents the sidebar from opening
  };

  return (
    <Header
      onMouseDown={(e) => {
        // trigger drag node
        startDrag(e);
        e.stopPropagation();
      }}
    >
      {icon ? <Icon src={icon} /> : null}
      <Typography.Text ellipsis={{ tooltip: true }}>{name}</Typography.Text>
      {node.renderData.expandable && (
        <Button
          type="text"
          icon={expanded ? <DownOutlined /> : <LeftOutlined />}
          size="small"
          onClick={handleExpand}
        />
      )}
      {readonly ? undefined : (
        <Operators>
          <DropdownContent>
            <Button size="small" type="text" icon={<MoreOutlined />} />
          </DropdownContent>
        </Operators>
      )}
    </Header>
  );
}
