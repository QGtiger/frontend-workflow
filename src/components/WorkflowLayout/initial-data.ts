/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FlowDocumentJSON } from "./typings";

export const initialData: FlowDocumentJSON = {
  nodes: [
    {
      id: "start_0",
      type: "start",
      blocks: [],
      data: {
        name: "Start",
      },
    },
    {
      id: "switch_0",
      type: "switch",
      data: {
        name: "Switch",
      },
      blocks: [
        {
          id: "case_0",
          type: "case",
          data: {
            name: "Case_0",
          },
          blocks: [],
        },
        {
          id: "case_1",
          type: "case",
          data: {
            name: "Case_1",
          },
        },
        {
          id: "case_default_1",
          type: "caseDefault",
          data: {
            name: "Default",
          },
          blocks: [],
        },
      ],
    },
    {
      id: "loop_0",
      type: "loop",
      data: {
        name: "Loop",
      },
      blocks: [
        {
          id: "if_0",
          type: "if",
          data: {
            name: "If",
          },
          blocks: [
            {
              id: "if_true",
              type: "ifBlock",
              data: {
                name: "true",
              },
              blocks: [],
            },
            {
              id: "if_false",
              type: "ifBlock",
              data: {
                name: "false",
              },
              blocks: [
                {
                  id: "break_0",
                  type: "breakLoop",
                  data: {
                    name: "BreakLoop",
                  },
                },
              ],
            },
          ],
        },
      ],
    },
    {
      id: "tryCatch_0",
      type: "tryCatch",
      data: {
        name: "TryCatch",
      },
      blocks: [
        {
          id: "tryBlock_0",
          type: "tryBlock",
          blocks: [],
        },
        {
          id: "catchBlock_0",
          type: "catchBlock",
          data: {
            name: "Catch Block 1",
          },
          blocks: [],
        },
        {
          id: "catchBlock_1",
          type: "catchBlock",
          data: {
            name: "Catch Block 2",
          },
          blocks: [],
        },
      ],
    },
    {
      id: "end_0",
      type: "end",
      blocks: [],
      data: {
        name: "End",
      },
    },
  ],
};
