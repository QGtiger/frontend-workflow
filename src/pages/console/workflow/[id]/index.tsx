import { WorkflowLayoutEditor } from "@/components/WorkflowLayout";
import Header from "./components/Header";
import { WorkflowDetailModel } from "./models";
import { useConnectorSelectorModal } from "./hooks";
import { CustomNodeRegistry } from "./utils";
import { CustomNode } from "./components/NodeRender/CustomNode";
import { SideBarRender } from "./components/NodeRender/SideBarRender";
import { CustomNodeRenderModel } from "./components/NodeRender/model";

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
          renderNodeForm={(props) => {
            return (
              <CustomNodeRenderModel.Provider value={props}>
                {props.isSideBar ? <SideBarRender /> : <CustomNode />}
              </CustomNodeRenderModel.Provider>
            );
          }}
        />
        {showConnectorSelectorModalContextHolder}
      </div>
    </div>
  );
}
