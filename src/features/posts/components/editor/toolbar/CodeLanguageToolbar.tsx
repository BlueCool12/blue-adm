import { $isCodeNode } from "@lexical/code";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FormControl, MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import { $getSelection, $isRangeSelection } from "lexical";
import { useEffect, useState } from "react";

const CODE_LANGUAGES = [
  { label: 'Javascript', value: 'javascript' },
  { label: 'Typescript', value: 'typescript' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'SQL', value: 'sql' },
  { label: 'HTML', value: 'html' },
  { label: 'CSS', value: 'css' },
  { label: 'Markdown', value: 'markdown' },
];

export default function CodeLanguageToolbar() {
  const [editor] = useLexicalComposerContext();
  const [language, setLanguage] = useState('javascript');
  const [isCode, setIsCode] = useState(false);

  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const parent = anchorNode.getParent();
          if ($isCodeNode(parent)) {
            setIsCode(true);
            setLanguage(parent.getLanguage() || 'javascript');
          } else {
            setIsCode(false);
          }
        }
      });
    });
  }, [editor]);

  const onLanguageChange = (e: SelectChangeEvent<string>) => {
    const newLang = e.target.value;
    setLanguage(newLang);
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const anchorNode = selection.anchor.getNode();
        const parent = anchorNode.getParent();
        if ($isCodeNode(parent)) {
          parent.setLanguage(newLang);
        }
      }
    });
  };

  if (!isCode) return null;

  return (
    <FormControl size="small" variant="standard" sx={{ ml: 1, minWidth: 100 }}>
      <Select value={language} onChange={onLanguageChange} disableUnderline sx={{ fontSize: '0.75rem' }}>
        {CODE_LANGUAGES.map((lang) => (
          <MenuItem key={lang.value} value={lang.value}>{lang.label}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}