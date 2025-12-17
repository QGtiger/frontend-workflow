import { LRLanguage, LanguageSupport } from "@codemirror/language";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import type { WorkflowStoreApi } from "../../../../workflowStore";
import { dollarCompletions } from "./autocompletion/dollarCompletions";
import { blankCompletions } from "./autocompletion/blankCompletions";
import { nonDollarCompletions } from "./autocompletion/nonDollarCompletions";
import { datatypeCompletions } from "./autocompletion/datatypeCompletions";

/**
 * 创建表达式语言支持
 * 使用最小化的语言扩展，只提供 autocomplete 数据
 */
export function createExpressionLanguageSupport(
  workflowStoreApi: WorkflowStoreApi
) {
  // 创建最小语言，复用 JS parser，只提供 autocomplete
  const expressionLanguage = LRLanguage.define({
    parser: javascriptLanguage.parser,
  });

  return new LanguageSupport(
    expressionLanguage,
    [
      dollarCompletions(workflowStoreApi),
      blankCompletions(workflowStoreApi),
      nonDollarCompletions,
      datatypeCompletions(workflowStoreApi),
    ].map((source) => expressionLanguage.data.of({ autocomplete: source }))
  );
}
