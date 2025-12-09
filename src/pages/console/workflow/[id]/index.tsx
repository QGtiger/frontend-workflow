import Header from "./components/Header";

export default function WorkflowDetail() {
  return (
    <div className="h-full flex flex-col">
      <Header />
      <div className="flex-1 overflow-auto">{/* 工作流编辑器区域 */}</div>
    </div>
  );
}
