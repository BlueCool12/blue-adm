import { useState } from "react";
import { Box, CircularProgress, Container, Pagination, Stack, Tab, Tabs, Typography } from "@mui/material";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { CommentItem } from "@/features/comments/components/CommentItem";
import type { CommentStatus } from "@/features/comments/types/comment";
import { useUpdateCommentStatus } from "@/features/comments/hooks/useUpdateCommentStatus";
import { useComments } from "@/features/comments/hooks/useComments";
import { useCreateReply } from "@/features/comments/hooks/useCreateReply";

export default function CommentListPage() {

  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(1);
  const limit = 4;

  const isRepliedFilter = tab === 0 ? undefined : (tab === 1 ? false : true);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const { data: comments, isLoading } = useComments({ page, limit, replied: isRepliedFilter });

  const { mutate: updateStatus, isPending: isUpdating } = useUpdateCommentStatus();
  const { mutate: createReply, isPending: isReplying } = useCreateReply();

  const handleUpdateStatus = (id: string, status: CommentStatus) => {
    updateStatus({ id, status });
  };

  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      updateStatus(
        { id: deleteTargetId, status: 'DELETED' },
        { onSettled: () => setDeleteTargetId(null) }
      );
    }
  };

  const handleReplySubmit = async (parentId: string, content: string) => {
    await createReply({ parentId, content });
  }

  return (
    <Container maxWidth="lg" disableGutters>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          전체 게시글에 등록된 댓글을 확인하고 관리합니다.
        </Typography>
        <Typography variant="body2" color="text.secondary">
          방문자들의 소중한 피드백을 확인하고 답글을 남겨보세요.
        </Typography>
      </Box>

      <Tabs
        value={tab}
        onChange={(_, v) => {
          setTab(v);
          setPage(1);
        }}
        sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
      >
        <Tab label="전체 댓글" sx={{ fontWeight: 600 }} />
        <Tab label="답변 대기" sx={{ fontWeight: 600 }} />
        <Tab label="답변 완료" sx={{ fontWeight: 600 }} />
      </Tabs>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          {comments?.items.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onUpdateStatus={handleUpdateStatus}
              onDeleteClick={handleDeleteClick}
              onReplySubmit={handleReplySubmit}
              isReplying={isReplying}
            />
          ))}

          {comments?.items.length === 0 && (
            <Typography variant="body2" color="text.disabled" textAlign="center" sx={{ py: 10 }}>
              댓글이 존재하지 않습니다.
            </Typography>
          )}
        </Stack>
      )}

      {comments && comments.total > 0 && (
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={Math.ceil(comments.total / limit)}
            page={page}
            color="primary"
            shape="rounded"
            onChange={(_, p) => setPage(p)}
          />
        </Box>
      )}


      {/* Confirm Dialog */}
      <ConfirmDialog
        open={Boolean(deleteTargetId)}
        title="댓글 삭제"
        content="이 댓글을 삭제 처리하시겠습니까?"
        confirmText="삭제"
        confirmColor="error"
        isLoading={isUpdating}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}