import { useNodeData } from "../../models/NodeRenderModal";

export function FormContent() {
  const { description } = useNodeData();
  return <div className="p-3 whitespace-break-spaces">{description}</div>;
}
