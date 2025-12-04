/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";

import { usePlaygroundTools } from "@flowgram.ai/fixed-layout-editor";
import { Dropdown } from "antd";

import { SelectZoom } from "./styles.tsx";

export const ZoomSelect = () => {
  const tools = usePlaygroundTools({ maxZoom: 2, minZoom: 0.25 });
  const [dropDownVisible, openDropDown] = useState(false);
  return (
    <Dropdown
      trigger={["click"]}
      open={dropDownVisible}
      onOpenChange={openDropDown}
      menu={{
        items: [
          {
            key: "zoomin",
            label: "Zoomin",
            onClick: () => tools.zoomin(),
          },
          {
            key: "zoomout",
            label: "Zoomout",
            onClick: () => tools.zoomout(),
          },
          {
            key: "50%",
            label: "50%",
            onClick: () => tools.updateZoom(0.5),
          },
          {
            key: "100%",
            label: "100%",
            onClick: () => tools.updateZoom(1),
          },
          {
            key: "150%",
            label: "150%",
            onClick: () => tools.updateZoom(1.5),
          },
          {
            key: "200%",
            label: "200%",
            onClick: () => tools.updateZoom(2),
          },
        ],
      }}
    >
      <SelectZoom onClick={() => openDropDown(true)}>
        {Math.floor(tools.zoom * 100)}%
      </SelectZoom>
    </Dropdown>
  );
};
