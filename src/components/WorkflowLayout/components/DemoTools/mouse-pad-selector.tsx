/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import React, { type CSSProperties, useState } from "react";

import { Popover, Typography } from "antd";

import { IconPad, IconPadTool } from "../../assets/icon-pad";
import { IconMouse, IconMouseTool } from "../../assets/icon-mouse";

import "./mouse-pad-selector.less";

const { Title, Paragraph } = Typography;

// @ts-expect-error 不兼容
export enum InteractiveType {
  Mouse = "MOUSE",
  Pad = "PAD",
}

export interface MousePadSelectorProps {
  value: InteractiveType;
  onChange: (value: InteractiveType) => void;
  onPopupVisibleChange?: (visible: boolean) => void;
  containerStyle?: CSSProperties;
  iconStyle?: CSSProperties;
  arrowStyle?: CSSProperties;
}

const InteractiveItem: React.FC<{
  title: string;
  subTitle: string;
  icon: React.ReactNode;
  value: InteractiveType;
  selected: boolean;
  onChange: (value: InteractiveType) => void;
}> = ({ title, subTitle, icon, onChange, value, selected }) => (
  <div
    className={`mouse-pad-option ${
      selected ? "mouse-pad-option-selected" : ""
    }`}
    onClick={() => onChange(value)}
  >
    <div
      className={`mouse-pad-option-icon ${
        selected ? "mouse-pad-option-icon-selected" : ""
      }`}
    >
      {icon}
    </div>
    <Title
      level={5}
      className={`mouse-pad-option-title ${
        selected ? "mouse-pad-option-title-selected" : ""
      }`}
    >
      {title}
    </Title>
    <Paragraph
      className={`mouse-pad-option-subTitle ${
        selected ? "mouse-pad-option-subTitle-selected" : ""
      }`}
    >
      {subTitle}
    </Paragraph>
  </div>
);

export const MousePadSelector: React.FC<
  MousePadSelectorProps & React.RefAttributes<HTMLDivElement>
> = ({
  value,
  onChange,
  onPopupVisibleChange,
  containerStyle,
  iconStyle,
  arrowStyle,
}) => {
  const isMouse = value === InteractiveType.Mouse;
  const [visible, setVisible] = useState(false);

  return (
    <Popover
      trigger={["click"]}
      placement="topLeft"
      open={visible}
      onOpenChange={(v) => {
        onPopupVisibleChange?.(v);
      }}
      content={
        <div className={"ui-mouse-pad-selector-popover"}>
          <Typography.Title level={4}>{"Interaction mode"}</Typography.Title>
          <div className={"ui-mouse-pad-selector-popover-options"}>
            <InteractiveItem
              title={"Mouse-Friendly"}
              subTitle={
                "Drag the canvas with the left mouse button, zoom with the scroll wheel."
              }
              value={InteractiveType.Mouse}
              selected={value === InteractiveType.Mouse}
              icon={<IconMouse />}
              onChange={onChange}
            />

            <InteractiveItem
              title={"Touchpad-Friendly"}
              subTitle={
                "Drag with two fingers moving in the same direction, zoom by pinching or spreading two fingers."
              }
              value={InteractiveType.Pad}
              selected={value === InteractiveType.Pad}
              icon={<IconPad />}
              onChange={onChange}
            />
          </div>
        </div>
      }
    >
      <div
        className={`ui-mouse-pad-selector ${
          visible ? "ui-mouse-pad-selector-active" : ""
        }`}
        onClick={() => {
          setVisible(!visible);
        }}
        style={containerStyle}
      >
        <div className={"ui-mouse-pad-selector-icon"} style={iconStyle}>
          {isMouse ? <IconMouseTool /> : <IconPadTool />}
        </div>
      </div>
    </Popover>
  );
};
