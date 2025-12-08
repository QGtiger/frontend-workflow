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
    description:
      "Used to repeatedly execute a series of tasks by setting the number of iterations and logic",
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
