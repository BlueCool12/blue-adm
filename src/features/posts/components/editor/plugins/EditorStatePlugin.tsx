import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { PostEditorHandle } from "@/features/posts/components/editor/PostEditorTypes";
import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
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
    }));

    useEffect(() => {
      if (!initialContent || isLoaded.current) return;

      isLoaded.current = true;

      // JSON 데이터 (새로 작성한 글)
      try {
        const parsed = JSON.parse(initialContent);
        if (parsed.root) {
          const newState = editor.parseEditorState(parsed);
          editor.setEditorState(newState);
          return;
        }
      } catch (e) {
        console.error(e);
      }

      // HTML 데이터 (CKEditor)
      editor.update(() => {
        const parser = new DOMParser();
        const dom = parser.parseFromString(initialContent, 'text/html');

        const nodes = $generateNodesFromDOM(editor, dom);

        const root = $getRoot();
        root.clear();
        root.select();
        $insertNodes(nodes);
      });

    }, [editor, initialContent]);

    return null;
  }
);

export default PostEditorStatePlugin;