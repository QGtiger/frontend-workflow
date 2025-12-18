import type { FlowDocument } from "@flowgram.ai/fixed-layout-editor";
import type { CustomNodeData, NodeOutputStructItem } from "../../types";
import type { FlowNodeJSON } from "@/components/WorkflowLayout/typings";
import type { SandboxResult } from "@/common/sandbox";

export function getAllPreviousNodesByDocument(
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

/**
 * 模块级别的缓存，用于避免重复生成相同的模拟数据
 */
const mockDataCache = new WeakMap<NodeOutputStructItem[], any>();

/**
 * 根据类型生成基础值
 */
function generatePrimitiveValue(type: string): any {
  const lowerType = type.toLowerCase();

  if (lowerType === "number") {
    return 1;
  }
  if (lowerType === "string") {
    return "模拟字符串";
  }
  if (lowerType === "boolean") {
    return true;
  }

  throw new Error(`不支持的基础类型: ${type}`);
}

/**
 * 生成单个元素（用于数组元素）
 */
function generateSingleItem(item: NodeOutputStructItem): any {
  const { type, children } = item;
  const lowerType = type.toLowerCase();

  if (lowerType === "object") {
    // 对象类型：递归生成子对象（会使用缓存）
    return generateMockDataByOutputStruct(children || []);
  } else if (lowerType === "array") {
    // 数组类型：使用 Proxy 代理，任意索引都返回第一项
    const firstItem =
      children && children.length > 0
        ? generateSingleItem(children[0])
        : generatePrimitiveValue("string");

    return new Proxy([firstItem], {
      get(target, prop) {
        if (prop === "length") return 1;
        if (prop === Symbol.iterator) {
          return target[Symbol.iterator].bind(target);
        }
        if (typeof prop === "string" && !isNaN(Number(prop))) {
          // 任何数字索引都返回第一项
          return target[0];
        }
        const value = target[prop as any];
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      },
    });
  } else {
    // 基础类型
    return generatePrimitiveValue(type);
  }
}

/**
 * 根据 NodeOutputStructItem 数组生成模拟数据
 *
 * 使用 WeakMap 缓存，避免对同一个 outputStruct 数组重复生成数据
 *
 * @param outputStruct - 输出结构定义
 * @returns 模拟数据对象
 *
 * @example
 * const struct = [
 *   { code: 'id', type: 'number', label: 'ID' },
 *   { code: 'name', type: 'string', label: '名称' },
 *   { code: 'items', type: 'array', label: '列表', children: [
 *     { code: '0', type: 'string', label: '项目' }
 *   ]}
 * ];
 *
 * const data = generateMockDataByOutputStruct(struct);
 * // { id: 1, name: "模拟字符串", items: Proxy([...]) }
 */
export function generateMockDataByOutputStruct(
  outputStruct: NodeOutputStructItem[]
): any {
  // 检查缓存
  const cached = mockDataCache.get(outputStruct);
  if (cached) {
    return cached;
  }

  // 生成模拟数据
  const result = outputStruct.reduce((acc, cur) => {
    acc[cur.code] = generateSingleItem(cur);
    return acc;
  }, {} as Record<string, any>);

  // 存入缓存
  mockDataCache.set(outputStruct, result);
  return result;
}
