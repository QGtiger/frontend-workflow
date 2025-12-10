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
import { useCreation } from "ahooks";
import { NodeRenderModel } from "./models/NodeRenderModal";

const RenderForm = () => {
  const { isSideBar, node } = NodeRenderModel.useModel();
  const { renderNodeForm } = WorkflowLayoutEditorModel.useModel();
  return (
    renderNodeForm?.({
      node: node,
      isSideBar: isSideBar,
      registry: node.getNodeRegistry<FlowNodeRegistry>(),
    }) || "未配置表单渲染"
  );
};

export function WorkflowLayoutEditor(
  props: WorkflowLayoutEditorModelProps & {
    nodeRegistries?: FlowNodeRegistry[];
  }
) {
  const { nodes, onNodesChange, nodeRegistries = [], renderNodeForm } = props;

  const NodeRegistries = useCreation(() => {
    const items = [...FlowNodeRegistries, ...nodeRegistries];
    if (!renderNodeForm) {
      return items;
    }
    return items.map((it) => {
      return {
        ...it,
        formMeta: {
          render: RenderForm,
        },
      };
    });
  }, []);

  /**
   * Editor Config
   */
  const editorProps = useEditorProps({ nodes }, NodeRegistries);

  return (
    <WorkflowLayoutEditorModel.Provider value={props}>
      <FixedLayoutEditorProvider {...editorProps}>
        <EditorRenderer />
        <DemoTools />
      </FixedLayoutEditorProvider>
    </WorkflowLayoutEditorModel.Provider>
  );
}
