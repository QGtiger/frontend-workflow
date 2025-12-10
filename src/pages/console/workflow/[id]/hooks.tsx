import { createCustomModel } from "@/common/createModel";
import type { FlowNodeRegistry } from "@/components/WorkflowLayout/typings";
import { useReactive, useRequest } from "ahooks";
import { Input, List, Modal, Skeleton, Space, Tag, Typography } from "antd";
import { useMemo, useState } from "react";

interface IPaaSConnector {
  code: string;
  name: string;
  description: string;
  icon: string;
  version: string;
}

interface IPaaSConnectorAction {
  code: string;
  name: string;
  description: string;
}

const ConnectorSelectorModel = createCustomModel(() => {
  const { data } = useRequest(async () => {
    return [
      {
        code: "connector1",
        name: "Connector 1",
        description: "Connector 1 description",
        icon: "https://picsum.photos/200/300",
      },
    ] as IPaaSConnector[];
  });

  const { runAsync: queryIPaaSConnectorActions } = useRequest(
    async (opts: { code: string; version: string }) => {
      return [
        {
          code: `${opts.code}.${opts.version}.action1`,
          name: "Action 1",
          description: "Action 1 description",
        },
        {
          code: `${opts.code}.${opts.version}.action2`,
          name: "Action 2",
          description: "Action 2 description",
        },
      ] as IPaaSConnectorAction[];
    },
    {
      manual: true,
    }
  );

  return {
    iPaaSConnectors: data,
    queryIPaaSConnectorActions,
  };
});

function ConnectorSelectorContent({
  builtInLogicNodes,
  onSelect,
}: {
  onSelect: (registry: FlowNodeRegistry) => void;
  builtInLogicNodes: FlowNodeRegistry[];
}) {
  const { iPaaSConnectors, queryIPaaSConnectorActions } =
    ConnectorSelectorModel.useModel();
  const [connectorSearch, setConnectorSearch] = useState("");
  const viewModel = useReactive({
    activeCode: "",
  });

  const { activeCode } = viewModel;

  const builtInNodes = useMemo(() => {
    return builtInLogicNodes.map((c) => {
      return {
        code: String(c.type),
        name: c.info.name,
        description: c.info.description,
        icon: c.info.icon,
      };
    });
  }, [builtInLogicNodes]);

  const connectors = useMemo(() => {
    const q = connectorSearch.trim().toLowerCase();

    const allItems = [
      {
        type: "built-in",
        name: "内置逻辑节点",
        description: "内置逻辑节点",
        items: builtInNodes.filter((c) => {
          if (!q) return true;
          return (
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.description.toLowerCase().includes(q)
          );
        }),
      },
      {
        type: "iPaaS",
        name: "IPaaS连接器",
        description: "IPaaS连接器",
        items:
          iPaaSConnectors?.filter((c) => {
            if (!q) return true;
            return (
              c.code.toLowerCase().includes(q) ||
              c.name.toLowerCase().includes(q) ||
              c.description.toLowerCase().includes(q)
            );
          }) ?? [],
      },
    ];
    return allItems;
  }, [iPaaSConnectors, builtInNodes, connectorSearch]);

  const { data: actions } = useRequest(
    async () => {
      if (!activeCode) return [];
      const builtInNode = connectors[0].items.find(
        (c) => c.code === activeCode
      );
      if (builtInNode) {
        return {
          ...builtInNode,
          kind: "动作",
        };
      }
      return queryIPaaSConnectorActions({ code: activeCode, version: "1.0.0" });
    },
    {
      refreshDeps: [activeCode],
    }
  );

  return (
    <div className="flex h-[480px] text-gray-900  overflow-hidden ">
      {/* 左侧：连接器列表 */}
      <div className="w-72 border-r border-gray-200 flex flex-col">
        <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
          <Typography.Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
            连接器
          </Typography.Text>
          <Input
            size="small"
            className="mt-2"
            placeholder="搜索连接器..."
            allowClear
            value={connectorSearch}
            onChange={(e) => setConnectorSearch(e.target.value)}
          />
        </div>
        <div className="flex-1 overflow-auto bg-white"></div>
      </div>

      {/* 右侧：操作列表 */}
      <div className="flex-1 flex flex-col bg-white">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="min-w-0">
            <Typography.Text className="text-xs font-medium text-gray-500 uppercase tracking-wide">
              可用操作
            </Typography.Text>
            {active ? (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-sm font-medium text-gray-900 truncate">
                  {String(active.type)}
                </span>
                <Tag color="blue" className="m-0!">
                  Connector
                </Tag>
              </div>
            ) : (
              <div className="mt-1 text-xs text-gray-500">
                请选择左侧的连接器
              </div>
            )}
          </div>
          <div className="w-56">
            <Input
              size="small"
              className=""
              placeholder="搜索操作..."
              allowClear
              value={actionSearch}
              onChange={(e) => setActionSearch(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-auto p-5 bg-white">
          {!active && (
            <div className="h-full flex items-center justify-center text-gray-500 text-sm">
              请选择左侧连接器以查看可用操作
            </div>
          )}
          {active && !actions.length && (
            <Skeleton active paragraph={{ rows: 3 }} />
          )}
          {active && filteredActions.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredActions.map((action) => (
                <button
                  key={action.id}
                  className="text-left group rounded-lg border border-gray-200 bg-white hover:bg-blue-50 hover:border-blue-200 transition-all p-4 focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                  onClick={() => active && onSelect(active)}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-gray-900">
                      {action.name}
                    </span>
                    <Tag
                      color={action.kind === "触发器" ? "purple" : "green"}
                      className="m-0!"
                    >
                      {action.kind}
                    </Tag>
                  </div>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function useConnectorSelectorModal() {
  const [modal, modalContextHolder] = Modal.useModal();

  const showConnectorSelectorModal = (config: {
    builtInNodes: FlowNodeRegistry[];
    add: (registry: FlowNodeRegistry) => void;
  }) => {
    const ins = modal.confirm({
      width: 960,
      icon: null,
      title: null,
      footer: null,
      centered: true,
      closable: true,
      maskClosable: false,
      className: "connector-selector-modal ",
      classNames: {
        container: "p-0! overflow-hidden",
      },
      content: (
        <ConnectorSelectorContent
          config={{ builtInNodes: config.builtInNodes, add: config.add }}
          onSelect={(registry) => {
            config.add(registry);
            ins.destroy();
          }}
        />
      ),
    });
    return ins;
  };

  return {
    showConnectorSelectorModal,
    showConnectorSelectorModalContextHolder: (
      <ConnectorSelectorModel.Provider>
        {modalContextHolder}
      </ConnectorSelectorModel.Provider>
    ),
  };
}
