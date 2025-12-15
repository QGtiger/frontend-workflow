import { useBoolean, useClickAway } from "ahooks";
import { Segmented } from "antd";
import classNames from "classnames";
import { motion } from "framer-motion";
import { useRef, type ComponentType } from "react";
import type { NodeInputValue } from "../../../types";
import { CMEditor } from "./CMEditor";

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
  const { isExpression, value } = valueWithExpression || {};

  const [showExpression, showExpressionAction] = useBoolean(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 点击外部时隐藏
  useClickAway(() => {
    showExpressionAction.setFalse();
  }, containerRef);

  return (
    <div
      ref={containerRef}
      className="relative"
      // 点击内部时显示
      onClick={() => showExpressionAction.setTrue()}
    >
      {isExpression ? (
        <CMEditor
          value={value}
          onChange={(v) => {
            onChange?.({
              ...valueWithExpression,
              value: v,
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
          opacity: showExpression ? 1 : 0,
          y: showExpression ? `-100%` : -18,
          pointerEvents: showExpression ? "auto" : "none",
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
