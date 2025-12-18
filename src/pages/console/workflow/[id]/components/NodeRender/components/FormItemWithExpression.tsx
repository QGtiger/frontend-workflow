import { useBoolean, useClickAway, useCreation } from "ahooks";
import { Popover, Segmented } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useRef, type ComponentType } from "react";
import type { NodeInputValue } from "../../../types";
import { CMEditor } from "./CMEditor";
import { useWorkflowStoreApi } from "../../../models/workflowStore";

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

  const isShowExpression = hover || focus;

  const evaluateExpression = useCreation(() => {
    return expression && workflowStoreApi.evaluateExpression(expression);
  }, [expression, workflowStoreApi]);

  console.log(evaluateExpression);

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
      onClick={focusAction.setTrue}
    >
      {isExpression ? (
        <CMEditor
          value={expression}
          onChange={(v) => {
            onChange?.({
              ...valueWithExpression,
              expression: v,
            });
          }}
        />
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

      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: focus ? 1 : 0,
          pointerEvents: focus ? "auto" : "none",
          y: focus ? `100%` : "90%",
        }}
        transition={{ duration: 0.1 }}
        className={classNames("absolute right-0 bottom-0 w-full box-border")}
      >
        22
      </motion.div>
    </div>
  );
}
