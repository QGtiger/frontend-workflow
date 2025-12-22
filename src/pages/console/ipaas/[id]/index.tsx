import { Card, Descriptions, Button, Tag, message } from "antd";
import { InfoCircleOutlined, EditOutlined } from "@ant-design/icons";
import { IpaasDetailModel } from "./models";
import { createConnectorModal } from "../baseConnectorModal";
import { request } from "@/api";

export default function IpaasDetailBasicInfo() {
  const { connector, refreshAsync } = IpaasDetailModel.useModel();

  const editConnectorModal = () => {
    createConnectorModal({
      initialValues: connector,
      onConfirm: async (data) => {
        return request({
          url: "/ipaas/connector/update",
          method: "POST",
          data: {
            ...data,
            connectorId: connector.id,
          },
        })
          .then(() => {
            message.success("连接器更新成功");
          })
          .then(refreshAsync);
      },
    });
  };

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <InfoCircleOutlined />
          <span>基本信息</span>
        </div>
      }
      extra={
        <Button
          icon={<EditOutlined />}
          type="primary"
          onClick={editConnectorModal}
        >
          编辑
        </Button>
      }
      className="h-full"
    >
      <Descriptions column={2} bordered>
        <Descriptions.Item label="连接器ID" span={2}>
          {connector.id}
        </Descriptions.Item>

        <Descriptions.Item label="连接器名称" span={2}>
          {connector.name}
        </Descriptions.Item>

        <Descriptions.Item label="Logo" span={2}>
          <img
            src={connector.logo}
            alt={connector.name}
            className="w-20 h-20 object-cover rounded"
          />
        </Descriptions.Item>

        <Descriptions.Item label="描述" span={2}>
          {connector.description}
        </Descriptions.Item>

        {connector.documentLink && (
          <Descriptions.Item label="帮助文档" span={2}>
            <a
              href={connector.documentLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600"
            >
              {connector.documentLink}
            </a>
          </Descriptions.Item>
        )}

        <Descriptions.Item label="发布状态">
          {connector.status === 1 && <Tag color="default">未发布</Tag>}
          {connector.status === 2 && <Tag color="success">已发布</Tag>}
          {connector.status === 3 && <Tag color="warning">已编辑未发布</Tag>}
        </Descriptions.Item>

        <Descriptions.Item label="创建时间">
          {new Date(connector.createTime).toLocaleString()}
        </Descriptions.Item>

        <Descriptions.Item label="更新时间" span={2}>
          {new Date(connector.updateTime).toLocaleString()}
        </Descriptions.Item>
      </Descriptions>
    </Card>
  );
}
