import { useBoolean, useClickAway, useCreation } from "ahooks";
import { Popover, Segmented, Typography } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useMemo, useRef, type ComponentType } from "react";
import type { NodeInputValue } from "../../../types";
import { CMEditor } from "./CMEditor";
import { useWorkflowStoreApi } from "../../../models/workflowStore";
import type { SandboxResult } from "@/common/sandbox";

/**
 * 获取值的类型
 */
function getValueType(value: any): string {
  if (Array.isArray(value)) return "Array";
  if (value instanceof Date) return "Date";
  if (typeof value === "object") return "Object";
  return typeof value;
}

function formatObjectValue(value: any): string {
  if (value instanceof Date) return value.toISOString();
  return value.toString();
}

function isObject(value: any): value is object {
  return typeof value === "object" && value !== null;
}

function ResultViewer(props: { segments: (string | SandboxResult<any>)[] }) {
  const workflowStoreApi = useWorkflowStoreApi();
  const { segments } = props;

  const s = useMemo(() => {
    if (!segments.length) {
      return "[empty]";
    }
    const errorSegment = segments.find(
      (it) => typeof it === "object" && it.error
    ) as SandboxResult<any> | undefined;

    if (errorSegment) {
      return `[Error: ${errorSegment.error?.message}]`;
    }

    const v = workflowStoreApi.evaluateTemplateBySegments(segments);
    if (!v) return String(v);

    if (isObject(v)) {
      return `[${getValueType(v)}: ${formatObjectValue(v)}]`;
    }
    return String(v);
  }, [segments, workflowStoreApi]);

  return (
    <div className="font-mono text-xs text-gray-500 line-clamp-1 break-all whitespace-pre-wrap">
      {s}
    </div>
  );
}

export function FormItemWithExpression(props: {
  Componet: ComponentType<any>;
  value?: NodeInputValue;
  onChange?: (value: NodeInputValue) => void;
  placeholder?: string;
}) {
  const {
    Componet,
    value: valueWithExpression,
    onChange,
    ...restProps
  } = props;
  const { isExpression, value, expression } = valueWithExpression || {};
  const workflowStoreApi = useWorkflowStoreApi();

  const containerRef = useRef<HTMLDivElement>(null);
  const [hover, hoverAction] = useBoolean(false);
  const [focus, focusAction] = useBoolean(false);

  const segments = useMemo(() => {
    return workflowStoreApi.parseTemplateForSegments(expression);
  }, [expression, workflowStoreApi]);

  console.log(segments);

  const isShowExpression = hover || focus;

  // 点击外部时隐藏
  useClickAway(() => {
    focusAction.setFalse();
  }, containerRef);

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseOver={hoverAction.setTrue}
      onMouseLeave={hoverAction.setFalse}
    >
      {isExpression ? (
        <div className="flex flex-col gap-1">
          <div className="relative" onClick={focusAction.setTrue}>
            <CMEditor
              value={expression}
              onChange={(v) => {
                onChange?.({
                  ...valueWithExpression,
                  expression: v,
                });
              }}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: focus ? 1 : 0,
                pointerEvents: focus ? "auto" : "none",
                y: focus ? `100%` : "90%",
              }}
              transition={{ duration: 0.1 }}
              className={classNames(
                "absolute right-0 bottom-0 w-full box-border bg-white shadow-sm rounded-b-md p-2"
              )}
            >
              22
            </motion.div>
          </div>
          <ResultViewer segments={segments} />
        </div>
      ) : (
        <Componet
          {...restProps}
          value={value}
          onChange={(v: any) => {
            if (typeof v === "object" && v.target) {
              v = v.target?.value;
            }
            onChange?.({
              ...valueWithExpression,
              value: v,
            });
          }}
        />
      )}
      <motion.div
        initial={{ opacity: 0, y: -18 }}
        animate={{
          opacity: isShowExpression ? 1 : 0,
          y: isShowExpression ? `-100%` : -18,
          pointerEvents: isShowExpression ? "auto" : "none",
        }}
        transition={{ duration: 0.1 }}
        className={classNames("absolute right-0 top-0 pb-1")}
      >
        <Segmented
          size="small"
          className="bg-gray-300 text-xs!"
          value={isExpression}
          onChange={(v) => {
            onChange?.({
              ...valueWithExpression,
              isExpression: v,
            });
          }}
          options={[
            {
              value: false,
              label: "常规",
            },
            {
              value: true,
              label: "高级",
            },
          ]}
        />
      </motion.div>
    </div>
  );
}
