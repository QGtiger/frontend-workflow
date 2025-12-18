import type { WorkflowStoreApi } from "../../../../../workflowStore";
import {
  Decoration,
  EditorView,
  RangeSetBuilder,
  StateField,
  type DecorationSet,
  type EditorState,
} from "@uiw/react-codemirror";

// ============ 1. 定义状态类型 ============
type ExpressionState = "valid" | "invalid" | "pending";

// ============ 2. 定义 CSS 样式 ============
const expressionTheme = EditorView.theme({
  ".expr-valid": {
    color: "#2ecc71",
    backgroundColor: "rgba(46, 204, 113, 0.1)",
    borderRadius: "3px",
  },
  ".expr-invalid": {
    color: "#e74c3c",
    backgroundColor: "rgba(231, 76, 60, 0.1)",
    borderRadius: "3px",
  },
  ".expr-pending": {
    color: "#3498db",
    backgroundColor: "rgba(52, 152, 219, 0.1)",
    borderRadius: "3px",
  },
});

// ============ 3. 状态到装饰器映射 ============
const stateToDecoration: Record<ExpressionState, Decoration> = {
  valid: Decoration.mark({ class: "expr-valid" }),
  invalid: Decoration.mark({ class: "expr-invalid" }),
  pending: Decoration.mark({ class: "expr-pending" }),
};

// ============ 5. 状态判定函数 ============
function getExpressionState(error?: Error): ExpressionState {
  if (!error) return "valid";

  if (error.message.includes("is not defined")) {
    return "pending";
  }

  return "invalid";
}

export function highlightExtension(workflowStoreApi: WorkflowStoreApi) {
  // ============ 6. 构建装饰集 ============
  function buildDecorations(state: EditorState): DecorationSet {
    const builder = new RangeSetBuilder<Decoration>();
    const text = state.doc.toString();
    const regex = /\{\{(.+?)\}\}/g;

    // 收集所有匹配并排序（RangeSetBuilder 需要按顺序添加）
    const matches: { from: number; to: number; decoration: Decoration }[] = [];

    let match;
    while ((match = regex.exec(text)) !== null) {
      const from = match.index;
      const to = from + match[0].length;
      const exprContent = match[1].trim();

      const { error } = workflowStoreApi.evaluateExpression(exprContent);
      const exprState = getExpressionState(error);
      const decoration = stateToDecoration[exprState];

      matches.push({ from, to, decoration });
    }

    // 按位置排序后添加
    matches.sort((a, b) => a.from - b.from);
    for (const { from, to, decoration } of matches) {
      builder.add(from, to, decoration);
    }

    return builder.finish();
  }

  // ============ 7. StateField 直接计算装饰（无需 dispatch）============
  const highlightField = StateField.define<DecorationSet>({
    create(state) {
      return buildDecorations(state);
    },
    update(decorations, transaction) {
      // 只有文档变化时才重新计算
      if (transaction.docChanged) {
        return buildDecorations(transaction.state);
      }
      return decorations;
    },
    provide: (field) => EditorView.decorations.from(field),
  });

  return [expressionTheme, highlightField];
}
