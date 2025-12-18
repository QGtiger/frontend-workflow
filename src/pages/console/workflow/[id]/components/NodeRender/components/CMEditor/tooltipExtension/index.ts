import { javascriptLanguage } from "@codemirror/lang-javascript";
import type { SyntaxNode } from "@lezer/common";
import {
  EditorView,
  showTooltip,
  StateField,
  StateEffect,
  ViewPlugin,
  type PluginValue,
  type EditorState,
  type Tooltip,
} from "@uiw/react-codemirror";
import {
  CompletionContext,
  type Completion,
  type CompletionResult,
} from "@codemirror/autocomplete";
import { isInfoBoxRenderer } from "../autocompletion/utils/CreateInfoBox";

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

// ========== 4. 字符串读取器 ==========
const createStringReader = (str: string) => (node?: SyntaxNode | null) => {
  return node ? str.slice(node.from, node.to) : "";
};

// ========== 5. 从 autocomplete 源获取补全信息 ==========
function getCompletion(
  state: EditorState,
  pos: number,
  filter: (completion: Completion) => boolean
): Completion | null {
  const context = new CompletionContext(state, pos, true);
  const sources = state.languageDataAt<
    (context: CompletionContext) => CompletionResult | null
  >("autocomplete", pos);

  for (const source of sources) {
    const result = source(context);
    const options = result?.options.filter(filter);
    if (options && options.length > 0) {
      return options[0];
    }
  }
  return null;
}

// ========== 6. 根据 callee 类型解析函数信息 ==========
function resolveCalleeInfo(
  callee: SyntaxNode,
  readNode: (node?: SyntaxNode | null) => string
): { objectName: string; methodName: string } | null {
  switch (callee.name) {
    case "MemberExpression": {
      // DateTime.format() 形式
      const objectName = readNode(callee.firstChild);
      const methodName = readNode(callee.lastChild);
      return { objectName, methodName };
    }
    case "VariableName": {
      // 直接函数调用 format() 形式（暂不支持）
      const methodName = readNode(callee);
      return { objectName: "", methodName };
    }
    default:
      return null;
  }
}

// ========== 8. 获取参数提示 Tooltip ==========
function getParamHintTooltip(state: EditorState): Tooltip | null {
  const pos = state.selection.main.head;

  // 获取表达式内容
  const exprInfo = getExpressionInfo(state, pos);
  if (!exprInfo) return null;

  const { content, offset } = exprInfo;
  const localPos = pos - offset;
  const readNode = createStringReader(content);

  // 解析表达式
  const tree = jsParser.parse(content);
  const node = tree.resolveInner(localPos, -1);

  // 查找 ArgList
  const argList = findNearestParent(node, "ArgList");
  if (!argList) return null;

  // 确保光标在括号内部
  if (localPos <= argList.from || localPos >= argList.to) return null;

  // 查找 CallExpression
  const callExpr = findNearestParent(argList, "CallExpression");
  if (!callExpr) return null;

  // 解析 callee
  const callee = callExpr.firstChild;
  if (!callee) return null;

  const calleeInfo = resolveCalleeInfo(callee, readNode);
  if (!calleeInfo) return null;

  const { objectName, methodName } = calleeInfo;

  // 从 autocomplete 源获取补全信息
  // 计算方法调用的全局位置（在 "." 之后）
  const methodPos =
    callee.name === "MemberExpression"
      ? offset + (callee.lastChild?.to ?? callee.to)
      : offset + callee.to;

  const completion = getCompletion(
    state,
    methodPos,
    (c) => c.label === `${methodName}()`
  );

  if (!completion) return null;

  // const doc = completion ? getDocFromCompletion(completion) : null;
  // if (!doc) return null;

  // // 如果是 MemberExpression，更新 doc.name 加上对象名前缀
  // const displayDoc =
  //   objectName && doc.name && !doc.name.includes(".")
  //     ? { ...doc, name: `${objectName}.${doc.name}` }
  //     : doc;

  const argIndex = getArgIndex(argList, localPos);

  return {
    pos: offset + argList.from,
    above: true,
    create: () => {
      const element = document.createElement("div");
      element.classList.add("cm-cursorInfo");
      const info = completion.info;
      if (typeof info === "string") {
        element.textContent = info;
      } else if (isInfoBoxRenderer(info)) {
        const infoBox = info(completion, argIndex);
        if (infoBox instanceof HTMLElement) {
          element.appendChild(infoBox);
        }
      }
      return {
        dom: element,
      };
    },
  };
}

// ========== 4.5. 定义焦点变化 Effect ==========
const setFocusEffect = StateEffect.define<boolean>();

// ========== 4.6. 监听焦点变化的 ViewPlugin ==========
const focusPlugin = ViewPlugin.fromClass(
  class implements PluginValue {
    constructor(private view: EditorView) {
      // 初始化时添加焦点监听
      this.view.dom.addEventListener("focus", this.onFocus);
      this.view.dom.addEventListener("blur", this.onBlur);
    }

    onFocus = () => {
      this.view.dispatch({
        effects: setFocusEffect.of(true),
      });
    };

    onBlur = () => {
      this.view.dispatch({
        effects: setFocusEffect.of(false),
      });
    };

    destroy() {
      this.view.dom.removeEventListener("focus", this.onFocus);
      this.view.dom.removeEventListener("blur", this.onBlur);
    }
  }
);

// ========== 5. 定义 StateField ==========
const paramHintField = StateField.define<{ tooltip: Tooltip | null }>({
  create(state) {
    return { tooltip: getParamHintTooltip(state) };
  },

  update(value, tr) {
    // 监听焦点变化的 effect
    for (const effect of tr.effects) {
      if (effect.is(setFocusEffect)) {
        // 如果失焦，清除 tooltip
        if (!effect.value) {
          return { tooltip: null };
        }
      }
    }

    if (tr.docChanged || tr.selection) {
      return { tooltip: getParamHintTooltip(tr.state) };
    }
    return value;
  },

  provide: (field) =>
    showTooltip.compute([field], (state) => state.field(field).tooltip),
});

// ============ 6. 导出扩展（不包含 javascriptLanguage，避免默认样式） ============
export const tooltipExtension = [focusPlugin, paramHintField];
