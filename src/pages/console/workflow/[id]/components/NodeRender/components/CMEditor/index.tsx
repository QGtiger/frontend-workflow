import { autocompletion, startCompletion } from "@codemirror/autocomplete";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";

import "./index.less";
import "./theme.css";
import { useWorkflowStoreApi } from "../../../../workflowStore";
import { highlightExtension } from "./highlightExtension";
import { tooltipExtension } from "./tooltipExtension";
import { createExpressionLanguageSupport } from "./langParse";

const autoInsertDoubleBraces = keymap.of([
  {
    key: "{",
    run: (view) => {
      const { state } = view;
      const { from } = state.selection.main;

      // 判断光标前一个 是否也是 {
      const beforeChar = state.sliceDoc(from - 1, from);
      if (beforeChar === "{") {
        view.dispatch({
          changes: { from, to: from, insert: "{  }" },
          selection: { anchor: from + 2 }, // 光标移到中间
        });
        startCompletion(view);
      } else {
        return false;
      }

      return true;
    },
  },
]);

export function CMEditor({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (value: string) => void;
}) {
  const workflowStoreApi = useWorkflowStoreApi();

  return (
    <div className="cm-editor-wrapper">
      <div className="cm-editor-fx-badge">
        <span>fx</span>
      </div>
      <CodeMirror
        theme="light"
        value={value}
        onChange={onChange}
        className="cm-editor-input"
        placeholder="请输入表达式"
        extensions={[
          autoInsertDoubleBraces,
          EditorView.lineWrapping,
          autocompletion({
            icons: false,
            aboveCursor: true,
            closeOnBlur: false,
          }),
          createExpressionLanguageSupport(workflowStoreApi),
          highlightExtension(workflowStoreApi),
          tooltipExtension,
        ]}
        basicSetup={{
          lineNumbers: false,
          highlightActiveLine: false,
          highlightSelectionMatches: false,
          bracketMatching: false,
          // closeBrackets: false,
          foldGutter: false,
          drawSelection: false,
          syntaxHighlighting: false,
        }}
      />
    </div>
  );
}
