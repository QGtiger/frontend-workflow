import { request } from "@/api";
import { useRequest } from "ahooks";
import {
  Form,
  Input,
  message,
  Modal,
  Upload,
  type FormInstance,
  type UploadFile,
  type UploadProps,
} from "antd";
import { createRef, useState } from "react";
import type { ConnectorItem } from "./types";
import ImgCrop from "antd-img-crop";
import { PlusOutlined } from "@ant-design/icons";
import { uploadFile } from "@/utils/url";

function UploadImageWithCrop(props: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [fileList, setFileList] = useState<UploadFile[]>(() => {
    if (props.value) {
      return [
        {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: props.value,
        },
      ];
    }
    return [];
  });

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // 如果有文件且状态为done，获取URL
    if (newFileList.length > 0 && newFileList[0].status === "done") {
      const url = newFileList[0].response?.url || newFileList[0].url;
      if (url) {
        props.onChange?.(url);
      }
    } else if (newFileList.length === 0) {
      // 文件被删除
      props.onChange?.("");
    }
  };

  const handlePreview: UploadProps["onPreview"] = (file) => {
    void (async () => {
      let src = file.url as string;
      if (!src && file.preview) {
        src = file.preview;
      }
      if (!src && file.originFileObj) {
        src = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(file.originFileObj as Blob);
          reader.onload = () => resolve(reader.result as string);
        });
      }

      const image = new Image();
      image.src = src;
      const imgWindow = window.open(src);
      if (imgWindow) {
        imgWindow.document.write(image.outerHTML);
      }
    })();
  };

  const customRequest: UploadProps["customRequest"] = (options) => {
    const { file, onSuccess, onError } = options;

    void (async () => {
      try {
        const url = await uploadFile(file as File);
        onSuccess?.({ url });
      } catch (error) {
        message.error("图片上传失败");
        onError?.(error as Error);
      }
    })();
  };

  return (
    <ImgCrop rotationSlider aspect={1} quality={1}>
      <Upload
        customRequest={customRequest}
        listType="picture-card"
        fileList={fileList}
        onChange={handleChange}
        onPreview={handlePreview}
        maxCount={1}
        accept="image/*"
      >
        <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>上传图片</div>
        </div>
      </Upload>
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
          label="Logo 图片"
          name="logoImage"
          rules={[
            { type: "url", message: "请输入有效的URL地址" },
            {
              required: true,
              message: "请上传Logo图片",
            },
          ]}
        >
          <UploadImageWithCrop />
        </Form.Item>
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
      return formRef.current?.validateFields().then((values) => {
        // 如果上传了图片，使用图片URL；否则使用手动输入的URL
        const logo = values.logoImage || values.logo;
        const finalValues = {
          ...values,
          logo,
        };
        delete finalValues.logoImage; // 删除临时字段
        return config.onConfirm(finalValues);
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
