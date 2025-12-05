/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";

import type { FlowNodeRegistry } from "../../typings";
import iconCase from "../../assets/icon-case.png";

let id = 3;
export const CatchBlockNodeRegistry: FlowNodeRegistry = {
  type: "catchBlock",
  meta: {
    copyDisable: true,
    addDisable: true,
  },
  info: {
    icon: iconCase,
    description: "Execute the catch branch when the condition is met.",
  },
  canAdd: () => false,
  canDelete: (ctx, node) => node.parent!.blocks.length >= 2,
  onAdd(ctx, from) {
    return {
      id: `Catch_${nanoid(5)}`,
      type: "catchBlock",
      data: {
        name: `Catch Block ${id++}`,
        description: "Execute the catch branch when the condition is met.",
      },
    };
  },
};
