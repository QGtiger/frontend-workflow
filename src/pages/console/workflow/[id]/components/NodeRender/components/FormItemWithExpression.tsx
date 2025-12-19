import { useBoolean, useClickAway, useCreation } from "ahooks";
import { Popover, Segmented, Typography } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useMemo, useRef, type ComponentType } from "react";
import type { NodeInputValue } from "../../../types";
import { CMEditor } from "./CMEditor";
import { useWorkflowStoreApi } from "../../../models/workflowStore";
import type { SandboxResult } from "@/common/sandbox";
import "./FormItemWithExpression.less";
import type { TemplateSegment } from "../../../models/workflowStore/types";

/**
 * 获取值的类型
 */
function getValueType(value: any): string {
  if (Array.isArray(value)) return "Array";
  if (value instanceof Date) return "Date";
  if (typeof value === "object" && value !== null) return "Object";
  return typeof value;
}

function formatObjectValue(value: any): string {
  if (isObject(value)) {
    if (value instanceof Date) return value.toISOString();
    return JSON.stringify(value);
  }
  return String(value);
}

function isObject(value: any): value is object {
  return typeof value === "object" && value !== null;
}

function getTextBySegment<T = any>(segment: TemplateSegment<T>): string {
  if (typeof segment === "string") {
    return segment;
  }
  if (segment.error) {
    return `[${segment.error.name}: ${segment.error?.message}]`;
  }
  const v = segment.result;
  if (isObject(v)) {
    return `[${getValueType(v)}: ${formatObjectValue(v)}]`;
  }
  return String(v);
}

function ResultViewer(props: { segments: TemplateSegment[] }) {
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
      return `[${errorSegment.error?.name}: ${errorSegment.error?.message}]`;
    }

    const v = workflowStoreApi.evaluateTemplateBySegments(segments);

    return (
      <span>
        [{getValueType(v)}:{" "}
        <span className=" underline underline-offset-2">
          {formatObjectValue(v)}
        </span>
        ]
      </span>
    );
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
              className={classNames(" hover:border-blue-500!", {
                "border-blue-500! rounded-t-md! rounded-b-none!": focus,
              })}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{
                opacity: focus ? 1 : 0,
                pointerEvents: focus ? "auto" : "none",
                y: focus ? `100%` : "100%",
              }}
              transition={{ duration: 0.1 }}
              className={classNames(
                "z-10 max-h-[400px] overflow-auto absolute right-0 bottom-0 w-full box-border bg-white shadow-md rounded-b-md border border-t-0 border-gray-200"
              )}
            >
              {/* 标题栏 */}
              <div className="sticky top-0 bg-linear-to-r from-blue-50 to-indigo-50 px-3 py-2 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg
                    className="w-4 h-4 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-gray-700">
                    表达式预览
                  </span>
                </div>
                <span className="text-xs text-gray-500">实时计算结果</span>
              </div>

              {/* 内容区域 */}
              <div className="cm-viewer-wrapper">
                {segments.length ? (
                  segments.map((it, index) => {
                    if (isObject(it)) {
                      const { error, isMock } = it;
                      return (
                        <span
                          key={index}
                          className={classNames(
                            "cm-viewer-expression",
                            isMock
                              ? "cm-viewer-expr-pending"
                              : error
                              ? "cm-viewer-expr-invalid"
                              : "cm-viewer-expr-valid"
                          )}
                        >
                          {getTextBySegment(it)}
                        </span>
                      );
                    } else {
                      return <span key={index}>{it}</span>;
                    }
                  })
                ) : (
                  <span className="cm-viewer-placeholder">请输入表达式</span>
                )}
              </div>

              {/* 底部提示 */}
              <div className="sticky bottom-0 bg-gray-50 px-2 py-2 border-t border-gray-200">
                <div className="flex items-start gap-2 text-xs text-gray-600">
                  <svg
                    className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-xs">
                    这是表达式的计算结果预览。
                    <span className="text-green-600 font-medium">
                      绿色
                    </span>{" "}
                    表示计算成功，
                    <span className="text-red-600 font-medium">红色</span>{" "}
                    表示有错误。
                  </span>
                </div>
              </div>
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
