import { createCustomModel } from "@/common/createModel";
import type { IPaasFormSchema } from "@/components/IPaaSForm";
import type { FlowNodeJSON } from "@/components/WorkflowLayout/typings";
import { useRequest } from "ahooks";
import { useCallback, useLayoutEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import type { NodeOutputStructItem } from "../types";

export type WorkflowDetailData = {
  nodes: FlowNodeJSON[];
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  // 状态，draft: 草稿，published: 已发布，unpublished: 未发布
  status: "draft" | "published" | "unpublished";
  id: string;
};

export const WorkflowDetailModel = createCustomModel(() => {
  const { id } = useParams();

  useLayoutEffect(() => {
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, []);

  const { data, loading } = useRequest(
    async (): Promise<WorkflowDetailData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // TODO 查询接口
      return {
        id: id!,
        nodes: [
          {
            id: "start_0",
            type: "start",
            data: {
              name: "Start",
            },
            blocks: [],
          },
          {
            id: "custom_58whW",
            type: "custom",
            data: {
              name: "执行查询",
              description: "执行 SQL 查询并返回结果",
              connectorCode: "connector1",
              actionCode: "action1",
              version: 1,
              icon: "https://api.iconify.design/mdi:api.svg",
              outputStruct: [
                {
                  code: "result",
                  type: "object",
                  label: "结果",
                  children: [
                    {
                      code: "data",
                      label: "数据",
                      type: "string",
                    },
                  ],
                },
              ],

              sampleData: {
                result: {
                  data: "123",
                },
              },
            },
            blocks: [],
          },
          {
            id: "switch_Gro26",
            type: "switch",
            data: {
              name: "Switch",
            },
            blocks: [
              {
                id: "G2AY2",
                type: "case",
                data: {
                  name: "Case_0",
                },
                blocks: [
                  {
                    id: "custom_96gkk",
                    type: "custom",
                    data: {
                      name: "执行查询3",
                      description: "执行 SQL 查询并返回结果",
                      connectorCode: "connector1",
                      actionCode: "action1",
                      version: 1,
                      icon: "https://api.iconify.design/mdi:api.svg",
                      outputStruct: [
                        {
                          code: "result",
                          type: "object",
                          label: "结果",
                          children: [
                            {
                              code: "data",
                              label: "数据",
                              type: "string",
                            },
                          ],
                        },
                      ],
                    },
                    blocks: [],
                  },
                ],
              },
              {
                id: "vPmBH",
                type: "case",
                data: {
                  name: "Case_1",
                },
                blocks: [],
              },
              {
                id: "WBwr9",
                type: "caseDefault",
                data: {
                  name: "Default",
                },
                blocks: [],
              },
            ],
          },
          {
            id: "custom_3b2AN",
            type: "custom",
            data: {
              name: "执行查询2",
              description: "执行 SQL 查询并返回结果",
              connectorCode: "connector1",
              actionCode: "action1",
              version: 1,
              icon: "https://api.iconify.design/mdi:api.svg",
              outputStruct: [
                {
                  code: "result",
                  type: "object",
                  label: "结果",
                  children: [
                    {
                      code: "data",
                      label: "数据",
                      type: "string",
                    },
                  ],
                },
              ],
              inputs: {
                query: {
                  isExpression: true,
                },
              },
            },
            blocks: [],
          },
          {
            id: "end_0",
            type: "end",
            data: {
              name: "End",
            },
            blocks: [],
          },
        ],
        name: "Workflow 1",
        description: "Workflow 1 description",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: "unpublished",
      };
    },
    {
      refreshDeps: [id],
    }
  );

  return {
    workflowId: id,
    loading,
    workflowData: data!,
  };
});

export interface IPaaSConnector {
  code: string;
  name: string;
  description: string;
  icon: string;
  version: number;
}

export interface IPaaSConnectorAction {
  code: string;
  name: string;
  description: string;
  inputsSchema?: IPaasFormSchema[];
  outputsSchema?: NodeOutputStructItem[];
}

export const ConnectorSelectorModel = createCustomModel(() => {
  const { data } = useRequest(async () => {
    return [
      {
        code: "connector1",
        name: "HTTP 请求",
        description: "发送 HTTP 请求到外部 API",
        icon: "https://api.iconify.design/mdi:api.svg",
        version: 1,
      },
      {
        code: "connector2",
        name: "数据库",
        description: "连接并操作数据库",
        icon: "https://api.iconify.design/mdi:database.svg",
        version: 1,
      },
    ] as IPaaSConnector[];
  });

  // 缓存 Map: key = `${code}@${version}`
  const actionsCache = useRef<Map<string, IPaaSConnectorAction[]>>(new Map());

  const { runAsync: _queryIPaaSConnectorActions } = useRequest(
    async (opts: { code: string; version: number }) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return [
        {
          code: `action1`,
          name: "执行查询",
          description: "执行 SQL 查询并返回结果",
          inputsSchema: [
            {
              code: "query",
              name: "查询",
              type: "string",
              required: true,
              editor: {
                kind: "Input",
              },
            },
          ],
          outputsSchema: [
            {
              code: "result",
              type: "object",
              label: "结果",
              children: [
                {
                  code: "data",
                  label: "数据",
                  type: "string",
                },
              ],
            },
          ],
        },
        {
          code: `action2`,
          name: "插入数据",
          description: "向数据库表中插入新记录",
          inputsSchema: [
            {
              code: "data",
              name: "数据",
              type: "object",
              required: true,
              editor: {
                kind: "Input",
              },
            },
            {
              code: "table",
              name: "表",
              type: "string",
              required: true,
              editor: {
                kind: "Select",
                config: {
                  options: [
                    {
                      label: "表1",
                      value: "table1",
                    },
                  ],
                  placeholder: "请选择表",
                },
              },
            },
          ],
        },
      ] as IPaaSConnectorAction[];
    },
    {
      manual: true,
    }
  );

  // 带缓存的查询函数
  const queryIPaaSConnectorActions = useCallback(
    async (opts: { code: string; version: number }) => {
      const cacheKey = `${opts.code}@${opts.version}`;

      // 命中缓存，直接返回
      if (actionsCache.current.has(cacheKey)) {
        return actionsCache.current.get(cacheKey)!;
      }

      // 请求数据并缓存
      const result = await _queryIPaaSConnectorActions(opts);
      actionsCache.current.set(cacheKey, result);
      return result;
    },
    [_queryIPaaSConnectorActions]
  );

  const queryIPaaSConnectorAction = useCallback(
    async (opts: { code: string; version: number; actionCode: string }) => {
      const actions = await queryIPaaSConnectorActions(opts);
      const action = actions.find((a) => a.code === opts.actionCode);
      if (action) {
        return action;
      } else {
        throw new Error(`Action ${opts.actionCode} not found`);
      }
    },
    [queryIPaaSConnectorActions]
  );

  // 清除缓存（可选，用于刷新数据）
  const clearActionsCache = useCallback((key?: string) => {
    if (key) {
      actionsCache.current.delete(key);
    } else {
      actionsCache.current.clear();
    }
  }, []);

  return {
    iPaaSConnectors: data,
    queryIPaaSConnectorActions,
    queryIPaaSConnectorAction,
    clearActionsCache,
  };
});
