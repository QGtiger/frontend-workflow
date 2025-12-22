import { Card, Empty } from "antd";
import { KeyOutlined } from "@ant-design/icons";

export default function IpaasAuthConfig() {
  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <KeyOutlined />
          <span>授权配置</span>
        </div>
      }
      className="h-full"
    >
      <Empty
        description="授权配置功能开发中..."
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    </Card>
  );
}
