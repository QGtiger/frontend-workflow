import { createCustomModel } from "@/common/createModel";
import type { IPaasFormSchema } from "@/components/IPaaSForm";
import type { FlowNodeJSON } from "@/components/WorkflowLayout/typings";
import { useRequest } from "ahooks";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import type { NodeOutputStructItem } from "../types";
import { Modal } from "antd";

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
  const nav = useNavigate();
  const latestNodesRef = useRef<WorkflowDetailData["nodes"] | null>(null);
  const isRouterBlockPassRef = useRef(false);

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

  const { runAsync: updateWorkflowNodes } = useRequest(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    {
      manual: true,
    }
  );

  const checkChange = useCallback(() => {
    const latestNodes = latestNodesRef.current;
    if (!latestNodes || !data) {
      return;
    }
    if (JSON.stringify(latestNodes) !== JSON.stringify(data?.nodes)) {
      return true;
    }
  }, [data]);

  useBlocker(({ nextLocation }) => {
    if (isRouterBlockPassRef.current) return false;
    if (checkChange()) {
      const go = () => {
        isRouterBlockPassRef.current = true;
        nav(nextLocation);
      };
      Modal.confirm({
        icon: null,
        title: "当前改动未保存",
        content: "切换页面未保存内容较会丢失, 是否保存已编辑内容",
        okText: "保存并跳转",
        cancelText: "不保存跳转",
        async onOk() {
          return updateWorkflowNodes().then(go);
        },
        onCancel: go,
      });
      return true;
    }
    return false;
  });

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (checkChange()) {
        e.preventDefault();
        e.returnValue = "您有未保存的节点配置错误，确定要离开吗？";
        return e.returnValue;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [checkChange]);

  return {
    workflowId: id,
    loading,
    workflowData: data!,
    updateNodes: (latestNodes: WorkflowDetailData["nodes"]) => {
      latestNodesRef.current = latestNodes;
    },
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
