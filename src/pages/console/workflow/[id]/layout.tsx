import { useOutlet } from "react-router-dom";
import { WorkflowDetailModel } from "./models";
import { Result, Spin } from "antd";

function WorkflowDetailContent() {
  const { loading, workflowData, error } = WorkflowDetailModel.useModel();
  const outlet = useOutlet();
  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <Result
          status="error"
          title="获取工作流详情失败"
          subTitle={error.message}
        />
      </div>
    );
  }
  if (loading || !workflowData)
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
