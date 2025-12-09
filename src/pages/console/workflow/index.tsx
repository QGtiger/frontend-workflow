import { Button, Empty } from "antd";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";

export default function WorkflowEmpty() {
  return (
    <div className="h-full flex items-center justify-center">
      <Empty
        description={
          <div className="space-y-2">
            <div className="text-gray-500 text-base">请从左侧选择工作流</div>
            <div className="text-gray-400 text-sm">
              或创建一个新的工作流开始
            </div>
          </div>
        }
      >
        <Button type="primary" icon={<PlusOutlined />}>
          新建工作流
        </Button>
      </Empty>
    </div>
  );
}
