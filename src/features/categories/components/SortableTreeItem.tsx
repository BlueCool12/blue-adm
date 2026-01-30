import { useState } from "react";
import { CSS } from '@dnd-kit/utilities'
import type { Category } from "../hooks/useCategories";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CategoryItem } from "./CategoryItem";
import { Collapse, List } from "@mui/material";

interface SortableTreeItemProps {
  category: Category;
  depth?: number;
  selectedId: number | null;
  onSelect: (category: Category) => void;
}

export function SortableTreeItem({ category, depth = 0, selectedId, onSelect }: SortableTreeItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = category.children && category.children.length > 0;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: category.id });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <CategoryItem
        category={category}
        depth={depth}
        selectedId={selectedId}
        onSelect={onSelect}
        attributes={attributes}
        listeners={listeners}
        isDragging={isDragging}
        isOpen={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
      />

      {hasChildren && (
        <Collapse in={isOpen} timeout="auto" unmountOnExit>
          <SortableContext
            items={category.children!.map(c => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <List component="div" disablePadding>
              {category.children.map((child) => (
                <SortableTreeItem
                  key={child.id}
                  category={child}
                  depth={depth + 1}
                  selectedId={selectedId}
                  onSelect={onSelect}
                />
              ))}
            </List>
          </SortableContext>
        </Collapse>
      )}
    </div>
  );
}