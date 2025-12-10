import { WorkflowLayoutEditor } from "@/components/WorkflowLayout";
import Header from "./components/Header";
import { WorkflowDetailModel } from "./models";
import { useConnectorSelectorModal } from "./hooks";
import { CustomNodeRegistry } from "./utils";
import { CustomNode } from "./components/NodeRender/CustomNode";
import { SideBarRender } from "./components/NodeRender/SideBarRender";

export default function WorkflowDetail() {
  const { workflowData } = WorkflowDetailModel.useModel();
  const {
    showConnectorSelectorModal,
    showConnectorSelectorModalContextHolder,
  } = useConnectorSelectorModal();

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto relative">
        <WorkflowLayoutEditor
          nodes={workflowData?.nodes ?? []}
          onNodesChange={() => {}}
          onAddNode={({ builtInNodes, from, addBlock }) => {
            showConnectorSelectorModal({
              builtInNodes: builtInNodes,
              addBlock,
            });
          }}
          nodeRegistries={[CustomNodeRegistry]}
          renderNodeForm={({ node, isSideBar, registry }) => {
            if (!isSideBar) {
              return <CustomNode node={node} />;
            }
            return <SideBarRender node={node} />;
          }}
        />
        {showConnectorSelectorModalContextHolder}
      </div>
    </div>
  );
}
