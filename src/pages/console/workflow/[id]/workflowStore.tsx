import type { FlowDocument } from "@flowgram.ai/fixed-layout-editor";
import type { CustomNodeData } from "./types";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type PropsWithChildren,
} from "react";
import { createStore, useStore } from "zustand";
import { getAllPreviousNodesByDocument } from "./workflowStoreUtils";

interface WorkflowStoreState {
  flowDocument: FlowDocument;
  currentNodeId?: string;
}

interface WorkflowStoreAction {
  getAllPreviousNodes(): CustomNodeData[];
  setStoreState(state: Partial<WorkflowStoreState>): void;
}

export type WorkflowStoreApi = WorkflowStoreAction & WorkflowStoreState;

export function createWorkflowStore(config: WorkflowStoreState) {
  const store = createStore<WorkflowStoreApi>((set, get) => {
    return {
      ...config,
      getAllPreviousNodes() {
        const { currentNodeId, flowDocument } = get();
        if (!currentNodeId) {
          return [];
        }
        return getAllPreviousNodesByDocument(currentNodeId, flowDocument);
      },
      setStoreState(state) {
        return set((originState) => {
          return {
            ...originState,
            ...state,
          };
        });
      },
    };
  });
  return store;
}

export type WorkflowStoreType = ReturnType<typeof createWorkflowStore>;

const WorkflowStoreContext = createContext<WorkflowStoreType>({} as any);

export function useWorkflowStoreApi() {
  const store = useContext(WorkflowStoreContext);
  const storeApi = useStore(store);
  return storeApi;
}

export function useUpdateWorkflowStore(props: Partial<WorkflowStoreState>) {
  const store = useContext(WorkflowStoreContext);
  const { setStoreState } = useStore(store);

  useEffect(() => {
    setStoreState(props);
  }, [props, setStoreState]);
}

export function UpdateWorkflowStoreProvider(
  props: PropsWithChildren<{
    updateProps: Partial<WorkflowStoreState>;
  }>
) {
  const { updateProps, children } = props;
  useUpdateWorkflowStore(updateProps);
  return children;
}

export function WorkflowStoreProvider(
  props: PropsWithChildren<WorkflowStoreState>
) {
  const storeRef = useRef<WorkflowStoreType>(null);
  if (storeRef.current == null) {
    storeRef.current = createWorkflowStore(props);
  }

  return (
    // eslint-disable-next-line react-hooks/refs
    <WorkflowStoreContext.Provider value={storeRef.current}>
      {props.children}
    </WorkflowStoreContext.Provider>
  );
}
