/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";

import type { FlowNodeRegistry } from "../../typings";
import iconCase from "../../assets/icon-case.png";
import { defaultFormMeta } from "../default-form-meta";

let id = 2;
export const CaseNodeRegistry: FlowNodeRegistry = {
  type: "case",
  /**
   * 分支节点需要继承自 block
   * Branch nodes need to inherit from 'block'
   */
  extend: "block",
  meta: {
    copyDisable: true,
    addDisable: true,
  },
  info: {
    name: "分支",
    icon: iconCase,
    description: "当条件满足时执行分支",
  },
  canDelete: (ctx, node) => node.parent!.blocks.length >= 3,
  onAdd(ctx, from) {
    return {
      id: `Case_${nanoid(5)}`,
      type: "case",
      data: {
        name: `Case_${id++}`,
        description: "Execute the branch when the condition is met.",
      },
    };
  },
  formMeta: defaultFormMeta,
};
