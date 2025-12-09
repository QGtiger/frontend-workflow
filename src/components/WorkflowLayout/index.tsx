import {
  EditorRenderer,
  FixedLayoutEditorProvider,
} from "@flowgram.ai/fixed-layout-editor";

import "@flowgram.ai/fixed-layout-editor/index.css";
import { useEditorProps } from "./hooks/use-editor-props";
import { initialData } from "./initial-data";
import { FlowNodeRegistries } from "./nodes";
import { DemoTools } from "./components/DemoTools";
import type { FlowNodeJSON } from "./typings";

interface WorkflowLayoutEditorProps {
  nodes: FlowNodeJSON[];
  onNodesChange?: (nodes: FlowNodeJSON[]) => void;
}

export function WorkflowLayoutEditor(props: WorkflowLayoutEditorProps) {
  const { nodes, onNodesChange } = props;
  /**
   * Editor Config
   */
  const editorProps = useEditorProps({ nodes }, FlowNodeRegistries);

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
