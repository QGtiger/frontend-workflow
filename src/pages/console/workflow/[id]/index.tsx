import { WorkflowLayoutEditor } from "@/components/WorkflowLayout";
import Header from "./components/Header";
import { WorkflowDetailModel } from "./models";

export default function WorkflowDetail() {
  const { workflowData } = WorkflowDetailModel.useModel();
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto relative">
        <WorkflowLayoutEditor
          nodes={workflowData?.nodes ?? []}
          onNodesChange={() => {}}
          onAddNode={console.log}
        />
      </div>
    </div>
  );
}
