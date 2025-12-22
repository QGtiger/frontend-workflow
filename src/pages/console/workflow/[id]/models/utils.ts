import type { WorkflowNode, WorkflowNoes } from "./types";

export function trarverseNodes(
  nodes: WorkflowNoes,
  check: (node: WorkflowNode) => boolean | undefined
) {
  for (const node of nodes) {
    let isOver = false;
    node.blocks &&
      trarverseNodes(node.blocks, (n) => {
        if (check(n)) {
          isOver = true;
          return true;
        }
        return false;
      });
    if (isOver || check(node)) {
      return;
    }
  }
}

export function checkNameIsExist(s: string, nodes: WorkflowNoes) {
  let isNameExist = false;
  trarverseNodes(nodes, (n) => {
    if (n.data?.name === s) {
      isNameExist = true;
      return true;
    }
  });

  return isNameExist;
}
