/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";

import type { FlowNodeRegistry } from "../../typings";
import iconLoop from "../../assets/icon-loop.svg";
import { defaultFormMeta } from "../default-form-meta";

export const LoopNodeRegistry: FlowNodeRegistry = {
  type: "loop",
  info: {
    icon: iconLoop,
    name: "循环",
    description: "重复执行一系列任务，通过设置迭代次数和逻辑",
  },
  meta: {
    expandable: false, // disable expanded
  },
  onAdd() {
    return {
      id: `loop_${nanoid(5)}`,
      type: "loop",
      data: {
        name: "Loop",
      },
    };
  },
  formMeta: defaultFormMeta,
};
