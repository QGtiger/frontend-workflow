import { ifIn } from "@codemirror/autocomplete";

import { parser } from "./syntax.ts";
import {
  LRLanguage,
  LanguageSupport,
  foldNodeProp,
  foldInside,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
import { parseMixed, type SyntaxNodeRef } from "@lezer/common";
import { javascriptLanguage } from "@codemirror/lang-javascript";
import type { WorkflowStoreApi } from "../../../../../models/workflowStore/index.tsx";
import { dollarCompletions } from "../autocompletion/dollarCompletions";
import { blankCompletions } from "../autocompletion/blankCompletions";
import { nonDollarCompletions } from "../autocompletion/nonDollarCompletions";
import { datatypeCompletions } from "../autocompletion/datatypeCompletions";

const isResolvable = (node: SyntaxNodeRef) => node.type.name === "Resolvable";

const parserWithMetaData = parser.configure({
  props: [
    foldNodeProp.add({
      Application: foldInside,
    }),
    styleTags({
      OpenMarker: t.brace,
      CloseMarker: t.brace,
      Plaintext: t.content,
      Resolvable: t.string,
    }),
  ],
});

const expressionLanguageWithNestedJsParser = parserWithMetaData.configure({
  wrap: parseMixed((node) => {
    if (node.type.isTop) return null;

    return node.name === "Resolvable"
      ? { parser: javascriptLanguage.parser, overlay: isResolvable }
      : null;
  }),
});

/**
 * 创建表达式语言支持
 * 使用最小化的语言扩展，只提供 autocomplete 数据
 */
export function createExpressionLanguageSupport(
  workflowStoreApi: WorkflowStoreApi
) {
  // 创建最小语言，复用 JS parser，只提供 autocomplete
  const expressionLanguage = LRLanguage.define({
    // @ts-expect-error lezer-lr v1.4.5
    parser: expressionLanguageWithNestedJsParser,
  });

  return new LanguageSupport(
    expressionLanguage,
    [
      dollarCompletions(workflowStoreApi),
      blankCompletions(workflowStoreApi),
      nonDollarCompletions,
      datatypeCompletions(workflowStoreApi),
    ].map((source) =>
      expressionLanguage.data.of({ autocomplete: ifIn(["Resolvable"], source) })
    )
  );
}
