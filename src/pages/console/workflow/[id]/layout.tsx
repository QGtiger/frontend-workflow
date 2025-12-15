import { useOutlet } from "react-router-dom";
import { ConnectorSelectorModel, WorkflowDetailModel } from "./models";
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
    <ConnectorSelectorModel.Provider>
      <WorkflowDetailModel.Provider>
        <WorkflowDetailContent />
      </WorkflowDetailModel.Provider>
    </ConnectorSelectorModel.Provider>
  );
}
