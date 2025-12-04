/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { Button, Tooltip } from "antd";
import { ExpandOutlined } from "@ant-design/icons";

export const FitView = (props: { fitView: () => void }) => (
  <Tooltip title="FitView">
    <Button icon={<ExpandOutlined />} onClick={() => props.fitView()} />
  </Tooltip>
);
