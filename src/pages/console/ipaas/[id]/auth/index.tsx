import { Card, Tabs, Form, Button, type TabsProps } from "antd";
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

export default function IpaasAuthConfig() {
  const [form] = Form.useForm();

  const authType = Form.useWatch("type", form);

  const { runAsync, loading } = useRequest(
    async () => {
      return form.validateFields().then(console.log);
    },
    {
      manual: true,
    }
  );

  // 保存授权配置
  // const handleSave = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     setLoading(true);

  //     await request({
  //       url: "/ipaas/connector/auth/update",
  //       method: "POST",
  //       data: {
  //         connectorId: connector.id,
  //         authProtocol: values,
  //       },
  //     });

  //     message.success("授权配置保存成功");
  //     await refreshAsync();
  //   } catch (error) {
  //     console.error("保存失败:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

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
      <Form form={form} layout="vertical" className="">
        <Tabs defaultActiveKey="1" items={items}></Tabs>
      </Form>
    </Card>
  );
}
