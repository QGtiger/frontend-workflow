import type { CompletionSection } from "@codemirror/autocomplete";
import { withSectionHeader } from "./dom";

export const RECOMMENDED_SECTION: CompletionSection = withSectionHeader({
  name: "推荐",
  rank: 0,
});

export const PREVIOUS_NODES_SECTION: CompletionSection = withSectionHeader({
  name: "前序节点",
  rank: 1,
});
