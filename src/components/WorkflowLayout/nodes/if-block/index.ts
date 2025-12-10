/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FlowNodeRegistry } from "../../typings";
import iconIf from "../../assets/icon-if.png";
import { defaultFormMeta } from "../default-form-meta";

export const IFBlockNodeRegistry: FlowNodeRegistry = {
  type: "ifBlock",
  /**
   * 分支节点需要继承自 block
   * Branch nodes need to inherit from 'block'
   */
  extend: "block",
  meta: {
    copyDisable: true,
    addDisable: true,
    sidebarDisable: true,
    defaultExpanded: false,
    style: {
      width: 66,
      height: 20,
      borderRadius: 4,
    },
  },
  info: {
    icon: iconIf,
    name: "条件分支",
    description: "条件分支",
  },
  canAdd: () => false,
  canDelete: (ctx, node) => false,
  formMeta: defaultFormMeta,
};
