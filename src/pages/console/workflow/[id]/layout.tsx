import { useOutlet } from "react-router-dom";
import { WorkflowDetailModel } from "./models";
import { Spin } from "antd";

function WorkflowDetailContent() {
  const { loading } = WorkflowDetailModel.useModel();
  const outlet = useOutlet();
  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Spin />
      </div>
    );
  return outlet;
}

export default function WorkflowDetailLayout() {
  return (
    <WorkflowDetailModel.Provider>
      <WorkflowDetailContent />
    </WorkflowDetailModel.Provider>
  );
}
