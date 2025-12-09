import { Button, Tag, Space, Typography, Divider } from "antd";
import {
  SaveOutlined,
  SendOutlined,
  MoreOutlined,
  EditOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { WorkflowDetailModel, type WorkflowDetailData } from "../models";

const statusConfig: Record<
  WorkflowDetailData["status"],
  { label: string; color: string }
> = {
  draft: { label: "草稿", color: "default" },
  published: { label: "已发布", color: "success" },
  unpublished: { label: "未发布", color: "warning" },
};

export default function Header() {
  const { workflowData } = WorkflowDetailModel.useModel();

  if (!workflowData) return null;

  const { name, description, status, updatedAt } = workflowData;
  const statusInfo = statusConfig[status ?? "draft"];

  return (
    <div className="px-3 py-2 border-b border-gray-200 bg-white shrink-0 flex items-center justify-between gap-4">
      {/* 左侧：标题信息 */}
      <div className="min-w-0">
        {/* 第一行：标题 + 状态 */}
        <div className="flex items-center gap-2">
          <Typography.Title
            level={5}
            className="mb-0! truncate max-w-md"
            title={name}
          >
            {name}
          </Typography.Title>
          <Button
            type="text"
            size="small"
            icon={<EditOutlined />}
            className="text-gray-400 hover:text-gray-600"
          />
          <Tag color={statusInfo.color} className="m-0!">
            {statusInfo.label}
          </Tag>
        </div>

        {/* 第二行：描述 + 更新时间 */}
        <div className="flex items-center gap-3 mt-0.5">
          {description && (
            <>
              <Typography.Text
                type="secondary"
                className="text-sm truncate max-w-md"
                title={description}
              >
                {description}
              </Typography.Text>
              <Divider type="vertical" className="h-3! mx-0!" />
            </>
          )}

          {updatedAt && (
            <Typography.Text
              type="secondary"
              className="text-xs flex items-center gap-1 whitespace-nowrap"
            >
              <ClockCircleOutlined />
              更新于 {new Date(updatedAt).toLocaleString()}
            </Typography.Text>
          )}
        </div>
      </div>

      {/* 右侧：操作按钮 */}
      <Space size="middle" className="shrink-0">
        <Button icon={<SaveOutlined />}>保存</Button>
        <Button type="primary" icon={<SendOutlined />}>
          发布
        </Button>
        <Divider type="vertical" className="h-5! mx-0!" />
        <Button type="text" icon={<MoreOutlined />} />
      </Space>
    </div>
  );
}
