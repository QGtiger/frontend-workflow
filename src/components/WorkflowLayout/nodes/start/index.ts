/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FlowNodeRegistry } from "../../typings";
import iconStart from "../../assets/icon-start.jpg";
import { defaultFormMeta } from "../default-form-meta";

export const StartNodeRegistry: FlowNodeRegistry = {
  type: "start",
  meta: {
    isStart: true, // Mark as start
    deleteDisable: true, // Start node cannot delete
    selectable: false, // Start node cannot select
    copyDisable: true, // Start node cannot copy
    expandable: false, // disable expanded
    addDisable: true, // Start Node cannot be added
  },
  info: {
    icon: iconStart,
    name: "开始",
    description: "流程开始节点",
  },
  formMeta: defaultFormMeta,
};
