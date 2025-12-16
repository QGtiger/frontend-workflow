import type { Completion, CompletionContext } from "@codemirror/autocomplete";
import { ROOT_DOLLAR_COMPLETIONS } from "./constants";
import {
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
} from "./utils";
import type { WorkflowStoreApi } from "../../../../../workflowStore";
import { createInfoBoxRenderer } from "./CreateInfoBox";
import { PREVIOUS_NODES_SECTION } from "./SectionHeader";

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
