import { javascriptLanguage } from "@codemirror/lang-javascript";
import type { SyntaxNode } from "@lezer/common";
import {
  showTooltip,
  StateField,
  type EditorState,
  type Tooltip,
} from "@uiw/react-codemirror";
import { dateTimeExtensions, type MethodDoc } from "@/common/DateTime";
import { createInfoBox } from "../autocompletion/utils/CreateInfoBox";

// 直接使用 parser，不注册为编辑器扩展
const jsParser = javascriptLanguage.parser;

// ========== 1. 获取表达式内容和偏移 ==========
function getExpressionInfo(
  state: EditorState,
  pos: number
): { content: string; offset: number } | null {
  const doc = state.doc.toString();
  const before = doc.slice(0, pos);
  const after = doc.slice(pos);

  const lastOpen = before.lastIndexOf("{{");
  const lastClose = before.lastIndexOf("}}");

  if (lastOpen === -1 || lastOpen < lastClose) return null;

  const nextClose = after.indexOf("}}");
  if (nextClose === -1) return null;

  const exprStart = lastOpen + 2;
  const exprEnd = pos + nextClose;
  const content = doc.slice(exprStart, exprEnd);

  return { content, offset: exprStart };
}

// ========== 2. 向上查找指定类型节点 ==========
function findNearestParent(node: SyntaxNode, type: string): SyntaxNode | null {
  if (node.name === type) return node;
  if (node.parent) return findNearestParent(node.parent, type);
  return null;
}

// ========== 3. 计算光标所在参数索引 ==========
function getArgIndex(argList: SyntaxNode, pos: number): number {
  let argIndex = 0;
  let child = argList.firstChild;

  while (child) {
    if (child.name === ",") {
      if (pos > child.to) {
        argIndex++;
      }
    }
    child = child.nextSibling;
  }

  return argIndex;
}

// ========== 4. 获取函数文档 ==========
function getFunctionDoc(
  objectName: string,
  methodName: string
): MethodDoc | null {
  if (objectName === "DateTime") {
    const func =
      dateTimeExtensions.functions[
        methodName as keyof typeof dateTimeExtensions.functions
      ];
    return func?.doc || null;
  }
  return null;
}

// ========== 5. 获取参数提示 Tooltip ==========
function getParamHintTooltip(state: EditorState): Tooltip | null {
  const pos = state.selection.main.head;

  // 获取表达式内容
  const exprInfo = getExpressionInfo(state, pos);
  if (!exprInfo) return null;

  const { content, offset } = exprInfo;
  const localPos = pos - offset; // 光标在表达式中的位置

  // 用 parser 解析表达式
  const tree = jsParser.parse(content);
  const node = tree.resolveInner(localPos, -1);

  // 查找 ArgList (参数列表)
  const argList = findNearestParent(node, "ArgList");
  if (!argList) return null;

  // 确保光标在 ArgList 内部（在 ( 和 ) 之间）
  // argList.from 是 "(" 的位置，argList.to 是 ")" 后的位置
  if (localPos <= argList.from || localPos >= argList.to) return null;

  // 查找 CallExpression (函数调用)
  const callExpr = findNearestParent(argList, "CallExpression");
  if (!callExpr) return null;

  // 获取调用者
  const callee = callExpr.firstChild;
  if (!callee) return null;

  let objectName = "";
  let methodName = "";

  if (callee.name === "MemberExpression") {
    const obj = callee.firstChild;
    const prop = callee.lastChild;
    if (obj && prop) {
      objectName = content.slice(obj.from, obj.to);
      methodName = content.slice(prop.from, prop.to);
    }
  }

  const doc = getFunctionDoc(objectName, methodName);
  if (!doc) return null;

  const argIndex = getArgIndex(argList, localPos);

  return {
    pos: offset + argList.from,
    above: true,
    create: () => ({
      dom: createInfoBox(doc, { activeArgIndex: argIndex, compact: false }),
    }),
  };
}

// ========== 5. 定义 StateField ==========
const paramHintField = StateField.define<{ tooltip: Tooltip | null }>({
  create(state) {
    return { tooltip: getParamHintTooltip(state) };
  },

  update(value, tr) {
    if (tr.docChanged || tr.selection) {
      return { tooltip: getParamHintTooltip(tr.state) };
    }
    return value;
  },

  provide: (field) =>
    showTooltip.compute([field], (state) => state.field(field).tooltip),
});

// ============ 6. 导出扩展（不包含 javascriptLanguage，避免默认样式） ============
export const tooltipExtension = paramHintField;
