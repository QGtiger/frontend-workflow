/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";

import type { FlowNodeRegistry } from "../../typings";
import iconTryCatch from "../../assets/icon-trycatch.svg";
import { defaultFormMeta } from "../default-form-meta";

export const TryCatchNodeRegistry: FlowNodeRegistry = {
  type: "tryCatch",
  info: {
    icon: iconTryCatch,
    name: "异常捕获",
    description: "捕获异常并执行相应的处理分支",
  },
  meta: {
    expandable: false, // disable expanded
  },
  onAdd() {
    return {
      id: `tryCatch${nanoid(5)}`,
      type: "tryCatch",
      data: {
        name: "TryCatch",
      },
      blocks: [
        {
          id: `tryBlock${nanoid(5)}`,
          type: "tryBlock",
          blocks: [],
        },
        {
          id: `catchBlock${nanoid(5)}`,
          type: "catchBlock",
          blocks: [],
          data: {
            name: "Catch Block 1",
          },
        },
      ],
    };
  },
  formMeta: defaultFormMeta,
};
