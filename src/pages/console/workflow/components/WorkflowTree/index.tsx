import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FolderOutlined,
  FolderOpenOutlined,
  FileTextOutlined,
  CaretRightFilled,
  EllipsisOutlined,
} from "@ant-design/icons";
import { Dropdown, Modal, Input, message } from "antd";
import type { MenuProps } from "antd";
import type { TreeNode } from "../../models";
import { WorkflowLayoutModel } from "../../models";
import { useCreateWorkflow } from "../../ConnectorSelectorModel";

interface WorkflowTreeProps {
  treeData: TreeNode[];
  selectedKey?: string;
}

function TreeNodeItem({
  node,
  depth,
  selectedKey,
  onSelect,
}: {
  node: TreeNode;
  depth: number;
  selectedKey?: string;
  onSelect: (key: string) => void;
}) {
  const [expanded, setExpanded] = useState(true);
  const [showActions, setShowActions] = useState(false);
  const isFolder = node.type === "folder";
  const isSelected = selectedKey === node.key;

  const { createFolder, renameNode, deleteWorkflow } =
    WorkflowLayoutModel.useModel();
  const { createWorkflow } = useCreateWorkflow();

  const handleClick = () => {
    if (isFolder) {
      setExpanded((prev) => !prev);
    } else {
      onSelect(node.key);
    }
  };

  // 重命名弹窗
  const handleRename = () => {
    let newTitle = node.title;
    const modal = Modal.confirm({
      title: "重命名",
      content: (
        <Input
          defaultValue={node.title}
          className="mt-2"
          onChange={(e) => {
            newTitle = e.target.value;
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              modal.destroy();
              renameNode(node.key, newTitle);
            }
          }}
        />
      ),
      onOk: () => {
        if (!newTitle.trim()) {
          message.error("名称不能为空");
          return false;
        }
        renameNode(node.key, newTitle.trim());
      },
    });
  };

  // 删除确认
  const handleDelete = () => {
    Modal.confirm({
      title: "确认删除",
      content: `确定删除「${node.title}」吗？${
        isFolder ? "文件夹内的内容也会被删除。" : ""
      }`,
      okText: "删除",
      okType: "danger",
      onOk: () => deleteWorkflow(node.key),
    });
  };

  // 操作菜单
  const menuItems: MenuProps["items"] = isFolder
    ? [
        {
          key: "new-folder",
          label: "新建子文件夹",
          onClick: () => createFolder(node.key),
        },
        {
          key: "new-workflow",
          label: "新建工作流",
          onClick: () => createWorkflow?.(node.key),
        },

        { type: "divider" },
        {
          key: "rename",
          label: "重命名",
          onClick: handleRename,
        },
        { type: "divider" },
        {
          key: "delete",
          label: "删除文件夹",
          danger: true,
          onClick: handleDelete,
        },
      ]
    : [
        {
          key: "rename",
          label: "重命名",
          onClick: handleRename,
        },
        { type: "divider" },
        {
          key: "delete",
          label: "删除",
          danger: true,
          onClick: handleDelete,
        },
      ];

  return (
    <div>
      <div
        className={`group flex items-center gap-1 px-2 py-1.5 rounded-md cursor-pointer transition-colors text-sm ${
          isSelected
            ? "bg-blue-50 text-blue-600"
            : "hover:bg-gray-100 text-gray-700"
        }`}
        style={{ paddingLeft: 12 + depth * 16 }}
        onClick={handleClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
      >
        {/* 展开箭头（仅文件夹） */}
        {isFolder && (
          <span
            className={`text-xs text-gray-400 transition-transform ${
              expanded ? "rotate-90" : ""
            }`}
          >
            <CaretRightFilled />
          </span>
        )}
        {/* {!isFolder && <span className="w-3" />} */}

        {/* 图标 */}
        <span className="text-sm shrink-0">
          {isFolder ? (
            expanded ? (
              <FolderOpenOutlined style={{ color: "#faad14" }} />
            ) : (
              <FolderOutlined style={{ color: "#faad14" }} />
            )
          ) : (
            <FileTextOutlined style={{ color: "#1677ff" }} />
          )}
        </span>

        {/* 标题 */}
        <span className="truncate flex-1 min-w-0">{node.title}</span>

        {/* 操作按钮 */}
        <span
          className={`shrink-0 text-gray-400 hover:text-gray-600 transition-opacity ${
            showActions ? "opacity-100" : "opacity-0"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <Dropdown menu={{ items: menuItems }} trigger={["hover"]}>
            <EllipsisOutlined className="px-1" />
          </Dropdown>
        </span>
      </div>

      {/* 子节点 */}
      {isFolder && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <TreeNodeItem
              key={child.key}
              node={child}
              depth={depth + 1}
              selectedKey={selectedKey}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function WorkflowTree({
  treeData,
  selectedKey,
}: WorkflowTreeProps) {
  const navigate = useNavigate();

  const handleSelect = useCallback(
    (key: string) => {
      navigate(`/console/workflow/${key}`);
    },
    [navigate],
  );

  return (
    <div className="py-1">
      {treeData.map((node) => (
        <TreeNodeItem
          key={node.key}
          node={node}
          depth={0}
          selectedKey={selectedKey}
          onSelect={handleSelect}
        />
      ))}
    </div>
  );
}
