import { ScrollArea } from "@/components/ScrollArea";
import { SearchOutlined } from "@ant-design/icons";
import { Input } from "antd";
import { useEffect, useMemo, useState } from "react";
import { TriggerCard } from "./TriggerCard";
import type { ConnectorTrigger } from "@server/shared/connector";

export function TriggerSelect({
  triggers,
  value,
  onChange,
}: {
  triggers: ConnectorTrigger[];
  value?: string;
  onChange?: (value: string) => void;
}) {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [selectedConnectorCode, setSelectedConnectorCode] = useState<
    string | null
  >("__ALL__"); // 默认选择"全部"

  // 过滤 connectors 和 triggers
  const filteredData = useMemo(() => {
    if (!searchKeyword.trim()) {
      return triggers;
    }

    const keyword = searchKeyword.toLowerCase();
    return triggers
      .map((connector) => {
        // 检查 connector 名称是否匹配
        const connectorMatch = connector.name.toLowerCase().includes(keyword);

        // 过滤匹配的 triggers
        const matchedTriggers = connector.triggers.filter(
          (trigger) =>
            trigger.name.toLowerCase().includes(keyword) ||
            trigger.description?.toLowerCase().includes(keyword),
        );

        // 如果 connector 名称匹配或有关键的 triggers，则返回
        if (connectorMatch || matchedTriggers.length > 0) {
          return {
            ...connector,
            triggers: connectorMatch ? connector.triggers : matchedTriggers,
          };
        }
        return null;
      })
      .filter((item): item is ConnectorTrigger => item !== null);
  }, [triggers, searchKeyword]);

  // 计算所有触发动作（用于"全部"视图）
  const allTriggers = useMemo(() => {
    return filteredData.flatMap((connector) =>
      connector.triggers.map((trigger) => ({
        ...trigger,
        connectorName: connector.name,
        connectorIcon: connector.icon,
        connectorCode: connector.code,
      })),
    );
  }, [filteredData]);

  // 当前选中的 connector 或全部
  const isAllSelected = selectedConnectorCode === "__ALL__";
  const selectedConnector = useMemo(() => {
    if (isAllSelected) {
      return null;
    }
    return (
      filteredData.find((item) => item.code === selectedConnectorCode) || null
    );
  }, [filteredData, selectedConnectorCode, isAllSelected]);

  // 如果选中的 connector 不在过滤结果中，自动选择"全部"
  useEffect(() => {
    if (filteredData.length > 0 && !isAllSelected) {
      const isSelectedInFiltered = filteredData.some(
        (item) => item.code === selectedConnectorCode,
      );
      if (!isSelectedInFiltered) {
        setSelectedConnectorCode("__ALL__");
      }
    }
  }, [filteredData, selectedConnectorCode, isAllSelected]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* 搜索框 */}
      <div className="flex justify-end">
        <Input
          placeholder="搜索连接器或触发动作名称"
          prefix={<SearchOutlined className="text-gray-400 " />}
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          allowClear
        />
      </div>

      {/* 左右分栏 */}
      <div className="flex gap-4 w-full" style={{ minHeight: "400px" }}>
        {/* 左侧：连接器导航 */}
        <div className="w-[230px] flex-shrink-0 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200">
            <span className="text-sm font-medium text-gray-700">
              连接器类型
            </span>
          </div>
          <ScrollArea style={{ maxHeight: "400px" }}>
            {/* 全部选项 */}
            <div
              onClick={() => setSelectedConnectorCode("__ALL__")}
              className={`
                px-3 py-2 cursor-pointer transition-colors border-b border-gray-100
                ${isAllSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50"}
              `}
            >
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 object-contain flex-shrink-0"></div>
                <span
                  className={`text-sm ${isAllSelected ? "text-blue-600 font-medium" : "text-gray-700"}`}
                >
                  全部
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1 ml-6">
                {allTriggers.length} 个触发动作
              </div>
            </div>

            {/* 连接器列表 */}
            {filteredData.length === 0 ? (
              <div className="px-3 py-4 text-center text-sm text-gray-400">
                暂无数据
              </div>
            ) : (
              filteredData.map((connector) => {
                const isSelected = connector.code === selectedConnectorCode;
                return (
                  <div
                    key={connector.code}
                    onClick={() => setSelectedConnectorCode(connector.code)}
                    className={`
                      px-3 py-2 cursor-pointer transition-colors border-b border-gray-100
                      ${isSelected ? "bg-blue-50 border-l-2 border-l-blue-500" : "hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <img
                        src={connector.icon}
                        className="w-4 h-4 object-contain flex-shrink-0"
                        alt=""
                      />
                      <span
                        className={`text-sm ${isSelected ? "text-blue-600 font-medium" : "text-gray-700"}`}
                      >
                        {connector.name}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1 ml-6">
                      {connector.triggers.length} 个触发动作
                    </div>
                  </div>
                );
              })
            )}
          </ScrollArea>
        </div>

        {/* 右侧：触发动作列表 */}
        <div className="flex-1 border border-gray-200 rounded-md overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
            <div className="flex items-center gap-2">
              {isAllSelected ? (
                <>
                  <span className="text-sm font-medium text-gray-700">
                    全部触发动作
                  </span>
                  <span className="text-xs text-gray-400">
                    ({allTriggers.length} 个触发动作)
                  </span>
                </>
              ) : selectedConnector ? (
                <>
                  <img
                    src={selectedConnector.icon}
                    className="w-4 h-4 object-contain"
                    alt=""
                  />
                  <span className="text-sm font-medium text-gray-700">
                    {selectedConnector.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    ({selectedConnector.triggers.length} 个触发动作)
                  </span>
                </>
              ) : null}
            </div>
          </div>

          <ScrollArea className="p-4" style={{ maxHeight: "400px" }}>
            {isAllSelected ? (
              // 全部视图：显示所有连接器的触发动作，按连接器分组
              allTriggers.length > 0 ? (
                <div className="flex flex-col gap-4">
                  {filteredData.map((connector) => {
                    return (
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
                          <img
                            src={connector.icon}
                            className="w-4 h-4 object-contain"
                            alt=""
                          />
                          <span className="text-sm font-medium text-gray-600">
                            {connector.name}
                          </span>
                          <span className="text-xs text-gray-400">
                            ({connector.triggers.length} 个)
                          </span>
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {connector.triggers.map((trigger) => (
                            <TriggerCard
                              onClick={() => {
                                onChange?.(trigger.code);
                              }}
                              isActive={value === trigger.code}
                              key={trigger.code}
                              trigger={trigger}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-sm text-gray-400">
                  {searchKeyword ? "未找到匹配的触发动作" : "暂无触发动作"}
                </div>
              )
            ) : selectedConnector && selectedConnector.triggers.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {selectedConnector.triggers.map((trigger) => (
                  <TriggerCard
                    onClick={() => {
                      onChange?.(trigger.code);
                    }}
                    isActive={value === trigger.code}
                    key={trigger.code}
                    trigger={trigger}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-sm text-gray-400">
                {searchKeyword
                  ? "未找到匹配的触发动作"
                  : "该连接器暂无触发动作"}
              </div>
            )}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
