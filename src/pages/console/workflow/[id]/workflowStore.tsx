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
import {
  generateMockDataByOutputStruct,
  getAllPreviousNodesByDocument,
} from "./workflowStoreUtils";
import { executeSandboxSync } from "@/common/sandbox";

interface WorkflowStoreState {
  flowDocument: FlowDocument;
  currentNodeId?: string;
  name: string;
  id: string;
}

interface WorkflowStoreAction {
  getAllPreviousNodes(): CustomNodeData[];
  setStoreState(state: Partial<WorkflowStoreState>): void;
  evaluateExpression(expression: string): any;
}

export type WorkflowStoreApi = WorkflowStoreAction & WorkflowStoreState;

export function createWorkflowStore(config: WorkflowStoreState) {
  const store = createStore<WorkflowStoreApi>((set, get) => {
    function $(nodeName: string) {
      if (!nodeName) {
        throw new Error("当使用 $ 符号时，必须传入节点名称");
      }
      const { flowDocument } = get();
      // 通过 nodeName 找到节点
      let nodeJson: CustomNodeData | undefined;
      flowDocument.traverse((it) => {
        const itJson = it.toJSON();
        if (itJson.data?.name === nodeName) {
          nodeJson = itJson.data as CustomNodeData;
          return true;
        }
      });
      if (!nodeJson) {
        throw new Error(`节点 ${nodeName} 不存在`);
      }
      const { outputStruct, sampleData } = nodeJson;
      if (!outputStruct && !sampleData) {
        throw new Error(`节点 ${nodeName} 没有输出结构或样本数据`);
      }
      return {
        isExecuted: !!sampleData,
        outputs:
          sampleData || generateMockDataByOutputStruct(outputStruct || []),
      };
    }

    return {
      ...config,
      evaluateExpression(expression) {
        return executeSandboxSync(expression, {
          $,
          globals: {
            $workflow: {
              name: config.name,
              id: config.id,
            },
            $now: new Date(),
          },
        });
      },
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
