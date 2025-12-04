import { EditorRenderer, FixedLayoutEditorProvider } from '@flowgram.ai/fixed-layout-editor';
import '@flowgram.ai/fixed-layout-editor/index.css';
import { defaultFixedSemiMaterials } from '@flowgram.ai/fixed-semi-materials';

export const FlowGramApp = () => {
  return (
    <FixedLayoutEditorProvider
      materials={{ components: defaultFixedSemiMaterials }}
    >
      <EditorRenderer />
    </FixedLayoutEditorProvider>
  );
};