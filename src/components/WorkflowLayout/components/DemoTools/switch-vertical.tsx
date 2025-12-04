/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { usePlaygroundTools } from "@flowgram.ai/fixed-layout-editor";
import { Button, Tooltip } from "antd";
import { VerticalAlignBottomOutlined } from "@ant-design/icons";

export const SwitchVertical = () => {
  const tools = usePlaygroundTools();
  return (
    <Tooltip
      title={!tools.isVertical ? "Vertical Layout" : "Horizontal Layout"}
    >
      <Button
        type="text"
        size="small"
        onClick={() => tools.changeLayout()}
        icon={
          <VerticalAlignBottomOutlined
            style={{
              transform: !tools.isVertical ? "" : "rotate(90deg)",
              transition: "transform .3s ease",
            }}
          />
        }
        variant="text"
      />
    </Tooltip>
  );
};
