// webhook 触发器的定义

import { Connector } from "../connector";
import { SchemaFormItemType } from "../schemaFormType.ts";
import { generateTriggerOutputs } from "./utils.ts";

const webhookOutputs = generateTriggerOutputs([
  {
    code: "body",
    label: "请求体(解析后)",
    type: "object",
  },
  {
    code: "headers",
    label: "请求头(解析后)",
    type: "object",
  },
  {
    code: "path",
    label: "请求路径",
    type: "string",
  },
  {
    code: "query",
    label: "请求参数",
    type: "object",
  },
  {
    code: "method",
    label: "请求方法",
    type: "string",
  },
]);

const webhookFormItem: SchemaFormItemType = {
  code: "webhookUrl",
  name: "回调地址",
  type: "string",
  editor: {
    kind: "inputWithCopy",
    config: {
      copyText: "https://example.com/webhook/233",
    },
  },
};

export const webhookTrigger: Connector = {
  code: "webhook",
  name: "Webhook 触发器",
  description: "通过 HTTP 请求触发工作流",
  icon: "https://api.iconify.design/mdi:webhook.svg",
  version: "1.0.0",
  triggers: [
    {
      code: "webhook-sync-trigger",
      name: "同步触发器",
      description: "Webhook 同步触发器，整体工作流执行完毕之后再返回结果",
      inputsSchema: [
        webhookFormItem,
        {
          code: "timeout",
          name: "超时时间",
          description: "同步Webhook触发器的工作流最大执行时间(ms)",
          type: "number",
          editor: {
            kind: "numberInput",
            config: {
              placeholder: "请输入超时时间",
              min: 1,
              max: 60000,
              defaultValue: 10000,
            },
          },
        },
      ],
      outputsSchema: webhookOutputs,
    },
    {
      code: "webhook-trigger-async",
      name: "异步WebHook触发器",
      description: "异步触发",
      inputsSchema: [webhookFormItem],
      outputsSchema: webhookOutputs,
    },
  ],
};
