import {
  EditorRenderer,
  FixedLayoutEditorProvider,
} from "@flowgram.ai/fixed-layout-editor";

import "@flowgram.ai/fixed-layout-editor/index.css";
import { useEditorProps } from "./hooks/use-editor-props";
import { initialData } from "./initial-data";
import { FlowNodeRegistries } from "./nodes";
import { DemoTools } from "./components/DemoTools";
import {
  WorkflowLayoutEditorModel,
  type WorkflowLayoutEditorModelProps,
} from "./models/WorkflowLayoutEditorModel";

export function WorkflowLayoutEditor(props: WorkflowLayoutEditorModelProps) {
  const { nodes, onNodesChange } = props;
  /**
   * Editor Config
   */
  const editorProps = useEditorProps({ nodes }, FlowNodeRegistries);

  console.log("editorProps", editorProps);
  console.log("initialData", initialData);
  console.log("FlowNodeRegistries", FlowNodeRegistries);
  return (
    <WorkflowLayoutEditorModel.Provider value={props}>
      <FixedLayoutEditorProvider {...editorProps}>
        <EditorRenderer />
        <DemoTools />
      </FixedLayoutEditorProvider>
    </WorkflowLayoutEditorModel.Provider>
  );
}
