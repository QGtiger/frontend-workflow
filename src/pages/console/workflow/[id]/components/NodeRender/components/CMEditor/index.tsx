import { autocompletion, startCompletion } from "@codemirror/autocomplete";
import CodeMirror, { EditorView, keymap } from "@uiw/react-codemirror";

import "./index.less";
import "./theme.css";
import { useWorkflowStoreApi } from "../../../../models/workflowStore";
import { highlightExtension } from "./highlightExtension";
import { createTooltipExtension } from "./tooltipExtension";
import { createCompletionSources } from "./langParse";
import classNames from "classnames";
import { useMemo } from "react";

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
  onFocus,
  onBlur,
  className,
}: {
  value?: string;
  onChange?: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
}) {
  const workflowStoreApi = useWorkflowStoreApi();

  const completionSources = useMemo(() => {
    return createCompletionSources(workflowStoreApi);
  }, [workflowStoreApi]);

  const tooltipExt = useMemo(() => {
    return createTooltipExtension(completionSources);
  }, [completionSources]);

  return (
    <div className={classNames("cm-editor-wrapper", className)}>
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
          autocompletion({
            override: completionSources,
          }),
          highlightExtension(workflowStoreApi),
          tooltipExt,
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
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
}
