import type { SandboxResult } from "@/common/sandbox";

export type EvaluateExpressionResult<T = any> = SandboxResult<T> & {
  isMock?: boolean;
};

export type TemplateSegment<T = any> = string | EvaluateExpressionResult<T>;
