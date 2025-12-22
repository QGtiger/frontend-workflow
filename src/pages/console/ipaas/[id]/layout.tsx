import { Layout, Menu, Avatar, Tag, Button, Space } from "antd";
import {
  ArrowLeftOutlined,
  InfoCircleOutlined,
  KeyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { IPaaSDetailModalGuard, IpaasDetailModel } from "./models";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { useMemo } from "react";

const { Sider, Content } = Layout;

// 获取状态标签
function getStatusTag(status?: 1 | 2 | 3) {
  const statusMap = {
    1: { text: "未发布", color: "default" },
    2: { text: "已发布", color: "success" },
    3: { text: "已编辑", color: "warning" },
  };

  const config = statusMap[status || 1];
  return <Tag color={config.color}>{config.text}</Tag>;
}

function IpaasDetailContent() {
  const { connector } = IpaasDetailModel.useModel();
  const navigate = useNavigate();
  const location = useLocation();

  // 菜单配置项
  const menuItems = useMemo(() => {
    const baseUrl = `/console/ipaas/${connector.id}`;
    return [
      {
        key: baseUrl,
        icon: <InfoCircleOutlined />,
        label: "基本信息",
      },
      {
        key: `${baseUrl}/auth`,
        icon: <KeyOutlined />,
        label: "授权配置",
      },
      {
        key: `${baseUrl}/actions`,
        icon: <ThunderboltOutlined />,
        label: "执行操作",
      },
    ];
  }, [connector.id]);

  // 当前选中的菜单
  const selectedKey = useMemo(() => {
    const currentPath = location.pathname;
    // 找到匹配的菜单项
    const matched = menuItems.find((item) => currentPath === item.key);
    return matched ? matched.key : menuItems[0].key;
  }, [location.pathname, menuItems]);

  // 返回上级
  const handleGoBack = () => {
    navigate("/console/ipaas");
  };

  return (
    <Layout className="h-full">
      {/* 左侧菜单 */}
      <Sider
        width={268}
        className="bg-white! border-0 border-r! border-gray-200! border-solid!"
      >
        <div className="h-full flex flex-col">
          {/* 返回按钮 */}
          <div className="p-4 border-0 border-b border-gray-200 border-solid">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={handleGoBack}
              className="mb-3"
            >
              返回连接器列表
            </Button>

            {/* 连接器基本信息 */}
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Avatar
                src={connector.logo}
                shape="square"
                size={56}
                className="shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-base font-semibold text-gray-800 truncate">
                    {connector.name}
                  </span>
                  {getStatusTag(connector.status)}
                </div>
                <p className="text-xs text-gray-500 line-clamp-2 mb-0">
                  {connector.description}
                </p>
              </div>
            </div>
          </div>

          {/* 菜单列表 */}
          <div className="flex-1 overflow-auto py-2">
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              items={menuItems}
              onSelect={({ key }) => navigate(key)}
              className="border-none!"
            />
          </div>

          {/* 底部操作区 */}
          <div className="p-4 border-0 border-t border-gray-200 border-solid">
            <Space direction="vertical" className="w-full">
              <Button type="primary" block disabled={connector.status === 2}>
                {connector.status === 2 ? "已发布" : "发布连接器"}
              </Button>
              {connector.status === 3 && (
                <Button type="default" block>
                  查看变更
                </Button>
              )}
            </Space>
          </div>
        </div>
      </Sider>

      {/* 右侧内容区域 */}
      <Content className="bg-gray-50 overflow-auto">
        <div className="p-4 h-full">
          <Outlet />
        </div>
      </Content>
    </Layout>
  );
}

export default function IpaasDetailLayout() {
  return (
    <IpaasDetailModel.Provider>
      <IPaaSDetailModalGuard>
        <IpaasDetailContent />
      </IPaaSDetailModalGuard>
    </IpaasDetailModel.Provider>
  );
}
