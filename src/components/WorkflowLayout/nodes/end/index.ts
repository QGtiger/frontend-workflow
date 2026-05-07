/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { nanoid } from "nanoid";
import { FlowNodeBaseType } from "@flowgram.ai/fixed-layout-editor";

import type { FlowNodeRegistry } from "../../typings";
import iconEnd from "../../assets/icon-end.jpg";
import { defaultFormMeta } from "../default-form-meta";

export const EndNodeRegistry: FlowNodeRegistry = {
  type: "end",
  meta: {
    isNodeEnd: true, // Mark as end
    selectable: false, // End node cannot select
    copyDisable: true, // End node canot copy
    expandable: false, // disable expanded
  },
  info: {
    icon: iconEnd,
    name: "结束",
    description: "工作流的最终节点，用于在工作流运行结束后返回结果信息。",
  },
  canAdd(ctx, from) {
    // You can only add to the last node of the branch
    if (!from.isLast) return false;
    /**
     * condition
     *  blockIcon
     *  inlineBlocks
     *    block1
     *      blockOrderIcon
     *      <---- [add end]
     *    block2
     *      blockOrderIcon
     *      end
     */
    // originParent can determine whether it is condition , and then determine whether it is the last one
    // https://github.com/bytedance/flowgram.ai/pull/146
    if (
      from.parent &&
      from.parent.parent?.flowNodeType === FlowNodeBaseType.INLINE_BLOCKS &&
      from.parent.originParent &&
      !from.parent.originParent.isLast
    ) {
      const allBranches = from.parent.parent!.blocks;
      // Determine whether the last node of all branch is end, All branches are not allowed to be end
      const branchEndCount = allBranches.filter(
        (block) =>
          block.blocks[block.blocks.length - 1]?.getNodeMeta().isNodeEnd,
      ).length;
      return branchEndCount < allBranches.length - 1;
    }
    return true;
  },
  canDelete(ctx, node) {
    return node.parent !== ctx.document.root;
  },
  onAdd() {
    return {
      id: `end_${nanoid()}`,
      type: "end",
      data: {
        name: "结束",
        description: "工作流的最终节点，用于在工作流运行结束后返回结果信息。",
      },
    };
  },
  formMeta: defaultFormMeta,
};
