import React, { useContext, useMemo, useState } from "react";
import { HolderOutlined, PlusOutlined } from "@ant-design/icons";
import type { DragEndEvent } from "@dnd-kit/core";
import { DndContext } from "@dnd-kit/core";
import type { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button, Popconfirm, Table, Typography, Tag, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { IPaasFormSchema } from "@/components/IPaaSForm/type";
import { EditorKindEnum } from "./constant";
import { SchemaConfigDrawer } from "./SchemaConfigDrawer";
import { useBoolean } from "ahooks";

const { TextArea } = Input;

interface RowContextProps {
  setActivatorNodeRef?: (element: HTMLElement | null) => void;
  listeners?: SyntheticListenerMap;
}

const RowContext = React.createContext<RowContextProps>({});

const DragHandle: React.FC = () => {
  const { setActivatorNodeRef, listeners } = useContext(RowContext);
  return (
    <Button
      type="text"
      size="small"
      icon={<HolderOutlined />}
      style={{ cursor: "move" }}
      ref={setActivatorNodeRef}
      {...listeners}
    />
  );
};

interface RowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  "data-row-key": string;
}

const Row: React.FC<RowProps> = (props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: props["data-row-key"],
  });

  const style: React.CSSProperties = {
    ...props.style,
    transform: CSS.Translate.toString(transform),
    transition,
    ...(isDragging ? { position: "relative", zIndex: 0 } : {}),
  };

  const contextValue = useMemo<RowContextProps>(
    () => ({ setActivatorNodeRef, listeners }),
    [setActivatorNodeRef, listeners]
  );

  return (
    <RowContext.Provider value={contextValue}>
      <tr {...props} ref={setNodeRef} style={style} {...attributes} />
    </RowContext.Provider>
  );
};

interface IPaasSchemaEditorProps {
  value?: IPaasFormSchema[];
  onChange?: (value: IPaasFormSchema[]) => void;
  placeholder?: string;
}

export default function IPaasSchemaEditor({
  value = [],
  onChange,
}: IPaasSchemaEditorProps) {
  const dataSource = value;
  const [editingRecord, setEditingRecord] = useState<
    IPaasFormSchema | undefined
  >();
  const [showDrawer, showDrawerAction] = useBoolean(false);

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    if (active.id !== over?.id) {
      const activeIndex = dataSource.findIndex(
        (record) => record.code === active?.id
      );
      const overIndex = dataSource.findIndex(
        (record) => record.code === over?.id
      );
      const newArray = arrayMove(dataSource, activeIndex, overIndex);
      onChange?.(newArray);
    }
  };

  const handleDelete = (code: string | string[]) => {
    const newData = dataSource.filter((item) => item.code !== code);
    onChange?.(newData);
  };

  const columns: ColumnsType<IPaasFormSchema> = [
    {
      key: "sort",
      align: "center",
      width: 60,
      render: () => <DragHandle />,
    },
    {
      title: "字段名称",
      dataIndex: "name",
      width: 150,
      render: (name: string, record) => (
        <div>
          <div className="font-medium">{name || "未命名"}</div>
          <div className="text-xs text-gray-400">{record.code}</div>
        </div>
      ),
    },
    {
      title: "类型",
      dataIndex: "type",
      width: 80,
      render: (type: string) => <Tag>{type}</Tag>,
    },
    {
      title: "必填",
      dataIndex: "required",
      width: 60,
      render: (required: boolean) => (required ? "是" : "否"),
    },
    {
      title: "分组",
      dataIndex: "group",
      width: 100,
      render: (group: string) => group || "-",
    },
    {
      title: "控件类型",
      width: 100,
      render: (record: IPaasFormSchema) => {
        const kind = record.editor?.kind;
        return <Tag color="blue">{EditorKindEnum[kind] || kind || "未知"}</Tag>;
      },
    },
    {
      title: "操作",
      width: 120,
      render: (record: IPaasFormSchema) => (
        <span>
          <Typography.Link
            style={{ marginRight: 8 }}
            onClick={() => {
              setEditingRecord(record);
              showDrawerAction.setTrue();
            }}
          >
            编辑
          </Typography.Link>
          <Popconfirm
            title="确认删除?"
            onConfirm={() => handleDelete(record.code)}
          >
            <Typography.Link type="danger">删除</Typography.Link>
          </Popconfirm>
        </span>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-3 flex justify-end">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingRecord(undefined);
            showDrawerAction.setTrue();
          }}
        >
          添加字段
        </Button>
      </div>
      <DndContext modifiers={[restrictToVerticalAxis]} onDragEnd={onDragEnd}>
        <SortableContext
          items={dataSource.map((i) => i.code)}
          strategy={verticalListSortingStrategy}
        >
          <Table
            rowKey="code"
            components={{ body: { row: Row } }}
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            size="small"
          />
        </SortableContext>
      </DndContext>

      {showDrawer && (
        <SchemaConfigDrawer
          initialValues={editingRecord}
          isEdit={!!editingRecord}
          onClose={showDrawerAction.setFalse}
          onSave={(v) => {
            if (editingRecord) {
              const newData = dataSource.map((item) =>
                item.code === editingRecord.code ? v : item
              );
              onChange?.(newData);
            } else {
              onChange?.([...dataSource, v]);
            }
          }}
        />
      )}
    </div>
  );
}
