/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";

import type { FlowNodeRegistry } from "../../typings";
import iconBreak from "../../assets/icon-break.svg";
import { defaultFormMeta } from "../default-form-meta";

/**
 * Break 节点用于在 loop 中根据条件终止并跳出
 */
export const BreakLoopNodeRegistry: FlowNodeRegistry = {
  type: "breakLoop",
  extend: "end",
  info: {
    name: "中断循环",
    icon: iconBreak,
    description: "退出循环",
  },
  meta: {
    style: {
      width: 240,
    },
  },
  canAdd(ctx, from) {
    while (from.parent) {
      if (from.parent.flowNodeType === "loop") return true;
      from = from.parent;
    }
    return false;
  },
  onAdd(ctx, from) {
    return {
      id: `break_${nanoid()}`,
      type: "breakLoop",
      data: {
        name: "BreakLoop",
        description: "Break in current Loop.",
      },
    };
  },
  formMeta: defaultFormMeta,
};
