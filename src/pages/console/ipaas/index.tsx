import {
  Card,
  Row,
  Col,
  Statistic,
  Button,
  Input,
  Modal,
  Form,
  Empty,
  Spin,
  Avatar,
  Tag,
  Space,
  Tooltip,
  Typography,
  message,
} from "antd";
import {
  PlusOutlined,
  AppstoreOutlined,
  LinkOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState, useMemo } from "react";
import { request } from "@/api";
import { useRequest } from "ahooks";
import type { ConnectorItem } from "./types";
import { createConnectorModal } from "./baseConnectorModal";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph, Text } = Typography;

const now = Date.now();

function ConnectorItemCard({
  connector,
  onDelSuc,
}: {
  connector: ConnectorItem;
  onDelSuc?: () => Promise<any>;
}) {
  const daysSinceCreated = useMemo(() => {
    return (now - connector.createTime) / (1000 * 60 * 60 * 24);
  }, [connector.createTime]);
  const nav = useNavigate();

  // 处理删除连接器
  const handleDeleteConnector = () => {
    Modal.confirm({
      title: "确认删除",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除连接器 "${connector.name}" 吗？此操作不可恢复。`,
      okText: "删除",
      okType: "danger",
      cancelText: "取消",
      onOk: () =>
        request({
          url: "/ipaas/connector/delete",
          method: "POST",
          data: { connectorId: connector.id },
        }).then(() => onDelSuc?.()),
    });
  };

  return (
    <Card
      hoverable
      className="h-full shadow-sm hover:shadow-lg transition-shadow"
      onClick={() => {
        nav(`/console/ipaas/${connector.id}`);
      }}
      cover={
        <img
          src={connector.logo}
          alt={connector.name}
          className="h-[120px] inline-block object-cover"
        />
      }
      actions={[
        connector.documentLink ? (
          <Tooltip title="查看文档" key="docs-tooltip">
            <a
              href={connector.documentLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
            >
              <LinkOutlined />
            </a>
          </Tooltip>
        ) : (
          <Tooltip title="暂无文档" key="no-docs-tooltip">
            <LinkOutlined className="text-gray-300 cursor-not-allowed" />
          </Tooltip>
        ),
        <Tooltip title="删除连接器" key="delete-tooltip">
          <DeleteOutlined
            className="text-red-500 hover:text-red-600"
            onClick={handleDeleteConnector}
          />
        </Tooltip>,
      ]}
    >
      <Card.Meta
        title={
          <div className="flex items-center justify-between">
            <span className="truncate">{connector.name}</span>
            {daysSinceCreated <= 7 && (
              <Tag color="blue" className="ml-2">
                NEW
              </Tag>
            )}
          </div>
        }
        description={
          <div>
            <Paragraph ellipsis={{ rows: 2 }} className="text-gray-500 mb-2!">
              {connector.description}
            </Paragraph>
            {
              <Text type="secondary" className="text-xs">
                创建于 {new Date(connector.createTime).toLocaleDateString()}
              </Text>
            }
          </div>
        }
      />
    </Card>
  );
}

function IPaaSContent() {
  const [searchText, setSearchText] = useState("");

  // 获取连接器列表
  const {
    data: connectors = [],
    loading,
    refreshAsync,
    refresh,
  } = useRequest(async () => {
    return request<ConnectorItem[]>({
      url: "/ipaas/connector/list",
      method: "GET",
    });
  });

  const showCreateConnectorModal = () => {
    createConnectorModal({
      async onConfirm(data) {
        return request<ConnectorItem>({
          url: "/ipaas/connector/create",
          method: "POST",
          data,
        })
          .then(refresh)
          .then(() => {
            message.success("连接器创建成功");
          });
      },
    });
  };

  // 过滤连接器
  const filteredConnectors = useMemo(() => {
    return connectors.filter(
      (item) =>
        item.name.toLowerCase().includes(searchText.toLowerCase()) ||
        item.description.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [connectors, searchText]);

  // 统计数据
  const stats = useMemo(() => {
    const total = connectors.length;
    const withDocs = connectors.filter((c) => c.documentLink).length;
    const recentlyAdded = connectors.filter(
      (c) => (now - c.createTime) / (1000 * 60 * 60 * 24) <= 7
    ).length;

    return { total, withDocs, recentlyAdded };
  }, [connectors]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-50">
      {/* Header Section */}
      <div className="bg-linear-to-r from-blue-500 to-blue-600 px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Title level={2} className="text-white! mb-2!">
                <AppstoreOutlined className="mr-3" />
                iPaaS 连接器管理
              </Title>
              <Paragraph className="text-blue-50! mb-6! text-base">
                集成平台即服务（iPaaS）连接器库，连接您的应用程序和数据源，实现无缝集成
              </Paragraph>
            </div>
          </div>

          {/* Statistics Cards */}
          <Row gutter={16} className="mt-6">
            <Col span={8}>
              <Card className="shadow-md" bordered={false}>
                <Statistic
                  title={<span className="text-gray-600">连接器总数</span>}
                  value={stats.total}
                  prefix={<AppstoreOutlined className="text-blue-500" />}
                  valueStyle={{ color: "#1890ff" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="shadow-md" bordered={false}>
                <Statistic
                  title={<span className="text-gray-600">含文档连接器</span>}
                  value={stats.withDocs}
                  prefix={<LinkOutlined className="text-green-500" />}
                  valueStyle={{ color: "#52c41a" }}
                  suffix={<span className="text-sm">/ {stats.total}</span>}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card className="shadow-md" bordered={false}>
                <Statistic
                  title={<span className="text-gray-600">近7天新增</span>}
                  value={stats.recentlyAdded}
                  prefix={<ClockCircleOutlined className="text-orange-500" />}
                  valueStyle={{ color: "#fa8c16" }}
                />
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Search Bar */}
        <div className="mb-6 flex gap-4 items-center">
          <Input
            size="large"
            placeholder="搜索连接器名称或描述..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            allowClear
            className="shadow-sm"
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={showCreateConnectorModal}
          >
            新建连接器
          </Button>
        </div>

        {/* Connectors Grid */}
        {filteredConnectors.length === 0 ? (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              searchText ? "未找到匹配的连接器" : "暂无连接器，快来创建第一个吧"
            }
            className=" mt-20!"
          >
            {!searchText && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={showCreateConnectorModal}
              >
                创建连接器
              </Button>
            )}
          </Empty>
        ) : (
          <Row gutter={[16, 16]}>
            {filteredConnectors.map((connector) => (
              <Col xs={24} sm={12} md={8} lg={6} key={connector.id}>
                <ConnectorItemCard
                  connector={connector}
                  onDelSuc={refreshAsync}
                />
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
}

export default function IpaasOverview() {
  return <IPaaSContent />;
}
