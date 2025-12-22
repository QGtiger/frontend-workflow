export interface ConnectorItem {
  id: number;
  name: string;
  description: string;
  logo: string;
  documentLink?: string;
  createTime: number;
  updateTime: number;
  status?: 1 | 2 | 3; // 1: 未发布 2: 已发布 3: 已编辑未发布
}
