import type { Completion } from "@codemirror/autocomplete";
import { ROOT_DOLLAR_COMPLETIONS } from "./constants";
import {
  longestCommonPrefix,
  prefixMatch,
  requiredInExpression,
} from "./utils";

export const dollarCompletions = requiredInExpression((context) => {
  const word = context.matchBefore(/\$[^$]*/);

  if (!word) return null;

  let options = [...ROOT_DOLLAR_COMPLETIONS];
  const userInput = word.text;

  if (userInput !== "$") {
    options = options.filter((o) => prefixMatch(o.label, userInput));
  }

  console.log(word);

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
