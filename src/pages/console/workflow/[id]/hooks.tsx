import type {
  FlowNodeJSON,
  FlowNodeRegistry,
} from "@/components/WorkflowLayout/typings";
import { useRequest } from "ahooks";
import { Input, Modal, Segmented, Empty, message } from "antd";
import { useMemo, useState } from "react";
import {
  SearchOutlined,
  AppstoreOutlined,
  ApiOutlined,
} from "@ant-design/icons";
import {
  ConnectorListItem,
  type ConnectorItem,
} from "./components/ConnectorSelectorModal/ConnectorListItem";
import classNames from "classnames";
import { ScrollArea } from "@/components/ScrollArea";
import { generateCustomNodeData } from "./utils";
import { ConnectorSelectorModel } from "./models";
import {
  FlowNodeEntity,
  useClientContext,
} from "@flowgram.ai/fixed-layout-editor";
import type { NodeOutputStructItem } from "./types";

function ConnectorSelectorContent({
  builtInLogicNodes,
  onSelect,
  from,
}: {
  onSelect: (dataJson: FlowNodeJSON) => void;
  builtInLogicNodes: FlowNodeRegistry[];
  from: FlowNodeEntity;
}) {
  const { iPaaSConnectors, queryIPaaSConnectorActions } =
    ConnectorSelectorModel.useModel();

  const [connectorSearch, setConnectorSearch] = useState("");
  const [actionSearch, setActionSearch] = useState("");
  const [category, setCategory] = useState<"all" | "built-in" | "app">("all");
  const [activeConnector, setActiveConnector] = useState<ConnectorItem | null>(
    null
  );

  const context = useClientContext();

  // 转换内置节点为统一格式
  const builtInConnectors: ConnectorItem[] = useMemo(() => {
    return builtInLogicNodes
      .map((c) => ({
        code: String(c.type),
        name: c.info.name || c.info.description || String(c.type),
        description: c.info.description,
        icon: c.info.icon,
        category: "built-in" as const,
        registry: c,
      }))
      .filter((it) => it.registry?.canAdd?.(context, from) ?? true);
  }, [builtInLogicNodes, context, from]);

  // 转换 iPaaS 连接器为统一格式
  const appConnectors: ConnectorItem[] = useMemo(() => {
    return (
      iPaaSConnectors?.map((c) => ({
        code: c.code,
        name: c.name,
        description: c.description,
        icon: c.icon,
        category: "app" as const,
        version: c.version,
      })) ?? []
    );
  }, [iPaaSConnectors]);

  // 根据搜索和分类过滤连接器
  const filteredConnectors = useMemo(() => {
    const q = connectorSearch.trim().toLowerCase();
    const all = [...builtInConnectors, ...appConnectors];

    return all.filter((c) => {
      const matchesSearch =
        !q ||
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q);
      const matchesCategory = category === "all" || c.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [builtInConnectors, appConnectors, connectorSearch, category]);

  // 分组连接器
  const groupedConnectors = useMemo(() => {
    return {
      "built-in": filteredConnectors.filter((c) => {
        return c.category === "built-in";
      }),
      app: filteredConnectors.filter((c) => c.category === "app"),
    };
  }, [filteredConnectors]);

  // 获取选中连接器的操作列表
  const { data: actions, loading: actionsLoading } = useRequest(
    async () => {
      if (!activeConnector) return [];

      // 内置节点直接返回单个动作
      if (activeConnector.category === "built-in" && activeConnector.registry) {
        return [
          {
            code: activeConnector.code,
            name: `添加 ${activeConnector.name}`,
            description: activeConnector.description,
            registry: activeConnector.registry,
          },
        ];
      }

      // iPaaS 连接器查询操作列表
      if (activeConnector.version) {
        const result = await queryIPaaSConnectorActions({
          code: activeConnector.code,
          version: activeConnector.version,
        });
        return result.map((a) => ({ ...a, registry: undefined }));
      }

      return [];
    },
    {
      refreshDeps: [activeConnector?.code],
    }
  );

  // 过滤操作列表
  const filteredActions = useMemo(() => {
    const q = actionSearch.trim().toLowerCase();
    if (!q || !actions) return actions ?? [];
    return actions.filter(
      (a) =>
        a.name.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
    );
  }, [actions, actionSearch]);

  const builtInCount = builtInConnectors.length;
  const appCount = appConnectors.length;

  // 处理操作选择
  const handleActionSelect = (action: {
    code: string;
    name: string;
    description: string;
    registry?: FlowNodeRegistry;
    outputsSchema?: NodeOutputStructItem[];
  }) => {
    // 内置的话直接调用 registry.onAdd 方法
    if (action.registry) {
      const d = action.registry.onAdd?.();
      if (d) {
        onSelect(d);
      } else {
        message.error("节点 registry onAdd 返回空节点数据");
      }
    } else {
      // 应用的话生成自定义节点数据
      if (activeConnector) {
        onSelect(
          generateCustomNodeData({
            name: action.name,
            description: action.description,
            connectorCode: activeConnector.code,
            actionCode: action.code,
            version: 1,
            icon: activeConnector.icon,
            outputStruct: action.outputsSchema,
          })
        );
      }
    }
  };

  return (
    <div className="flex h-[560px]">
      {/* 左侧面板 - 连接器列表 */}
      <div className="w-72 border-r border-gray-200 flex flex-col bg-gray-50/50">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200">
          <div className="text-sm font-medium text-gray-700 mb-3">
            选择连接器
          </div>

          {/* 分类切换 */}
          <Segmented
            block
            className=" mb-3!"
            value={category}
            onChange={(val) => setCategory(val as "all" | "built-in" | "app")}
            options={[
              { label: "全部", value: "all" },
              {
                label: (
                  <span className="flex items-center gap-1">
                    <AppstoreOutlined className="text-xs" />
                    内置 ({builtInCount})
                  </span>
                ),
                value: "built-in",
              },
              {
                label: (
                  <span className="flex items-center gap-1">
                    <ApiOutlined className="text-xs" />
                    应用 ({appCount})
                  </span>
                ),
                value: "app",
              },
            ]}
          />

          {/* 搜索框 */}
          <Input
            placeholder="搜索连接器..."
            prefix={<SearchOutlined className="text-gray-400" />}
            allowClear
            value={connectorSearch}
            onChange={(e) => setConnectorSearch(e.target.value)}
          />
        </div>

        <ScrollArea className="flex-1 h-1 p-2">
          {category === "all" ? (
            <>
              {/* 内置分组 */}
              {groupedConnectors["built-in"].length > 0 && (
                <div className="mb-3">
                  <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                    <AppstoreOutlined className="text-xs text-blue-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      内置
                    </span>
                    <span className="text-xs text-gray-400">
                      ({groupedConnectors["built-in"].length})
                    </span>
                  </div>
                  {groupedConnectors["built-in"].map((connector) => (
                    <ConnectorListItem
                      key={connector.code}
                      connector={connector}
                      isSelected={activeConnector?.code === connector.code}
                      onClick={() => setActiveConnector(connector)}
                    />
                  ))}
                </div>
              )}

              {/* 应用分组 */}
              {groupedConnectors["app"].length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 px-2 py-1.5 mb-1">
                    <ApiOutlined className="text-xs text-purple-500" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      应用
                    </span>
                    <span className="text-xs text-gray-400">
                      ({groupedConnectors["app"].length})
                    </span>
                  </div>
                  {groupedConnectors["app"].map((connector) => (
                    <ConnectorListItem
                      key={connector.code}
                      connector={connector}
                      isSelected={activeConnector?.code === connector.code}
                      onClick={() => setActiveConnector(connector)}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            // 单分类列表
            filteredConnectors.map((connector) => (
              <ConnectorListItem
                key={connector.code}
                connector={connector}
                isSelected={activeConnector?.code === connector.code}
                onClick={() => setActiveConnector(connector)}
              />
            ))
          )}

          {/* 空状态 */}
          {filteredConnectors.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4 -mt-4">
              <SearchOutlined className="text-2xl text-gray-300 mb-2" />
              <p className="text-sm text-gray-500">未找到连接器</p>
              <p className="text-xs text-gray-400 mt-1">
                尝试调整搜索或筛选条件
              </p>
            </div>
          )}
        </ScrollArea>
      </div>

      {/* 右侧面板 - 操作列表 */}
      <div className="flex-1 flex flex-col">
        {/* 头部 */}
        <div className="p-4 border-b border-gray-200">
          {activeConnector ? (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    activeConnector.category === "built-in"
                      ? "bg-blue-50"
                      : "bg-purple-50"
                  }`}
                >
                  <img
                    src={activeConnector.icon}
                    alt={activeConnector.name}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-medium text-gray-900">
                      {activeConnector.name}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        activeConnector.category === "built-in"
                          ? "bg-blue-50 text-blue-600"
                          : "bg-purple-50 text-purple-600"
                      }`}
                    >
                      {activeConnector.category === "built-in"
                        ? "内置"
                        : "应用"}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">
                    {activeConnector.description}
                  </p>
                </div>
              </div>
              <Input
                placeholder="搜索操作..."
                prefix={<SearchOutlined className="text-gray-400" />}
                allowClear
                value={actionSearch}
                onChange={(e) => setActionSearch(e.target.value)}
              />
            </>
          ) : (
            <div className="text-sm text-gray-500">请选择左侧的连接器</div>
          )}
        </div>

        {/* 操作列表 */}
        <div className="flex-1 overflow-auto p-4">
          {!activeConnector && (
            <div className="h-full flex items-center justify-center">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="选择连接器查看可用操作"
              />
            </div>
          )}

          {activeConnector && actionsLoading && (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-20 rounded-lg bg-gray-100 animate-pulse"
                />
              ))}
            </div>
          )}

          {activeConnector && !actionsLoading && filteredActions.length > 0 && (
            <div className={classNames("grid grid-cols-2 gap-2")}>
              {filteredActions.map((action) => (
                <button
                  key={action.code}
                  onClick={() => handleActionSelect(action)}
                  className="w-full flex items-start gap-4 p-4 rounded-lg border border-gray-200 text-left transition-all hover:bg-blue-50 hover:border-blue-200 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm text-gray-900 mb-1 group-hover:text-blue-700">
                      {action.name}
                    </div>
                    <div className="text-xs text-gray-500 line-clamp-2">
                      {action.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {activeConnector &&
            !actionsLoading &&
            filteredActions.length === 0 && (
              <div className="h-full flex items-center justify-center">
                <Empty
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                  description="未找到操作"
                />
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
    addBlock: (dataJSON: FlowNodeJSON) => void;
    from: FlowNodeEntity;
  }) => {
    const ins = modal.confirm({
      width: 900,
      icon: null,
      title: null,
      footer: null,
      centered: true,
      closable: true,
      maskClosable: false,
      className: "connector-selector-modal",
      classNames: {
        container: "p-0! overflow-hidden",
      },
      content: (
        <ConnectorSelectorContent
          builtInLogicNodes={config.builtInNodes}
          onSelect={(dataJson) => {
            config.addBlock(dataJson);
            ins.destroy();
          }}
          from={config.from}
        />
      ),
    });
    return ins;
  };

  return {
    showConnectorSelectorModal,
    showConnectorSelectorModalContextHolder: modalContextHolder,
  };
}
