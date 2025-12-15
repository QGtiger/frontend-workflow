import type { CompletionSection } from "@codemirror/autocomplete";

export const renderSectionHeader = (
  section: CompletionSection
): HTMLElement => {
  const container = document.createElement("li");
  container.classList.add("cm-section-header");
  const inner = document.createElement("div");
  inner.classList.add("cm-section-title");
  inner.textContent = section.name;
  container.appendChild(inner);

  return container;
};

export const withSectionHeader = (
  section: CompletionSection
): CompletionSection => {
  section.header = renderSectionHeader;
  return section;
};
