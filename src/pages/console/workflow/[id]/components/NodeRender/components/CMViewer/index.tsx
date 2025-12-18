import classNames from "classnames";
import { useMemo } from "react";

import "./index.less";
import { useWorkflowStoreApi } from "../../../../models/workflowStore";
import { parseTemplateForDisplay } from "./utils";

export interface CMViewerProps {
  template?: string;
  className?: string;
}

/**
 * CMViewer - 只读的模板展示组件
 *
 * 将模板中的 {{ expression }} 替换为计算后的真实值并保持颜色高亮
 *
 * @example
 * <CMViewer template="1 {{ 1+1 }} 3" />
 * // 显示: 1 2 3（其中 2 会有颜色高亮）
 *
 * <CMViewer template="{{ [1,2,3] }}" />
 * // 显示: [Array: [1,2,3]]（带颜色高亮）
 */
export function CMViewer({ template, className }: CMViewerProps) {
  const workflowStoreApi = useWorkflowStoreApi();

  // 解析模板，生成显示文本和片段信息
  const { segments } = useMemo(() => {
    if (!template) {
      return { displayText: "", segments: [] };
    }

    return parseTemplateForDisplay(template, (expr) =>
      workflowStoreApi.evaluateExpression(expr)
    );
  }, [template, workflowStoreApi]);

  // 如果没有内容，显示占位符
  if (segments.length === 0) {
    return (
      <div className={classNames("cm-viewer-wrapper", className)}>
        <span className="cm-viewer-placeholder">暂无内容</span>
      </div>
    );
  }

  return (
    <div className={classNames("cm-viewer-wrapper", className)}>
      {segments.map((segment) => {
        // 使用 from-to 作为 key 更合适，因为位置是唯一的
        const key = `${segment.from}-${segment.to}`;

        if (segment.isExpression) {
          // 表达式片段带颜色高亮
          return (
            <span
              key={key}
              className={classNames("cm-viewer-expression", {
                "cm-viewer-expr-valid": segment.state === "valid",
                "cm-viewer-expr-invalid": segment.state === "invalid",
              })}
            >
              {segment.text}
            </span>
          );
        } else {
          // 普通文本
          return <span key={key}>{segment.text}</span>;
        }
      })}
    </div>
  );
}
