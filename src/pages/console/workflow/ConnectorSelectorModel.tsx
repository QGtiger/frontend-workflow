import { lightfishRequest } from "@/api/lightfishApi";
import { createCustomModel } from "@/common/createModel";
import type {
  Connector,
  ConnectorAction,
  ConnectorTrigger,
} from "@server/shared/connector";
import { useRequest } from "ahooks";
import { Form, Input, message, Modal, type FormInstance } from "antd";
import { createRef, useCallback, useRef } from "react";
import { WorkflowLayoutModel } from "./models";
import { useNavigate } from "react-router-dom";
import { TriggerSelect } from "./components/TriggerSelect";

export const ConnectorSelectorModel = createCustomModel(() => {
  // 缓存 Map: key = `${code}@${version}`
  const actionsCache = useRef<Map<string, ConnectorAction[]>>(new Map());

  const { data: connectorList } = useRequest(() => {
    return lightfishRequest<Connector[]>("/connector/list").then((d) => {
      d.forEach((it) => {
        actionsCache.current.set(
          `${it.code}@${it.version}`,
          Array.prototype.concat.call([], it.actions ?? [], it.triggers ?? []),
        );
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

      console.log("queryIPaaSConnectorActions", opts, actionsCache.current);

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
    triggerConnectorList: (connectorList?.filter((it) => it.triggers?.length) ||
      []) as ConnectorTrigger[],
    queryIPaaSConnectorActions,
    queryIPaaSConnectorAction,
    clearActionsCache,
  };
});

function generateInitWorkflow({
  triggerCode,
  triggerList,
}: {
  triggerCode: string;
  triggerList: ConnectorTrigger[];
}): WorkflowNodeBlock[] {
  const triggerConnector = triggerList.find((it) =>
    it.triggers.some((t) => t.code === triggerCode),
  );
  const triggerItem = triggerConnector?.triggers.find(
    (t) => t.code === triggerCode,
  );
  if (!triggerItem || !triggerConnector)
    throw new Error(`trigger ${triggerCode} not found`);
  return [
    {
      id: "start_0",
      type: "start",
      data: {
        name: triggerItem.name,
        description: triggerItem.description,
        icon: triggerConnector.icon,
        connectorCode: triggerConnector.code,
        actionCode: triggerItem.code,
        version: triggerConnector.version,
        outputStruct: triggerItem.outputsSchema,
      },
      blocks: [],
    },
    {
      id: "end_0",
      type: "end",
      data: {},
      blocks: [],
    },
  ];
}

export function useCreateWorkflow() {
  const { triggerConnectorList } = ConnectorSelectorModel.useModel();
  const { refreshWorkflows } = WorkflowLayoutModel.useModel();
  const nav = useNavigate();

  const createWorkflow = (parentKey?: string) => {
    const formRef = createRef<FormInstance>();
    Modal.confirm({
      title: "新建工作流",
      icon: null,
      maskClosable: false,
      width: 1280,
      content: (
        <Form ref={formRef} layout="vertical">
          <div className="flex gap-4 w-full">
            <Form.Item
              className="w-1 flex-1"
              name="name"
              label="工作流名称"
              rules={[{ required: true, message: "请输入工作流名称" }]}
            >
              <Input placeholder="请输入工作流名称" />
            </Form.Item>
            <Form.Item
              className="w-1 flex-1"
              name="description"
              label="工作流描述"
            >
              <Input.TextArea
                placeholder="请输入工作流描述"
                rows={3}
                showCount
                maxLength={200}
              />
            </Form.Item>
          </div>
          <Form.Item
            name="triggerCode"
            label="触发动作"
            rules={[{ required: true, message: "请选择触发动作" }]}
          >
            <TriggerSelect triggers={triggerConnectorList} />
          </Form.Item>
        </Form>
      ),
      onOk() {
        return formRef.current
          ?.validateFields()
          .then((values) => {
            return lightfishRequest("/workflow/tree/create", {
              method: "POST",
              data: {
                title: values.name,
                parentKey,
                type: "workflow",
                name: values.name,
                description: values.description,
                // TODO: 根据选中的 triggerCode 构建初始节点（包含 start + trigger 节点）
                meta: generateInitWorkflow({
                  triggerCode: values.triggerCode,
                  triggerList: triggerConnectorList,
                }),
              },
            });
          })
          .then((d: any) => {
            refreshWorkflows();
            nav(`/console/workflow/${d.key}`);
          });
      },
    });
  };

  return { createWorkflow };
}
