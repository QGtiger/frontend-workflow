/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Tooltip, Button } from "antd";
import { TableOutlined } from "@ant-design/icons";

export const MinimapSwitch = (props: {
  minimapVisible: boolean;
  setMinimapVisible: (visible: boolean) => void;
}) => {
  const { minimapVisible, setMinimapVisible } = props;

  return (
    <Tooltip title="Minimap">
      <Button
        variant="text"
        icon={
          <TableOutlined
            style={{
              color: minimapVisible ? undefined : "#060709cc",
            }}
          />
        }
        onClick={() => {
          setMinimapVisible(Boolean(!minimapVisible));
        }}
      />
    </Tooltip>
  );
};
