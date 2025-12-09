import { Button, Typography, Card, Row, Col } from "antd";
import {
  ThunderboltOutlined,
  ApiOutlined,
  SafetyOutlined,
  RocketOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: <ThunderboltOutlined className="text-3xl text-blue-500" />,
    title: "可视化编排",
    description: "拖拽式节点编辑，直观构建复杂业务流程，无需编写代码",
  },
  {
    icon: <ApiOutlined className="text-3xl text-green-500" />,
    title: "丰富的节点类型",
    description: "内置条件判断、循环、分支等多种节点，满足各类业务场景",
  },
  {
    icon: <SafetyOutlined className="text-3xl text-orange-500" />,
    title: "稳定可靠",
    description: "经过大规模生产验证，提供高可用的工作流执行引擎",
  },
  {
    icon: <RocketOutlined className="text-3xl text-purple-500" />,
    title: "快速部署",
    description: "一键发布工作流，支持版本管理与灰度发布",
  },
];

export default function Index() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-linear-to-br from-slate-50 to-blue-50">
      {/* 中间内容：居中显示 */}
      <div className="flex-1 flex items-center">
        <div className="w-full max-w-5xl mx-auto px-6">
          {/* Hero 区域 */}
          <div className="text-center">
            <Typography.Title level={1} className="mb-4!">
              <span className="bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Workflow Editor
              </span>
            </Typography.Title>
            <Typography.Paragraph className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
              强大的可视化工作流编辑器，让复杂的业务流程变得简单直观。
              <br />
              通过拖拽节点快速构建、测试和部署您的自动化工作流。
            </Typography.Paragraph>
            <div className="flex justify-center gap-4">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate("/console/workflow")}
              >
                开始使用
              </Button>
              <Button size="large">了解更多</Button>
            </div>
          </div>

          {/* 特性介绍 */}
          <div className="mt-12">
            <Row gutter={[24, 24]}>
              {features.map((feature) => (
                <Col xs={24} sm={12} key={feature.title}>
                  <Card
                    hoverable
                    className="h-full border-none shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                        {feature.icon}
                      </div>
                      <div>
                        <Typography.Title level={5} className="mb-1!">
                          {feature.title}
                        </Typography.Title>
                        <Typography.Text type="secondary">
                          {feature.description}
                        </Typography.Text>
                      </div>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      </div>

      {/* 底部：固定在页面底部 */}
      <div className="py-4 text-center border-t border-gray-200 bg-white/60 shrink-0">
        <Typography.Text type="secondary" className="text-sm">
          © 2024 Workflow Editor. Built with ❤️
        </Typography.Text>
      </div>
    </div>
  );
}
