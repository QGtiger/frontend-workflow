import type { IPaasFormSchema } from "@/components/IPaaSForm";

type HttpMethod = "POST" | "GET" | "DELETE" | "PUT" | "PATCH";

interface ExcuteInfer {
  mode: "http" | "code";
  httpModeConfig: {
    method: HttpMethod;
    url: string;
    params: Record<string, string>;
    headers: Record<string, string>;
    body: Record<string, string>;
    hooks?: {
      pre?: string; // 请求前 request解析 解析脚本 (opts: {context: any, request: any}) => request
      post?: string; // 请求后 response 解析 不解析，默认返回原始数据
    };
  };
  codeModeConfig: {
    script: string; // 脚本执行
  };
}

// 输出数据结构
interface OutputStrcut {
  name: string;
  label: string;
  type: "string" | "number" | "boolean" | "object" | "array";
  children: OutputStrcut[];
}

type IpaasAuthProtocol = {
  type: "session_auth" | "app_key" | "none";
  doc?: string;
  inputs: Array<IPaasFormSchema>;
  // 授权本身就是对外部云计算服务，进行数据通信处理，获取三方 token
  excuteProtocol: ExcuteInfer;

  tokenConfig: {
    isAutoRefresh: true; //是否在token 失效的时候，自动刷新token
    // 自动刷新逻辑
    // 1. 被动刷新: 每次请求后， 判断响应 体中是否存在 token 失效的提示， 如果有则自动刷新 token
    // 2. 主动刷新: 配置token 有效时间， 下次使用授权前， 判断token 是否失效， 如果失效则自动刷新 token
    // refreshMode: 'passive' | 'active'; // 刷新模式
    activeTimesMs?: number; // 主动刷新时间 单位: 毫秒
    // 是否失效的判断
    // isTokenInvalidScript?: string; // 判断token 是否失效的脚本 (response: any) => boolean
  };

  outputs: OutputStrcut[];
};

type IpaasAction = {
  code: string;
  name: string;
  description: string;
  group: string;
  inputs: Array<IPaasFormSchema>;
  excuteProtocol: ExcuteInfer;
  outputs: OutputStrcut[];
};

type IpaasConnectorAuth = {
  id: number;

  name: string; // 授权名称
  code: string;

  inputs: Record<string, any>; // 授权输入
  outputs: Record<string, any>; // 授权输出

  createTime: number;
  updateTime: number;
};

type IpaasConnectorVersion = {
  version: number; // 版本号

  pubNote?: string; // 发布说明

  actions?: IpaasAction[]; // 动作列表

  isPublished: boolean; // 该版本是否发布
};

export interface IpaasConnectorDetail {
  id: number;
  code: string; // 连接器代码
  name: string; // 连接器名称
  description: string; // 连接器描述
  logo: string; // 连接器logo
  documentLink?: string; // 连接器帮助文档链接

  authProtocol?: IpaasAuthProtocol; // 认证协议

  status: 1 | 2 | 3; // 1: 未发布 2: 已发布 3: 已编辑未发布

  lastVersionId?: number;
  lastVersion?: IpaasConnectorVersion;
  auths: IpaasConnectorAuth[]; // 连接器认证列表
  createTime: number;

  updateTime: number;
}
