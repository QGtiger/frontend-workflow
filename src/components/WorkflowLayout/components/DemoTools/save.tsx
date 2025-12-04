/**
 * Copyright (c) 2025 Bytedance Ltd. and/or its affiliates
 * SPDX-License-Identifier: MIT
 */

import { useState } from "react";
import { Button, Badge } from "antd";

export function Save(props: { disabled: boolean }) {
  const [errorCount, setErrorCount] = useState(0);

  const onSave = () => {
    console.log("save");
  };
  if (errorCount === 0) {
    return (
      <Button variant="filled" disabled={props.disabled} onClick={onSave}>
        Save
      </Button>
    );
  }
  return (
    <Badge count={errorCount}>
      <Button type="primary" disabled={props.disabled} onClick={onSave}>
        Save
      </Button>
    </Badge>
  );
}
