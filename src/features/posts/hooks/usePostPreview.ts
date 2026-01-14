import { useCallback, useEffect, type RefObject } from "react";
import type { PostResponse } from "@/features/posts/hooks/usePost";
import type { PostEditorHandle } from "@/features/posts/components/editor/PostEditorTypes";
import dayjs from "dayjs";

export function usePostPreview(
  iframeUrl: string,
  iframeRef: RefObject<HTMLIFrameElement | null>,
  isPreviewOpen: boolean,
  title: string,
  post: PostResponse | undefined,
  editorRef: RefObject<PostEditorHandle | null>
) {
  const sendPreviewData = useCallback(() => {
    if (!iframeRef.current?.contentWindow) return;
    const { html } = editorRef.current?.getContent() || { html: "" };

    iframeRef.current.contentWindow.postMessage(
      {
        type: "PREVIEW_DATA",
        payload: {
          title: title,
          content: html,
          category: post?.publishInfo?.category?.name || "임시 카테고리",
          createdAt: dayjs(post?.createdAt).format('YYYY-MM-DD'),
        },
      },
      iframeUrl
    );
  }, [title, post, editorRef, iframeRef, iframeUrl]);


  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== iframeUrl) return;
      if (event.data.type === 'PREVIEW_READY') sendPreviewData();
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [sendPreviewData, iframeUrl]);


  useEffect(() => {
    if (!isPreviewOpen) return;
    const timer = setTimeout(sendPreviewData, 400);
    return () => clearTimeout(timer);
  }, [title, isPreviewOpen, sendPreviewData]);

  return { sendPreviewData };
}