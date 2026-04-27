import { Outlet } from "react-router-dom";
import {
  PlusOutlined,
  FolderOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { Button, Dropdown, Input, Spin } from "antd";
import type { MenuProps } from "antd";
import { WorkflowLayoutModel } from "./models";
import { useWorkflowId } from "./hooks";
import WorkflowTree from "./components/WorkflowTree";

function WorkflowLayoutContent() {
  const workflowId = useWorkflowId();
  const {
    collapsed,
    collapsedAction,
    treeData,
    firstLoading,
    createFolder,
    createWorkflow,
  } = WorkflowLayoutModel.useModel();

  const newItems: MenuProps["items"] = [
    {
      key: "folder",
      icon: <FolderOutlined />,
      label: "新建文件夹",
      onClick: () => createFolder(),
    },
    {
      key: "workflow",
      icon: <FileTextOutlined />,
      label: "新建工作流",
      onClick: () => createWorkflow(),
    },
  ];

  if (firstLoading)
    return (
      <div className="h-full flex items-center justify-center">
        <Spin />
      </div>
    );

  return (
    <div className="flex h-full">
      {/* 左侧目录树 */}
      <div
        className={`h-full border-r border-gray-200 bg-white transition-all duration-300 flex flex-col ${
          collapsed ? "w-0 overflow-hidden" : "w-64"
        }`}
      >
        {/* 头部 */}
        <div className="p-3 border-b border-gray-200 flex items-center justify-between">
          <span className="font-medium text-gray-700">工作流</span>
          <Dropdown menu={{ items: newItems }} trigger={["hover"]}>
            <Button type="primary" size="small" icon={<PlusOutlined />}>
              新建
            </Button>
          </Dropdown>
        </div>

        {/* 搜索框 */}
        <div className="p-3 pb-2">
          <Input.Search placeholder="搜索" allowClear size="small" />
        </div>

        {/* 目录树 */}
        <div className="flex-1 overflow-auto px-2">
          <WorkflowTree treeData={treeData || []} selectedKey={workflowId} />
        </div>
      </div>

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
