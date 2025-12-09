import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { Button, Input, List, Spin } from "antd";
import { WorkflowLayoutModel } from "./models";
import { useWorkflowId } from "./hooks";

function WorkflowLayoutContent() {
  const workflowId = useWorkflowId();
  const navigate = useNavigate();
  const { collapsed, collapsedAction, workflows, loading } =
    WorkflowLayoutModel.useModel();

  if (loading)
    return (
      <div className="h-full flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <div className="flex h-full">
      {/* 左侧列表 */}
      <div
        className={`h-full border-r border-gray-200 bg-white transition-all duration-300 flex flex-col ${
          collapsed ? "w-0 overflow-hidden" : "w-64"
        }`}
      >
        {/* 列表头部 */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <span className="font-medium text-gray-700">工作流列表</span>
          <Button type="primary" size="small" icon={<PlusOutlined />}>
            新建
          </Button>
        </div>

        {/* 搜索框 */}
        <div className="p-3 pb-2">
          <Input.Search placeholder="搜索工作流" allowClear size="small" />
        </div>

        {/* 工作流列表 */}
        <div className="flex-1 overflow-auto px-2">
          <List
            dataSource={workflows}
            renderItem={(item) => (
              <List.Item
                className={` rounded-md px-1! py-1.5! border-none! cursor-pointer hover:bg-gray-50 transition-colors ${
                  workflowId === item.id ? "bg-gray-50" : ""
                }`}
              >
                <div
                  className="w-full cursor-pointer"
                  onClick={() => navigate(`/console/workflow/${item.id}`)}
                >
                  <div className="text-sm text-gray-800 truncate">
                    {item.name}
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>
      </div>

      {/* 折叠按钮 */}
      {/* <div
        className="w-5 flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors border-r border-gray-200"
        onClick={collapsedAction.toggle}
      >
        {collapsed ? (
          <MenuUnfoldOutlined className="text-gray-500" />
        ) : (
          <MenuFoldOutlined className="text-gray-500" />
        )}
      </div> */}

      {/* 右侧展示区域 */}
      <div className="flex-1 h-full overflow-auto bg-gray-50">
        <Outlet />
      </div>
    </div>
  );
}

export default function WorkflowLayout() {
  return (
    <WorkflowLayoutModel.Provider>
      <WorkflowLayoutContent />
    </WorkflowLayoutModel.Provider>
  );
}
