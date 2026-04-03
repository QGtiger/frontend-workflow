import { Card, Table, Button, Tag, Typography, Popconfirm, Space } from "antd";
import {
  ThunderboltOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { IpaasDetailModel } from "../models";
import type { IpaasAction } from "../type";

export default function IpaasActionsConfig() {
  const { connector } = IpaasDetailModel.useModel();
  const actions = connector.lastVersion?.actions || [];

  const handleAdd = () => {
    // TODO: 打开添加操作弹窗
    console.log("添加操作");
  };

  const handleEdit = (record: IpaasAction) => {
    // TODO: 打开编辑操作弹窗
    console.log("编辑操作", record);
  };

  const handleDelete = (code: string) => {
    // TODO: 删除操作
    console.log("删除操作", code);
  };

  const columns: ColumnsType<IpaasAction> = [
    {
      title: "操作代码",
      dataIndex: "code",
      width: 150,
      render: (code: string) => (
        <Typography.Text code>{code}</Typography.Text>
      ),
    },
    {
      title: "操作名称",
      dataIndex: "name",
      width: 180,
      render: (name: string) => (
        <Typography.Text strong>{name}</Typography.Text>
      ),
    },
    {
      title: "描述",
      dataIndex: "description",
      ellipsis: true,
    },
    {
      title: "分组",
      dataIndex: "group",
      width: 120,
      render: (group: string) => (
        <Tag color="blue">{group || "-"}</Tag>
      ),
    },
    {
      title: "执行协议",
      width: 120,
      render: (record: IpaasAction) => {
        const mode = record.excuteProtocol?.mode;
        return (
          <Tag color={mode === "http" ? "green" : "purple"}>
            {mode === "http" ? "HTTP" : mode === "code" ? "代码" : "-"}
          </Tag>
        );
      },
    },
    {
      title: "输入参数",
      width: 100,
      render: (record: IpaasAction) => {
        const count = record.inputs?.length || 0;
        return <Typography.Text>{count} 个</Typography.Text>;
      },
    },
    {
      title: "输出参数",
      width: 100,
      render: (record: IpaasAction) => {
        const count = record.outputs?.length || 0;
        return <Typography.Text>{count} 个</Typography.Text>;
      },
    },
    {
      title: "操作",
      width: 120,
      fixed: "right",
      render: (record: IpaasAction) => (
        <Space>
          <Typography.Link
            onClick={() => handleEdit(record)}
            style={{ fontSize: 14 }}
          >
            <EditOutlined /> 编辑
          </Typography.Link>
          <Popconfirm
            title="确认删除此操作?"
            onConfirm={() => handleDelete(record.code)}
            okText="确认"
            cancelText="取消"
          >
            <Typography.Link type="danger" style={{ fontSize: 14 }}>
              <DeleteOutlined /> 删除
            </Typography.Link>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <ThunderboltOutlined />
          <span>执行操作</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          添加操作
        </Button>
      }
      className="h-full flex flex-col"
      bodyStyle={{
        overflow: "auto",
        flex: 1,
      }}
    >
      <Table
        columns={columns}
        dataSource={actions}
        rowKey="code"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `共 ${total} 条`,
        }}
        scroll={{ x: 1200 }}
        size="middle"
      />
    </Card>
  );
}
