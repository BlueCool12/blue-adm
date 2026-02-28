import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { PostEditorHandle } from "@/features/posts/components/editor/PostEditorTypes";
import { forwardRef, useEffect, useImperativeHandle, useRef, useCallback } from "react";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";
import { $getRoot, $insertNodes } from "lexical";

interface PostEditorStatePluginProps {
  initialContent?: string | null;
}

const PostEditorStatePlugin = forwardRef<PostEditorHandle, PostEditorStatePluginProps>(
  ({ initialContent }, ref) => {
    const [editor] = useLexicalComposerContext();
    const isLoaded = useRef(false);

    const updateEditorContent = useCallback((content: string) => {
      if (!content) return;

      // JSON 데이터 처리
      try {
        const parsed = JSON.parse(content);
        if (parsed.root) {
          const newState = editor.parseEditorState(parsed);
          editor.setEditorState(newState);
          return;
        }
      } catch (e) {
        // JSON 파싱 실패 시 HTML로 간주하여 처리 흐름 유지
      }

      // HTML 데이터 처리
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(content, 'text/html');
        const nodes = $generateNodesFromDOM(editor, dom);
        const root = $getRoot();
        root.clear();
        root.select();
        $insertNodes(nodes);
      });
    }, [editor]);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editor.getEditorState().read(() => {
          // JSON
          const json = JSON.stringify(editor.getEditorState().toJSON());
          // HTML
          const html = $generateHtmlFromNodes(editor, null);
          // Markdown
          const markdown = $convertToMarkdownString(TRANSFORMERS);

          return { json, html, markdown }
        });
      },
      setContent: (content: string) => {
        updateEditorContent(content);
      },
    }));

    useEffect(() => {
      if (!initialContent || isLoaded.current) return;
      isLoaded.current = true;

      updateEditorContent(initialContent);
    }, [initialContent, updateEditorContent]);

    return null;
  }
);

export default PostEditorStatePlugin;