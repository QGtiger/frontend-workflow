import { WorkflowLayoutEditor } from "@/components/WorkflowLayout";
import Header from "./components/Header";
import { WorkflowDetailModel } from "./models";
import { useConnectorSelectorModal } from "./hooks";
import { CustomNodeRegistry } from "./utils";
import { CustomNode } from "./components/NodeRender/CustomNode";
import { SideBarRender } from "./components/NodeRender/SideBarRender";
import { CustomNodeRenderModel } from "./components/NodeRender/model";
import { NodeSelectModel } from "./nodeSelectModel";
import { useClientContext } from "@flowgram.ai/fixed-layout-editor";
import type { FlowNodeRegistry } from "@/components/WorkflowLayout/typings";
import { useEffect, useMemo } from "react";
import { motion, useAnimation } from "framer-motion";
import classNames from "classnames";
import { Resizable } from "re-resizable";
import {
  UpdateWorkflowStoreProvider,
  WorkflowStoreProvider,
} from "./workflowStore";

function SideBarPanel() {
  const { selectedId, setSelectedId } = NodeSelectModel.useModel();
  const {
    workflowData: { id, name },
  } = WorkflowDetailModel.useModel();
  const { document } = useClientContext();

  const node = selectedId ? document.getNode(selectedId) : undefined;

  const registry = node?.getNodeRegistry<FlowNodeRegistry>();
  const controls = useAnimation();

  /**
   * Close when node disposed
   */
  useEffect(() => {
    if (node) {
      const toDispose = node.onDispose(() => {
        setSelectedId("");
      });
      return () => toDispose.dispose();
    }
    return () => {};
  }, [node, setSelectedId]);

  useEffect(() => {
    if (selectedId) {
      // 如果有选中的节点，设置动画为进入状态
      controls.start({
        opacity: 1,
        x: 0,
      });
    } else {
      // 如果没有选中的节点，设置动画为退出状态
      controls.start({
        opacity: 0,
        x: "100%", // 向右移动100%
      });
    }
  }, [selectedId, controls]);

  if (!node || !registry) return null;

  return (
    <WorkflowStoreProvider id={id} name={name} flowDocument={document}>
      <UpdateWorkflowStoreProvider
        updateProps={{
          currentNodeId: node.id,
          id,
          name,
        }}
      >
        <CustomNodeRenderModel.Provider
          value={{
            node,
            registry,
          }}
        >
          {node && registry && (
            <motion.div
              initial={{ opacity: 0, x: "100%" }} // 初始状态为透明并向右偏移
              animate={controls}
              transition={{
                duration: 0.3, // 动画持续时间
              }}
              id="config-panel"
              className={classNames(
                " mr-2 flex flex-col absolute right-0 top-0 z-10  h-full   py-2",
                { " pointer-events-none": !selectedId }
              )}
            >
              <Resizable
                enable={{
                  top: false,
                  right: true,
                  bottom: false,
                  left: true,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false,
                }}
                maxWidth={700}
                minWidth={368}
                defaultSize={{ width: 400, height: "100%" }}
                className=" h-full bg-white rounded-xl overflow-hidden"
                style={{ boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)" }}
              >
                <SideBarRender key={selectedId} />
              </Resizable>
            </motion.div>
          )}
        </CustomNodeRenderModel.Provider>
      </UpdateWorkflowStoreProvider>
    </WorkflowStoreProvider>
  );
}

function WorkflowDetail() {
  const { workflowData } = WorkflowDetailModel.useModel();
  const { selectedId, setSelectedId } = NodeSelectModel.useModel();
  const {
    showConnectorSelectorModal,
    showConnectorSelectorModalContextHolder,
  } = useConnectorSelectorModal();

  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 relative overflow-hidden">
        <WorkflowLayoutEditor
          nodes={workflowData?.nodes ?? []}
          onNodesChange={() => {}}
          onAddNode={({ builtInNodes, from, addBlock }) => {
            showConnectorSelectorModal({
              builtInNodes: builtInNodes,
              addBlock(dataJson) {
                setSelectedId(dataJson.id);
                return addBlock(dataJson);
              },
              from,
            });
          }}
          nodeRegistries={[CustomNodeRegistry]}
          renderNodeForm={(props) => {
            return (
              <CustomNodeRenderModel.Provider value={props}>
                <CustomNode />
              </CustomNodeRenderModel.Provider>
            );
          }}
          onNodeSelect={setSelectedId}
          renderNodeStyle={(node) => {
            return selectedId === node.id ? { borderColor: "#82A7FC" } : {};
          }}
        >
          {showConnectorSelectorModalContextHolder}
          <SideBarPanel />
        </WorkflowLayoutEditor>
      </div>
    </div>
  );
}

export default function WorkflowDetailWrapper() {
  return (
    <NodeSelectModel.Provider>
      <WorkflowDetail />
    </NodeSelectModel.Provider>
  );
}
