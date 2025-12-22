import { Card, Empty } from "antd";
import { ThunderboltOutlined } from "@ant-design/icons";

export default function IpaasActionsConfig() {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ThunderboltOutlined />
          <span>执行操作</span>
        </div>
      }
      className="h-full"
    >
      <Empty
        description="执行操作功能开发中..."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  );
}
