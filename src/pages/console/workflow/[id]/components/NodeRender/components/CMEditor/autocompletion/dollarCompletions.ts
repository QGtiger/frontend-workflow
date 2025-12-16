import {
  insertCompletionText,
  pickedCompletion,
  type Completion,
  type CompletionContext,
} from "@codemirror/autocomplete";
import type { EditorView } from "@uiw/react-codemirror";
import { ROOT_DOLLAR_COMPLETIONS } from "./constants";
import {
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
} from "./utils";
import type { WorkflowStoreApi } from "../../../../../workflowStore";
import { createInfoBoxRenderer } from "./utils/CreateInfoBox";
import { PREVIOUS_NODES_SECTION } from "./utils/SectionHeader";

/**
 * 自定义补全应用，处理括号重复问题
 */
const applyCompletion = (
  view: EditorView,
  completion: Completion,
  from: number,
  to: number
) => {
  const label = completion.label;
  const doc = view.state.doc.toString();
  const afterCursor = doc.slice(to);

  // 跳过已存在的尾部括号
  let skipChars = 0;
  if (label.endsWith("')") && afterCursor.startsWith("')")) {
    skipChars = 2;
  } else if (label.endsWith(")") && afterCursor.startsWith(")")) {
    skipChars = 1;
  }

  view.dispatch({
    ...insertCompletionText(view.state, label, from, to + skipChars),
    annotations: pickedCompletion.of(completion),
  });
};

export const dollarCompletions = function (workflowStoreApi: WorkflowStoreApi) {
  return requiredInExpression((context: CompletionContext) => {
    const word = context.matchBefore(/\$[^$]*/);

    if (!word) return null;

    const allPreviousNodesCompletions = workflowStoreApi
      .getAllPreviousNodes()
      .map((it) => {
        const label = `$('${it.name}')`;
        return {
          label,
          apply: applyCompletion,
          info: createInfoBoxRenderer({
            name: label,
            returnType: "Object",
            description: it.description,
          }),
          section: PREVIOUS_NODES_SECTION,
        };
      });

    let options = [...ROOT_DOLLAR_COMPLETIONS].concat(
      allPreviousNodesCompletions
    );
    const userInput = word.text;

    if (userInput !== "$") {
      options = options.filter((o) => prefixMatch(o.label, userInput));
    }

    return {
      options,
      from: word.from,
      filter: false,
      getMatch(completion: Completion) {
        const lcp = longestCommonPrefix(userInput, completion.label);

        return [0, lcp.length];
      },
    };
  });
};
