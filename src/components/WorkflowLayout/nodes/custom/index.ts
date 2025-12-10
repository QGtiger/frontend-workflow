/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import type { FlowNodeRegistry } from "../../typings";
import { defaultFormMeta } from "../default-form-meta";

export const CustomNodeRegistry: FlowNodeRegistry = {
  type: "custom",

  meta: {
    addDisable: true,
  },
  info: {
    icon: "",
    name: "自定义连接器(空节点)",
    description: "自定义连接器(空节点)描述",
  },
  formMeta: defaultFormMeta,
};
