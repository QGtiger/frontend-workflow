import {
  EditorRenderer,
  FixedLayoutEditorProvider,
} from "@flowgram.ai/fixed-layout-editor";

import "@flowgram.ai/fixed-layout-editor/index.css";
import { useEditorProps } from "./hooks/use-editor-props";
import { FlowNodeRegistries } from "./nodes";
import { DemoTools } from "./components/DemoTools";
import {
  WorkflowLayoutEditorModel,
  type WorkflowLayoutEditorModelProps,
} from "./models/WorkflowLayoutEditorModel";
import type { FlowNodeRegistry } from "./typings";

export function WorkflowLayoutEditor(
  props: WorkflowLayoutEditorModelProps & {
    nodeRegistries?: FlowNodeRegistry[];
  }
) {
  const { nodes, onNodesChange, nodeRegistries = [] } = props;
  /**
   * Editor Config
   */
  const editorProps = useEditorProps({ nodes }, [
    ...FlowNodeRegistries,
    ...nodeRegistries,
  ]);

  return (
    <WorkflowLayoutEditorModel.Provider value={props}>
      <FixedLayoutEditorProvider {...editorProps}>
        <EditorRenderer />
        <DemoTools />
      </FixedLayoutEditorProvider>
    </WorkflowLayoutEditorModel.Provider>
  );
}
