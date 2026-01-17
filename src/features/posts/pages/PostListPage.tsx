import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { AddRounded, DeleteOutlineRounded, EditOutlined, RefreshRounded, SearchRounded } from "@mui/icons-material";
import { Box, Button, Card, Chip, Container, Divider, IconButton, InputBase, MenuItem, Pagination, Select, Skeleton, Stack, Tab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tabs, Typography } from "@mui/material";
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from "dayjs";
import { Dayjs } from 'dayjs';

import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { usePosts } from "@/features/posts/hooks/usePosts";
import { useDeletePost } from "@/features/posts/hooks/useDeletePost";
import { useCreateDraft } from "@/features/posts/hooks/useCreateDraft";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { flattenCategories } from "@/features/categories/utils/category.utils";

export default function PostListPage() {

  const navigate = useNavigate();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('ALL');
  const [categoryId, setCategoryId] = useState<number | 'ALL'>('ALL');
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

  const { data: posts, isLoading, isPlaceholderData } = usePosts(
    search,
    page,
    status,
    categoryId,
    startDate?.format('YYYY-MM-DD') ?? undefined,
    endDate?.format('YYYY-MM-DD') ?? undefined
  );

  const { data: categories } = useCategories();

  const flatCategories = React.useMemo(() => {
    return categories ? flattenCategories(categories) : [];
  }, [categories]);

  const { mutate: createDraft, isPending: isDrafting } = useCreateDraft();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleCreateDraft = () => {
    createDraft();
  };

  const handleReset = () => {
    setSearch('');
    setStatus('ALL');
    setCategoryId('ALL');
    setStartDate(null);
    setEndDate(null);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleDeleteClick = (id: string, title: string) => {
    setDeleteTarget({ id, title });
  };

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      deletePost(deleteTarget.id, {
        onSuccess: () => setDeleteTarget(null),
      });
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" disableGutters>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Box>
              <Typography variant="h5" fontWeight="bold" color="text.primary">
                차곡차곡 쌓인 지식의 기록들을 살펴보세요.
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                지금까지 작성한 소중한 생각들을 한눈에 확인하고 관리할 수 있습니다.
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddRounded />}
              onClick={handleCreateDraft}
              disabled={isDrafting}
              sx={{
                width: { xs: '100%', sm: 'auto' },
                fontWeight: 600,
                whiteSpace: 'nowrap',
                height: { xs: '40px' }
              }}
            >
              새 글 작성
            </Button>
          </Box>

          <Tabs
            value={status}
            sx={{ borderBottom: 1, borderColor: 'divider' }}
            onChange={(_, v) => { setStatus(v); setPage(1); }}
          >
            <Tab label="전체" value="ALL" />
            <Tab label="공개됨" value="PUBLISHED" />
            <Tab label="초안" value="DRAFT" />
            <Tab label="보관" value="ARCHIVED" />
          </Tabs>

          <Stack spacing={2}>
            <Stack
              spacing={2}
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'flex-end', md: 'center' }}
            >
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 0.5,
                bgcolor: 'action.hover',
                borderRadius: '12px',
                width: { xs: '100%', md: 'auto' }
              }}>
                <Select
                  size="small"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  sx={{
                    '.MuiOutlinedInput-notchedOutline': { border: 0 },
                    fontWeight: 600,
                    fontSize: '0.875rem'
                  }}
                >
                  <MenuItem value="ALL">전체</MenuItem>

                  {flatCategories.map((option, index) => {
                    const nextItem = flatCategories[index + 1];
                    const isParent = nextItem && nextItem.depth > option.depth;

                    return (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        disabled={isParent}
                        sx={{
                          pl: 2 * option.depth + 2,
                          fontSize: '0.875rem',
                          fontWeight: option.depth === 0 ? 600 : 400,
                          ...(isParent && {
                            color: 'text.secondary',
                            bgcolor: 'action.hover',
                            opacity: '1 !important',
                          })
                        }}
                      >
                        {option.name}
                      </MenuItem>
                    );
                  })}
                </Select>

                <Divider orientation="vertical" flexItem sx={{ my: 1, mx: 0.5 }} />

                <InputBase
                  placeholder="제목 혹은 내용 검색"
                  value={search}
                  onChange={handleSearchChange}
                  sx={{ ml: 1, flex: 1, fontSize: '0.875rem' }}
                />
                <SearchRounded sx={{ color: 'text.disabled', mr: 1 }} fontSize="small" />
              </Box>

              <Box sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 2,
                height: '45px',
                bgcolor: 'action.hover',
                borderRadius: '12px',
                width: 'fit-content',
              }}>
                <DatePicker
                  value={startDate}
                  onChange={(newValue) => setStartDate(newValue)}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      placeholder: '시작일',
                      sx: {
                        width: '145px',
                        '& .MuiInputBase-root': { minWidth: 0 },
                        '& .MuiInputBase-input': { p: 0 }
                      },
                      InputProps: { disableUnderline: true },
                    },
                    openPickerButton: { size: 'small' }
                  }}
                />

                <Typography sx={{ mx: 0.5, color: 'text.disabled', fontWeight: 300, userSelect: 'none' }}>|</Typography>

                <DatePicker
                  value={endDate}
                  onChange={(newValue) => setEndDate(newValue)}
                  format="YYYY-MM-DD"
                  slotProps={{
                    textField: {
                      size: 'small',
                      variant: 'standard',
                      placeholder: '종료일',
                      sx: {
                        width: '145px',
                        '& .MuiInputBase-root': { minWidth: 0 },
                        '& .MuiInputBase-input': { p: 0 }
                      },
                      InputProps: { disableUnderline: true },
                    },
                    openPickerButton: { size: 'small' }
                  }}
                />
              </Box>
            </Stack>

            <Stack
              direction="row"
              justifyContent="flex-end"
              alignItems="center"
              spacing={1}
            >
              <Typography variant="body2" color="text.secondary">
                검색 결과 총 <b>{posts?.total ?? 0}</b>개의 게시물이 발견되었습니다.
              </Typography>

              <IconButton
                size="small"
                title="필터 초기화"
                sx={{ border: '1px solid', borderColor: 'divider' }}
                onClick={handleReset}
              >
                <RefreshRounded fontSize="small" />
              </IconButton>
            </Stack>
          </Stack>

          <Card
            elevation={0}
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              overflowX: 'auto',
              opacity: isPlaceholderData ? 0.6 : 1,
              transition: 'opacity 0.2s'
            }}
          >
            <TableContainer sx={{ minWidth: { xs: 600, sm: 'auto' } }}>
              <Table>
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell width={80} align="center">번호</TableCell>
                    <TableCell>제목</TableCell>
                    <TableCell width={120} align="center">상태</TableCell>
                    <TableCell width={150} align="center">작성일</TableCell>
                    <TableCell width={120} align="center">관리</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell colSpan={10}><Skeleton variant="text" height={40} /></TableCell>
                      </TableRow>
                    ))
                  ) : posts?.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                        <Typography color="text.secondary">검색 결과가 없습니다.</Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    posts?.items.map((post) => (
                      <TableRow key={post.id} hover>

                        <TableCell align="center">{post.id}</TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            fontWeight={500}
                            sx={{
                              cursor: 'pointer',
                              '&:hover': { color: 'primary.main' },
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              display: '-webkit-box',
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: 'vertical',
                            }}
                            onClick={() => navigate(`/posts/${post.id}/edit`)}
                          >
                            {post.title}
                          </Typography>
                        </TableCell>

                        <TableCell align="center">
                          {(() => {
                            const status = post.publishInfo?.status;
                            const statusConfig = {
                              PUBLISHED: { label: '공개', color: 'info' as const },
                              DRAFT: { label: '초안', color: 'default' as const },
                              ARCHIVED: { label: '보관', color: 'warning' as const },
                            };

                            const config = statusConfig[status as keyof typeof statusConfig] || { label: status, color: 'default' as const };

                            return (
                              <Chip
                                label={config.label}
                                size="small"
                                variant="outlined"
                                color={config.color}
                                sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                              />
                            );
                          })()}
                        </TableCell>

                        <TableCell color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                          {dayjs(post.createdAt).format('YYYY-MM-DD')}
                        </TableCell>

                        <TableCell align="center">
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <IconButton
                              size="small"
                              sx={{
                                color: 'text.disabled',
                                '&:hover': {
                                  color: 'primary.main'
                                }
                              }}
                              onClick={() => navigate(`/posts/${post.id}/edit`)}
                            >
                              <EditOutlined fontSize="small" />
                            </IconButton>

                            <IconButton
                              size="small"
                              sx={{
                                color: 'text.disabled',
                                '&:hover': {
                                  color: 'error.main'
                                }
                              }}
                              onClick={() => handleDeleteClick(post.id, post.title)}
                            >
                              <DeleteOutlineRounded fontSize="small" />
                            </IconButton>
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>

          <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
            <Pagination
              count={posts?.lastPage ?? 1}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              shape="rounded"
            />
          </Box>
        </Stack>

        {/* Confirm Dialog */}
        <ConfirmDialog
          open={Boolean(deleteTarget)}
          title="글 삭제"
          content={
            <>
              정말로 <b>{deleteTarget?.title}</b> 글을 삭제하시겠습니까? <br /><br />
              삭제된 데이터는 복구할 수 없습니다.
            </>
          }
          isLoading={isDeleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleConfirmDelete}
        />
      </Container>
    </LocalizationProvider>
  );
}