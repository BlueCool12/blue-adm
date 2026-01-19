import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $patchStyleText } from "@lexical/selection";
import { FormatColorFillRounded, FormatColorTextRounded } from "@mui/icons-material";
import { Box, IconButton, Popover, Stack, Tooltip } from "@mui/material";
import { $getSelection, $isRangeSelection } from "lexical";
import React, { useCallback, useState } from "react";

const COLORS = [
  '#000000', '#444444', '#888888', '#CCCCCC', '#FFFFFF', 
  '#F44336', '#E91E63', '#9C27B0', '#673AB7', '#3F51B5', 
  '#2196F3', '#03A9F4', '#00BCD4', '#009688', '#4CAF50'  
];

export default function ColorPickerToolbar() {
  const [editor] = useLexicalComposerContext();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colorType, setColorType] = useState<'color' | 'background-color'>('color');

  const handleClick = (event: React.MouseEvent<HTMLElement>, type: 'color' | 'background-color') => {
    setAnchorEl(event.currentTarget);
    setColorType(type);
  };

  const handleClose = () => setAnchorEl(null);

  const applyColor = useCallback((color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, { [colorType]: color });
      }
    });

    handleClose();
  }, [editor, colorType]);

  return (
    <>
      <Stack direction="row" spacing={0.5}>
        <Tooltip title="글자색">
          <IconButton size="small" onClick={(e) => handleClick(e, 'color')}>
            <FormatColorTextRounded fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="배경색">
          <IconButton size="small" onClick={(e) => handleClick(e, 'background-color')}>
            <FormatColorFillRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Box sx={{ p: 1, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0.5 }}>
          {COLORS.map((color) => (
            <Box
              key={color}
              onClick={() => applyColor(color)}
              sx={{
                width: 24,
                height: 24,
                bgcolor: color,
                cursor: 'pointer',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: '4px',
                '&:hover': { border: '1px solid black' }
              }}
            />
          ))}
        </Box>
      </Popover>
    </>
  );
}