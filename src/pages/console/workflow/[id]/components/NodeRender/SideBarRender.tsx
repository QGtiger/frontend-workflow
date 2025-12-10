import { CustomNodeHeader } from "./Header";
import type { WithNodeProps } from "./type";

export function SideBarRender(props: WithNodeProps) {
  const { node } = props;
  return <CustomNodeHeader node={node} />;
}
