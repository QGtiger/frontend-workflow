/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useCallback } from "react";

import { usePlayground } from "@flowgram.ai/fixed-layout-editor";
import { Button } from "antd";
import { UnlockOutlined, LockOutlined } from "@ant-design/icons";

export const Readonly = () => {
  const playground = usePlayground();
  const toggleReadonly = useCallback(() => {
    // eslint-disable-next-line react-hooks/immutability
    playground.config.readonly = !playground.config.readonly;
  }, [playground]);

  return playground.config.readonly ? (
    <Button variant="text" icon={<LockOutlined />} onClick={toggleReadonly} />
  ) : (
    <Button variant="text" icon={<UnlockOutlined />} onClick={toggleReadonly} />
  );
};
