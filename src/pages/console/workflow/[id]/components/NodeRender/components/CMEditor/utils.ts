import type {
  FlowDocument,
  FlowNodeEntity,
} from "@flowgram.ai/fixed-layout-editor";
import type { CustomNodeData } from "../../../../types";
import type { FlowNodeJSON } from "@/components/WorkflowLayout/typings";

export function getAllPreviousNodes(
  nodeId: string,
  document: FlowDocument
): CustomNodeData[] {
  const results: CustomNodeData[] = [];

  // 递归向上找到根节点，同时收集前面的兄弟节点
  function collectPrevSiblings(currentId: string) {
    const current = document.getNode(currentId);
    if (!current) {
      throw new Error(`Node ${currentId} not found`);
    }
    // 收集当前节点之前的所有兄弟
    let prev = current.pre;
    while (prev) {
      const { data, blocks } = prev.toJSON() || {};
      // 只收集有 outputStruct 的业务节点
      if (data?.outputStruct) {
        results.push(data as CustomNodeData);
      }
      // 如果是复合节点（loop/switch/if），递归收集其内部节点
      collectFromBlocks(blocks);
      prev = prev.pre;
    }

    // 继续向上遍历
    // 使用 originParent 跳过内部容器节点
    const parent = current.parent;
    if (parent && parent.flowNodeType !== "root") {
      collectPrevSiblings(parent.id);
    }
  }

  function collectFromBlocks(blocks: FlowNodeJSON["blocks"]) {
    if (!blocks) return;
    for (const block of blocks) {
      if (block.data?.outputStruct) {
        results.push(block.data as CustomNodeData);
      }
      collectFromBlocks(block.blocks);
    }
  }

  collectPrevSiblings(nodeId);
  return results;
}
