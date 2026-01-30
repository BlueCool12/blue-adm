import type { Category } from "@/features/categories/hooks/useCategories";
import { Box, IconButton, ListItemButton, ListItemText } from "@mui/material";
import { DragIndicatorRounded, ExpandLess, ExpandMore } from "@mui/icons-material";
import { type DraggableAttributes, type DraggableSyntheticListeners } from "@dnd-kit/core";

interface CategoryItemProps {
  category: Category;
  depth?: number;
  selectedId: number | null;
  attributes?: DraggableAttributes;
  listeners?: DraggableSyntheticListeners;
  isDragging?: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onSelect: (category: Category) => void;
}

export function CategoryItem({
  category,
  depth = 0,
  selectedId,
  attributes,
  listeners,
  isDragging,
  isOpen,
  onToggle,
  onSelect
}: CategoryItemProps) {
  const hasChildren = category.children && category.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(category);
    if (hasChildren && onToggle) {
      onToggle();
    }
  };

  return (
    <>
      <ListItemButton
        selected={selectedId === category.id}
        onClick={handleClick}
        sx={{
          pl: 2 + depth * 2,
          opacity: isDragging ? 0.5 : 1,
          bgcolor: isDragging ? 'action.hover' : 'inherit',
          border: isDragging ? '1px dashed' : 'none',
          borderColor: 'divider',
          '&.Mui-selected': {
            bgcolor: 'primary.light',
            color: 'primary.contrastText',
            '&:hover': { bgcolor: 'primary.main' },
            '& .MuiSvgIcon-root': { color: 'inherit' }
          }
        }}
      >
        {attributes && listeners && (
          <Box
            component="span"
            {...attributes}
            {...listeners}
            onClick={(e) => e.stopPropagation()}
            sx={{
              mr: 1,
              cursor: 'grab',
              display: 'flex',
              alignItems: 'center',
              touchAction: 'none',
            }}
          >
            <DragIndicatorRounded fontSize="small" color="disabled" />
          </Box>
        )}

        <ListItemText primary={category.name} secondary={`/${category.slug}`} />

        {hasChildren ? (
          <IconButton size="small" onClick={(e) => { e.stopPropagation(); onToggle?.(); }}>
            {isOpen ? <ExpandLess /> : <ExpandMore />}
          </IconButton>
        ) : null}
      </ListItemButton>
    </>
  );
}