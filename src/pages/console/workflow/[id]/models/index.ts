import { createCustomModel } from "@/common/createModel";
import type { IPaasFormSchema } from "@/components/IPaaSForm";

import { useRequest } from "ahooks";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";
import type { NodeOutputStructItem } from "../types";
import { message, Modal } from "antd";
import type { WorkflowDetailData, WorkflowNoes } from "./types";
import { checkNameIsExist, trarverseNodes } from "./utils";
import { lightfishRequest } from "@/api/lightfishApi";

import type { Connector, ConnectorAction } from "@server/shared/connector";

export const WorkflowDetailModel = createCustomModel(() => {
  const { id } = useParams();
  const nav = useNavigate();
  const latestNodesRef = useRef<WorkflowNoes | null>(null);
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
      const wfData: WorkflowDetailData = {
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
      latestNodesRef.current = wfData.nodes;
      return wfData;
    },
    {
      refreshDeps: [id],
    },
  );

  const { runAsync: updateWorkflowNodes } = useRequest(
    async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return data;
    },
    {
      manual: true,
    },
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

  const getUniqueName = (name: string) => {
    const latestNodes = latestNodesRef.current;
    if (!latestNodes) {
      return name;
    }

    let baseName = name.trim();
    if (!baseName) throw new Error("name is empty");
    while (true) {
      if (!checkNameIsExist(baseName, latestNodes)) {
        return baseName;
      }
      const lastChar = baseName.at(-1);
      if (lastChar && !Number.isNaN(Number(lastChar))) {
        baseName = baseName.slice(0, -1);
      }
      const n = lastChar ? (Number.parseInt(lastChar) || 0) + 1 : "";
      baseName = `${baseName}${n}`;
    }
  };

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
    updateNodes: (latestNodes: WorkflowNoes) => {
      latestNodesRef.current = latestNodes;
    },
    getUniqueName,
  };
});

export const ConnectorSelectorModel = createCustomModel(() => {
  // 缓存 Map: key = `${code}@${version}`
  const actionsCache = useRef<Map<string, ConnectorAction[]>>(new Map());

  const { data: connectorList } = useRequest(() => {
    return lightfishRequest<Connector[]>("/connector/list").then((d) => {
      d.forEach((it) => {
        actionsCache.current.set(`${it.code}@${it.version}`, it.actions ?? []);
      });
      return d;
    });
  });

  const { runAsync: _queryIPaaSConnectorActions } = useRequest(
    async (opts: { code: string; version: string }) => {
      // 查询特定版本的 Actions
      message.error(`暂不考虑支持${opts.code}:${opts.version}`);
      return [];
    },
    {
      manual: true,
    },
  );

  // 带缓存的查询函数
  const queryIPaaSConnectorActions = useCallback(
    async (opts: { code: string; version: string }) => {
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
    [_queryIPaaSConnectorActions],
  );

  const queryIPaaSConnectorAction = useCallback(
    async (opts: { code: string; version: string; actionCode: string }) => {
      const actions = await queryIPaaSConnectorActions(opts);
      const action = actions.find((a) => a.code === opts.actionCode);
      if (action) {
        return action;
      } else {
        throw new Error(`Action ${opts.actionCode} not found`);
      }
    },
    [queryIPaaSConnectorActions],
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
    appConnectorList: connectorList?.filter((it) => it.actions?.length) || [],
    triggerConnectorList:
      connectorList?.filter((it) => it.triggers?.length) || [],
    queryIPaaSConnectorActions,
    queryIPaaSConnectorAction,
    clearActionsCache,
  };
});
