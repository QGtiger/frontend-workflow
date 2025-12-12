import type { IPaasCommonFormFieldProps } from "../../type";

const textAsFile = (text: string, fileExtension: string = "txt") => {
  // 创建一个Blob对象，其内容是文本数据
  const blob = new Blob([text], { type: "text/plain" });

  // 生成文件名：当前时间戳_随机数.fileExtension
  const timestamp = new Date().getTime();
  const random = Math.floor(Math.random() * 1000);
  const filename = `text_${timestamp}_${random}.${fileExtension}`;

  // 创建一个File对象
  const file = new File([blob], filename, { type: "text/plain" });
  return file;
};

export type IPaasUploadProps = IPaasCommonFormFieldProps;

const CustomUpload = (props: IPaasUploadProps) => {
  return "CustomUpload";
};

export default CustomUpload;
