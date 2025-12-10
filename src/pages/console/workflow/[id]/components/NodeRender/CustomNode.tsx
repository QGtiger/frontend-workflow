import { CustomNodeHeader } from "./Header";
import type { WithNodeProps } from "./type";

export function CustomNode({ node }: WithNodeProps) {
  return <CustomNodeHeader node={node} />;
}
