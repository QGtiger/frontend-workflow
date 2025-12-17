import { autocompletion, startCompletion } from "@codemirror/autocomplete";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";

import "./index.less";
import "./theme.css";
import { dollarCompletions } from "./autocompletion/dollarCompletions";
import { useWorkflowStoreApi } from "../../../../workflowStore";
import { highlightExpressions } from "./highlightExtension";
import { blankCompletions } from "./autocompletion/blankCompletions";
import { nonDollarCompletions } from "./autocompletion/nonDollarCompletions";
import { datatypeCompletions } from "./autocompletion/datatypeCompletions";
import { tooltipExtension } from "./tooltipExtension";

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
    <CodeMirror
      theme="light"
      value={value}
      onChange={onChange}
      className=" border border-gray-300 border-solid rounded-md overflow-hidden px-1 bg-white py-px"
      placeholder="请输入表达式"
      extensions={[
        autoInsertDoubleBraces,
        EditorView.lineWrapping,
        autocompletion({ icons: false, aboveCursor: true, closeOnBlur: false }),

        autocompletion({
          override: [
            dollarCompletions(workflowStoreApi),
            blankCompletions(workflowStoreApi),
            nonDollarCompletions,
            datatypeCompletions(workflowStoreApi),
          ],
        }),
        highlightExpressions,
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
      }}
    />
  );
}
