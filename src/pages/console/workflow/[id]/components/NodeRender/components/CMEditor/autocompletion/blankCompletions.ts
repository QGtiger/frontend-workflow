import type { CompletionContext } from "@codemirror/autocomplete";
import { dollarOptions } from "./dollarCompletions";
import { requiredInExpression } from "./utils";
import type { WorkflowStoreApi } from "../../../../../workflowStore";

/**
 * Completions offered at the blank position: `{{ | }}`
 */
export function blankCompletions(workflowStoreApi: WorkflowStoreApi) {
  return requiredInExpression((context: CompletionContext) => {
    const word = context.matchBefore(/\{\{\s/);

    if (!word) return null;

    const afterCursor = context.state.sliceDoc(
      context.pos,
      context.pos + " }}".length
    );

    if (afterCursor !== " }}") return null;

    return {
      options: dollarOptions("", workflowStoreApi),
      from: word.to,
      filter: false,
    };
  });
}
