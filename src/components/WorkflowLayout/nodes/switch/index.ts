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
    description:
      "Connect multiple downstream branches. Only the corresponding branch will be executed if the set conditions are met.",
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
