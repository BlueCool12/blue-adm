export interface PostEditorHandle {
  getContent: () => { json: string; html: string; markdown: string; };
  setContent: (content: string) => void;
}

export interface PostEditorProps {
  initialContent?: string | null;
  postId: string;
}