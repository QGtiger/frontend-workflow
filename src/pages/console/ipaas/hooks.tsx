import { request } from "@/api";
import { useRequest } from "ahooks";
import { Form, Input, message, Modal, Upload, type FormInstance } from "antd";
import { createRef } from "react";
import type { ConnectorItem } from "./types";
import ImgCrop from "antd-img-crop";

function UploadImageWithCrop(props: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <ImgCrop rotationSlider>
      {/* <Upload
    action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
    listType="picture-card"
    fileList={fileList}
    onChange={onChange}
    onPreview={onPreview}
  >
    {fileList.length < 5 && '+ Upload'}
  </Upload> */}
    </ImgCrop>
  );
}

function createConnectorModal(config: {
  onConfirm: (values: CreateConnectorDto) => Promise<any>;
}) {
  const formRef = createRef<FormInstance>();
  return Modal.confirm({
    icon: null,
    title: "新建连接器",
    maskClosable: false,
    content: (
      <Form
        ref={formRef}
        layout="vertical"
        className="mt-4"
        requiredMark="optional"
      >
        <Form.Item
          label="连接器名称"
          name="name"
          rules={[
            { required: true, message: "请输入连接器名称" },
            { max: 50, message: "名称不能超过50个字符" },
          ]}
        >
          <Input placeholder="例如：Salesforce、Slack、GitHub" />
        </Form.Item>

        <Form.Item
          label="连接器描述"
          name="description"
          rules={[
            { required: true, message: "请输入连接器描述" },
            { max: 200, message: "描述不能超过200个字符" },
          ]}
        >
          <Input.TextArea
            placeholder="请输入连接器的详细描述..."
            rows={4}
            showCount
            maxLength={200}
          />
        </Form.Item>

        <Form.Item
          label="Logo URL"
          name="logo"
          rules={[
            { required: true, message: "请输入Logo URL" },
            { type: "url", message: "请输入有效的URL地址" },
          ]}
        >
          <Input placeholder="https://example.com/logo.png" />
        </Form.Item>

        <Form.Item
          label="帮助文档链接"
          name="documentLink"
          rules={[{ type: "url", message: "请输入有效的URL地址" }]}
        >
          <Input placeholder="https://example.com/docs（可选）" />
        </Form.Item>
      </Form>
    ),
    width: 600,
    async onOk() {
      return formRef.current?.validateFields().then((v) => {
        return config.onConfirm(v);
      });
    },
  });
}

interface CreateConnectorDto {
  name: string;
  description: string;
  logo: string;
  documentLink?: string;
}

export function useCreateConnectorModal(props?: { onSuc?(): Promise<any> }) {
  const { runAsync } = useRequest(
    async (data: CreateConnectorDto) => {
      await request<ConnectorItem>({
        url: "/ipaas/connector/create",
        method: "POST",
        data,
      });
      message.success("连接器创建成功");
      await props?.onSuc?.();
    },
    {
      manual: true,
    }
  );

  return () => {
    createConnectorModal({
      onConfirm: runAsync,
    });
  };
}
