import { WorkflowLayoutEditor } from "@/components/WorkflowLayout";
import Header from "./components/Header";
import { WorkflowDetailModel } from "./models";
import { useConnectorSelectorModal } from "./hooks";

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
        />
        {showConnectorSelectorModalContextHolder}
      </div>
    </div>
  );
}
