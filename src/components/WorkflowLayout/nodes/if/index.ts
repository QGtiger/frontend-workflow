/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";
import { FlowNodeSplitType } from "@flowgram.ai/fixed-layout-editor";

import type { FlowNodeRegistry } from "../../typings";
import iconIf from "../../assets/icon-if.png";
import { defaultFormMeta } from "../default-form-meta";

export const IFNodeRegistry: FlowNodeRegistry = {
  extend: FlowNodeSplitType.STATIC_SPLIT,
  type: "if",
  info: {
    icon: iconIf,
    description:
      "Only the corresponding branch will be executed if the set conditions are met.",
  },
  meta: {
    expandable: false, // disable expanded
  },
  onAdd() {
    return {
      id: `if_${nanoid(5)}`,
      type: "if",
      data: {
        name: "If",
      },
      blocks: [
        {
          id: nanoid(5),
          type: "ifBlock",
          data: {
            name: "true",
          },
          blocks: [],
        },
        {
          id: nanoid(5),
          type: "ifBlock",
          data: {
            name: "false",
          },
        },
      ],
    };
  },
  formMeta: defaultFormMeta,
};
