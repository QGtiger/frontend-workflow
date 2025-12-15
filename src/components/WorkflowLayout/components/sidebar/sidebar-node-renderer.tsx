/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import {
  useNodeRender,
  FlowNodeEntity,
} from "@flowgram.ai/fixed-layout-editor";

import { NodeRenderModel } from "../../models/NodeRenderModal";
import { useMemo } from "react";

export function SidebarNodeRenderer(props: { node: FlowNodeEntity }) {
  const { node } = props;
  const nodeRender = useNodeRender(node);

  const nodeRenderProviderValue = useMemo(() => {
    return {
      ...nodeRender,
      isSideBar: true,
    };
  }, [nodeRender]);

  return (
    <NodeRenderModel.Provider value={nodeRenderProviderValue}>
      <div
        style={{
          background: "rgb(251, 251, 251)",
          height: "100%",
          borderRadius: 8,
          border: "1px solid rgba(82,100,154, 0.13)",
          boxSizing: "border-box",
        }}
      >
        {nodeRender.form?.render()}
      </div>
    </NodeRenderModel.Provider>
  );
}
