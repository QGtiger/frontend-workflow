import {
  EditorRenderer,
  FixedLayoutEditorProvider,
} from "@flowgram.ai/fixed-layout-editor";

import "@flowgram.ai/fixed-layout-editor/index.css";
import { useEditorProps } from "./hooks/use-editor-props";
import { initialData } from "./initial-data";
import { FlowNodeRegistries } from "./nodes";
import { DemoTools } from "./components/DemoTools";

export function WorkflowLayout() {
  /**
   * Editor Config
   */
  const editorProps = useEditorProps(initialData, FlowNodeRegistries);

  console.log("editorProps", editorProps);
  console.log("initialData", initialData);
  console.log("FlowNodeRegistries", FlowNodeRegistries);
  return (
    <div className="doc-feature-overview">
      <FixedLayoutEditorProvider {...editorProps}>
        <EditorRenderer />
        <DemoTools />
      </FixedLayoutEditorProvider>
    </div>
  );
}
