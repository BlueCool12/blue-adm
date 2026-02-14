import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Button, Container, Divider, Stack, TextField } from "@mui/material";
import { CheckCircleOutlineRounded, DriveFileRenameOutlineRounded, VisibilityOutlined } from "@mui/icons-material";

import { PostEditor } from "@/features/posts/components/editor/PostEditor";
import PostPublishModal from "@/features/posts/components/PostPublishModal";

import { usePost } from "@/features/posts/hooks/usePost";
import { useUpdatePost } from "@/features/posts/hooks/useUpdatePost";
import { usePostPreview } from "@/features/posts/hooks/usePostPreview";
import { useAlert } from "@/shared/hooks/useAlert";

import { PostStatus } from "@/features/posts/types/post";
import type { PostEditorHandle } from "@/features/posts/components/editor/PostEditorTypes";

export interface PublishDataState {
  slug: string;
  description: string;
  categoryId: number;
  status: PostStatus;
}

const IFRAME_SITE_URL = 'https://pyomin.com';

export default function PostEditPage() {

  const navigate = useNavigate();
  const { showAlert } = useAlert();
  const { postId } = useParams() as { postId: string };

  const editorRef = useRef<PostEditorHandle>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [publishData, setPublishData] = useState<PublishDataState>({
    slug: "", description: "", categoryId: 0, status: PostStatus.DRAFT as PostStatus,
  });

  const { data: post, isPending: isLoading } = usePost(postId);
  const { mutate: updatePost, isPending: isUpdating } = useUpdatePost();
  const { sendPreviewData } = usePostPreview(IFRAME_SITE_URL, iframeRef, isPreviewOpen, title, post, editorRef);

  useEffect(() => {
    if (post) {
      setTitle(post.title || "");
      if (post.publishInfo) {
        setPublishData({
          slug: post.publishInfo.slug || "",
          description: post.publishInfo.description || "",
          categoryId: post.publishInfo.category?.id || 0,
          status: post.publishInfo.status || PostStatus.DRAFT,
        })
      }
    }
  }, [post]);

  const getPayload = () => {
    const { html, json, markdown } = editorRef.current?.getContent() || { html: '', json: '', markdown: '' };
    return { title, content: html, contentJson: json, contentMarkdown: markdown, description: publishData.description, categoryId: publishData.categoryId }
  }

  const handlePublishDataChange = <K extends keyof PublishDataState>(key: K, value: PublishDataState[K]) => {
    setPublishData(prev => ({ ...prev, [key]: value }));
  };

  const handleDraftSave = () => {
    const payload = getPayload();

    updatePost(
      {
        id: postId,
        payload: {
          ...payload,
          slug: publishData.slug || null,
          status: PostStatus.DRAFT,
        },
      },
      {
        onSuccess: () => {
          showAlert('임시 저장되었습니다!', 'success');
        },
      }
    );
  };

  const handleConfirm = () => {
    const slug = publishData.slug?.trim();
    const description = publishData.description?.trim();
    const categoryId = publishData.categoryId;

    if (publishData.status === PostStatus.PUBLISHED) {
      if (!slug) {
        return showAlert('URL SLUG를 입력해주세요.', 'warning');
      }
      if (!description) {
        return showAlert('요약 내용을 입력해주세요.', 'warning');
      }
      if (!categoryId) {
        return showAlert('카테고리를 선택해주세요.', 'warning');
      }
    }

    const payload = getPayload();

    updatePost(
      {
        id: postId,
        payload: {
          ...payload,
          slug: slug,
          description: description,
          categoryId: categoryId,
          status: publishData.status,
        },
      },
      {
        onSuccess: () => {
          const message = publishData.status === PostStatus.PUBLISHED
            ? '성공적으로 발행되었습니다! 🎉'
            : '성공적으로 저장되었습니다.';

          showAlert(message, 'success');
          setIsModalOpen(false);
          navigate('/posts');
        },
      }
    );
  };

  if (!postId) return <div>잘못된 접근이거나 로딩 중입니다.</div>;
  if (isLoading) return <div>데이터를 불러오는 중...</div>;

  return (
    <Container
      maxWidth="md"
      sx={{
        py: 2,
        px: { xs: 0, sm: 2, md: 3 }
      }}
    >
      <Stack spacing={3}>

        <TextField
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          variant="standard"
          fullWidth
          slotProps={{
            htmlInput: {
              style: { fontSize: '2rem', fontWeight: 'bold' }
            }
          }}
          sx={{
            '& .MuiInput-underline:before': { borderBottomColor: 'divider' },
            '& .MuiInput-underline:after': { borderBottomColor: 'primary.main' },
          }}
        />

        <PostEditor
          postId={postId}
          ref={editorRef}
          initialContent={post?.content}
        />

        <Divider sx={{ my: 2 }} />

        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'stretch', sm: 'center' }}
          spacing={2}
        >
          <Button
            variant="contained"
            color="info"
            size="large"
            startIcon={<VisibilityOutlined />}
            onClick={() => setIsPreviewOpen(true)}
          >
            미리 보기
          </Button>

          <Stack
            direction="row"
            spacing={2}
            sx={{ width: { xs: '100%', sm: 'auto' } }}
          >
            <Button
              variant="outlined"
              color="primary"
              size="large"
              fullWidth
              startIcon={<DriveFileRenameOutlineRounded />}
              onClick={handleDraftSave}
              disabled={isUpdating}
            >
              임시 저장
            </Button>
            <Button
              variant="contained"
              disableElevation
              size="large"
              fullWidth
              startIcon={<CheckCircleOutlineRounded />}
              onClick={() => setIsModalOpen(true)}
              disabled={isUpdating}
            >
              작성 완료
            </Button>
          </Stack>
        </Stack>

      </Stack>

      {/* 미리보기 iframe */}
      {isPreviewOpen && (
        <Box
          sx={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            bgcolor: 'background.paper', zIndex: 9999, display: 'flex', flexDirection: 'column'
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Box sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>실시간 미리보기</Box>
            <Button variant="contained" color="error" size="small" onClick={() => setIsPreviewOpen(false)}>
              미리보기 닫기
            </Button>
          </Stack>

          <Box sx={{ flexGrow: 1, position: 'relative', bgcolor: '#f5f5f5' }}>
            <iframe
              ref={iframeRef}
              src={`${IFRAME_SITE_URL}/posts/preview`}
              style={{ width: '100%', height: '100%', border: 'none', backgroundColor: 'transparent' }}
              onLoad={sendPreviewData}
            />
          </Box>
        </Box>
      )}

      {/* 공개 설정 모달 */}
      <PostPublishModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        data={publishData}
        onChange={handlePublishDataChange}
        onConfirm={handleConfirm}
      />
    </Container>
  );
}