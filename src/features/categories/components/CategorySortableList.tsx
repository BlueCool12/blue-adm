import type { Category } from "../hooks/useCategories";
import { closestCenter, DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { FolderOffRounded } from "@mui/icons-material";
import { Box, CircularProgress, List, Paper, Stack, Typography } from "@mui/material";
import { SortableTreeItem } from "./SortableTreeItem";

interface CategorySortableListProps {
  items: Category[];
  isLoading: boolean;
  selectedId: number | null;
  onSelect: (category: Category) => void;
  onReorder: (newItems: Category[], changeIds: number[]) => void;
}

export function CategorySortableList({ items, isLoading, selectedId, onSelect, onReorder }: CategorySortableListProps) {

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const updateTreeItems = (
    currentItems: Category[],
    activeId: number,
    overId: number
  ): Category[] => {
    const activeIndex = currentItems.findIndex((item) => item.id === activeId);
    const overIndex = currentItems.findIndex((item) => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) return arrayMove(currentItems, activeIndex, overIndex);

    return currentItems.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: updateTreeItems(item.children, activeId, overId),
        };
      }
      return item;
    });
  };

  const findSiblingIds = (tree: Category[], targetId: number): number[] | null => {
    if (tree.some(item => item.id === targetId)) return tree.map(item => item.id);

    for (const item of tree) {
      if (item.children && item.children.length > 0) {
        const found = findSiblingIds(item.children, targetId);
        if (found) return found;
      }
    }

    return null;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const newItems = updateTreeItems(items, Number(active.id), Number(over.id));
    const changeIds = findSiblingIds(newItems, Number(active.id));

    if (changeIds) {
      onReorder(newItems, changeIds);
    }
  };

  return (
    <Paper elevation={3} sx={{ borderRadius: '12px', overflow: 'hidden', minHeight: '600px' }}>
      <Box sx={{ p: 2, bgcolor: 'background.default', borderBottom: '1px solid #eee' }}>
        <Typography variant="subtitle1" fontWeight="bold">
          카테고리 목록
        </Typography>
      </Box>

      <Box sx={{ p: 0 }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : items.length === 0 ? (
          <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ py: 10, color: 'text.secondary' }}>
            <FolderOffRounded sx={{ fontSize: 60, opacity: 0.5 }} />
            <Typography variant="body1">등록된 카테고리가 없습니다.</Typography>
          </Stack>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
              <List component="nav">
                {items.map((category) => (
                  <SortableTreeItem
                    key={category.id}
                    category={category}
                    selectedId={selectedId}
                    onSelect={onSelect}
                  />
                ))}
              </List>
            </SortableContext>
          </DndContext>
        )}
      </Box>
    </Paper>
  );
}