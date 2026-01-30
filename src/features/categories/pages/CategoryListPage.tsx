import { Box, Button, CircularProgress, Container, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useCategories, type Category } from "@/features/categories/hooks/useCategories";
import React, { useEffect, useMemo, useState } from "react";
import { AddRounded, RefreshRounded, RemoveCircleOutlineRounded, SaveRounded } from "@mui/icons-material";
import { flattenCategories } from "@/features/categories/utils/category.utils";
import { useCreateCategory } from "@/features/categories/hooks/useCreateCategory";
import { useUpdateCategory } from "@/features/categories/hooks/useUpdateCategory";
import { useDeleteCategory } from "@/features/categories/hooks/useDeleteCategory";
import { useAlert } from "@/shared/hooks/useAlert";
import ConfirmDialog from "@/shared/components/ConfirmDialog";
import { CategorySortableList } from "../components/CategorySortableList";
import { useReorderCategory } from "../hooks/useReorderCategory";

export default function CategoryListPage() {

  const { showAlert } = useAlert();

  const { data: serverCategories = [], isLoading } = useCategories();
  const [items, setItems] = useState<Category[]>([]);

  useEffect(() => {
    if (serverCategories) setItems(serverCategories);
  }, [serverCategories]);

  const { mutate: createCategory, isPending: isCreating } = useCreateCategory();
  const { mutate: updateCategory, isPending: isUpdating } = useUpdateCategory();
  const { mutate: reorderCategory } = useReorderCategory();
  const { mutate: deleteCategory, isPending: isDeleting } = useDeleteCategory();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const isPending = isCreating || isUpdating || isDeleting;

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [parentId, setParentId] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const categoryOptions = useMemo(() => flattenCategories(items), [items]);

  const handleSelect = (category: Category) => {
    setSelectedId(category.id);
    setName(category.name);
    setSlug(category.slug);
    setParentId(category.parentId ?? null);
  };

  const handleReset = () => {
    setSelectedId(null);
    setName('');
    setSlug('');
    setParentId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) {
      showAlert('카테고리 이름과 슬러그는 필수입니다.', 'warning');
      return;
    }

    const payload = { name, slug, parentId };

    if (selectedId) {
      updateCategory(
        { id: selectedId, payload },
        {
          onSuccess: () => {
            handleReset();
          }
        }
      );
    } else {
      createCategory(payload, {
        onSuccess: () => {
          handleReset();
          showAlert('카테고리가 성공적으로 생성되었습니다!', 'success');
        }
      })
    }
  }

  const handleConfirmDelete = () => {
    if (selectedId) {
      deleteCategory(selectedId, {
        onSuccess: () => {
          setIsConfirmOpen(false);
          handleReset();
        },
      });
    }
  };

  const handleReorder = (newItems: Category[], changeIds: number[]) => {
    const previousItems = items;
    setItems(newItems);

    reorderCategory(changeIds, {
      onError: () => {
        setItems(previousItems);
      }
    })
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" fontWeight="bold" color="text.primary">
          블로그의 목차를 정리해보세요.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          카테고리를 추가하거나 수정하여 글을 찾기 쉽게 분류할 수 있습니다.
        </Typography>
      </Box>

      <Grid container spacing={3} alignItems="flex-start">
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper
            elevation={3}
            sx={{
              p: 3,
              borderRadius: '12px',
              bgcolor: 'background.paper',
              backgroundImage: 'none',
              border: '1px solid',
              borderColor: 'divider'
            }}
          >
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                {selectedId ? '카테고리 수정' : '새 카테고리 추가'}
              </Typography>

              {selectedId && (
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  startIcon={<RemoveCircleOutlineRounded />}
                  onClick={() => setIsConfirmOpen(true)}
                  disabled={isPending}
                >
                  삭제
                </Button>
              )}
            </Box>

            <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
              <Grid container spacing={2}>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    select
                    fullWidth
                    label="상위 카테고리"
                    size="small"
                    value={parentId ?? ''}
                    onChange={(e) => {
                      const val = e.target.value;
                      setParentId(val === '' ? null : Number(val));
                    }}
                    slotProps={{
                      select: {
                        displayEmpty: true
                      },
                      inputLabel: { shrink: true }
                    }}
                  >
                    <MenuItem value="">
                      <Typography color="text.secondary" fontStyle="italic">
                        (없음 - 최상위 카테고리)
                      </Typography>
                    </MenuItem>

                    {categoryOptions.map((option) => (
                      <MenuItem
                        key={option.id}
                        value={option.id}
                        disabled={option.id === selectedId}
                        sx={{ pl: 2 + option.depth * 2 }}
                      >
                        {option.depth > 0 && (
                          <Box
                            sx={{
                              width: 10,
                              height: 10,
                              borderLeft: '1px solid',
                              borderBottom: '1px solid',
                              borderColor: 'divider',
                              mr: 1,
                              mt: -1
                            }}
                          />
                        )}
                        {option.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="카테고리 이름"
                    placeholder="예: Java"
                    size="small"
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <TextField
                    fullWidth
                    label="URL 슬러그 (Slug)"
                    placeholder="예: java"
                    size="small"
                    helperText="영문 소문자와 하이픈(-)만 사용"
                    slotProps={{
                      inputLabel: { shrink: true }
                    }}
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                  />
                </Grid>

                <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="medium"
                    startIcon={selectedId ? <SaveRounded /> : <AddRounded />}
                    sx={{ fontWeight: 'bold' }}
                    disabled={isPending}
                  >
                    {isPending ? <CircularProgress size={24} color="inherit" /> : (selectedId ? '저장' : '생성')}
                  </Button>
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <Button
                    fullWidth
                    variant="text"
                    size="small"
                    startIcon={<RefreshRounded />}
                    onClick={handleReset}
                  >
                    초기화 (새로 만들기)
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <CategorySortableList
            items={items}
            isLoading={isLoading}
            selectedId={selectedId}
            onSelect={handleSelect}
            onReorder={handleReorder}
          />
        </Grid>
      </Grid>



      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isConfirmOpen}
        title="카테고리 삭제"
        content={
          <>
            <Typography variant="body1" component="span" sx={{ display: 'block', mb: 1 }}>
              정말로 <b>{name}</b> 카테고리를 삭제하시겠습니까?
            </Typography>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: 'block', mt: 2, bgcolor: 'action.hover', p: 1, borderRadius: 1 }}
            >
              ※ 하위 카테고리나 게시글이 연결되어 있으면 삭제되지 않습니다.
            </Typography>
          </>
        }
        isLoading={isPending}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </Container>
  );
}