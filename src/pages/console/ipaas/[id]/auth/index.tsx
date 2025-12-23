import { Card, Tabs, Form, Button, type TabsProps, message } from "antd";
import {
  KeyOutlined,
  SaveOutlined,
  FileTextOutlined,
  FormOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { BaseConfig } from "./BaseConfig";
import { InputsEditor } from "./InputsEditor";
import { ExecuteEditor } from "./ExecuteEditor";
import { useRequest } from "ahooks";
import { request } from "@/api";
import { IpaasDetailModel } from "../models";

export default function IpaasAuthConfig() {
  const { connector, refreshAsync } = IpaasDetailModel.useModel();
  const [form] = Form.useForm();

  const authType = Form.useWatch("type", form);

  const { runAsync, loading } = useRequest(
    async () => {
      return form.validateFields().then((data) => {
        return request({
          url: "/ipaas/connector/update",
          method: "POST",
          data: {
            authProtocol: data,
            connectorId: connector.id,
          },
        }).then(() => {
          message.success("授权配置保存成功");
          refreshAsync();
        });
      });
    },
    {
      manual: true,
    }
  );

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "基本配置",
      children: <BaseConfig />,
      icon: <FileTextOutlined />,
    },
    {
      key: "2",
      label: "输入配置",
      children: <InputsEditor />,
      icon: <FormOutlined />,
      disabled: authType === "none" || !authType,
    },
    {
      key: "3",
      label: "执行协议",
      children: <ExecuteEditor />,
      icon: <ThunderboltOutlined />,
      disabled: authType !== "session_auth",
    },
  ];

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <KeyOutlined />
          <span>授权配置</span>
        </div>
      }
      extra={
        <Button
          type="primary"
          icon={<SaveOutlined />}
          onClick={runAsync}
          loading={loading}
        >
          保存配置
        </Button>
      }
      className="h-full flex flex-col"
      bodyStyle={{
        overflow: "auto",
      }}
    >
      <Form
        form={form}
        initialValues={connector.authProtocol}
        layout="vertical"
        className=""
      >
        <Tabs defaultActiveKey="1" items={items}></Tabs>
      </Form>
    </Card>
  );
}
