/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";
import { FlowNodeSplitType } from "@flowgram.ai/fixed-layout-editor";

import type { FlowNodeRegistry } from "../../typings";
import iconCondition from "../../assets/icon-condition.svg";
import { defaultFormMeta } from "../default-form-meta";

export const SwitchNodeRegistry: FlowNodeRegistry = {
  extend: FlowNodeSplitType.DYNAMIC_SPLIT,
  type: "switch",
  info: {
    icon: iconCondition,
    name: "多分支",
    description: "连接多个下游分支，当设定的条件满足时，相应的分支才会被执行。",
  },
  meta: {
    expandable: false, // disable expanded
  },
  onAdd() {
    return {
      id: `switch_${nanoid(5)}`,
      type: "switch",
      data: {
        name: "Switch",
      },
      blocks: [
        {
          id: nanoid(5),
          type: "case",
          data: {
            name: "Case_0",
          },
          blocks: [],
        },
        {
          id: nanoid(5),
          type: "case",
          data: {
            name: "Case_1",
          },
        },
        {
          id: nanoid(5),
          type: "caseDefault",
          data: {
            name: "Default",
          },
          blocks: [],
        },
      ],
    };
  },
  formMeta: defaultFormMeta,
};
