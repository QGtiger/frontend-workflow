import { useParams } from "react-router-dom";

export function useWorkflowId() {
  const { id } = useParams();
  return id;
}
