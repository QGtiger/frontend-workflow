/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState, useEffect } from "react";

import {
  usePlayground,
  usePlaygroundTools,
  useRefresh,
} from "@flowgram.ai/fixed-layout-editor";
import { Tooltip, Button } from "antd";
import { UndoOutlined, RedoOutlined } from "@ant-design/icons";

import { ZoomSelect } from "./zoom-select";
import { SwitchVertical } from "./switch-vertical";
import { ToolContainer, ToolSection } from "./styles";
import { Save } from "./save";
// import { Run } from "./run";
import { Readonly } from "./readonly";
import { MinimapSwitch } from "./minimap-switch";
import { Minimap } from "./minimap";
import { FitView } from "./fit-view";
import { Interactive } from "./interactive";

export const DemoTools = () => {
  const tools = usePlaygroundTools();
  const [minimapVisible, setMinimapVisible] = useState(false);
  const playground = usePlayground();
  const refresh = useRefresh();

  useEffect(() => {
    const disposable = playground.config.onReadonlyOrDisabledChange(() =>
      refresh()
    );
    return () => disposable.dispose();
  }, [playground]);

  return (
    <ToolContainer className="fixed-demo-tools">
      <ToolSection>
        <Interactive />
        <SwitchVertical />
        <ZoomSelect />
        <FitView fitView={tools.fitView} />
        <MinimapSwitch
          minimapVisible={minimapVisible}
          setMinimapVisible={setMinimapVisible}
        />
        <Minimap visible={minimapVisible} />
        <Readonly />
        <Tooltip title="Undo">
          <Button
            variant="text"
            icon={<UndoOutlined />}
            disabled={!tools.canUndo || playground.config.readonly}
            onClick={() => tools.undo()}
          />
        </Tooltip>
        <Tooltip title="Redo">
          <Button
            variant="text"
            icon={<RedoOutlined />}
            disabled={!tools.canRedo || playground.config.readonly}
            onClick={() => tools.redo()}
          />
        </Tooltip>
        <Save disabled={playground.config.readonly} />
        {/* <Run /> */}
      </ToolSection>
    </ToolContainer>
  );
};
