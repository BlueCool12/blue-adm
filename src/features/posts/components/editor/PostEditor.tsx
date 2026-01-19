import { forwardRef } from 'react';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { LexicalErrorBoundary } from '@lexical/react/LexicalErrorBoundary';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { HorizontalRulePlugin } from '@lexical/react/LexicalHorizontalRulePlugin';
import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import { TRANSFORMERS } from '@lexical/markdown';

import { Box, Divider, Paper } from '@mui/material';

import CodeHighlightPlugin from '@/features/posts/components/editor/plugins/CodeHighlightPlugin';
import PostEditorStatePlugin from '@/features/posts/components/editor/plugins/EditorStatePlugin';
import ImagesPlugin from '@/features/posts/components/editor/plugins/ImagePlugin';

import HistoryToolbar from '@/features/posts/components/editor/toolbar/HistoryToolbar';
import HeadingToolbar from '@/features/posts/components/editor/toolbar/HeadingToolbar';
import TextFormatToolbar from '@/features/posts/components/editor/toolbar/TextFormatToolbar';
import CodeBlockToolbar from '@/features/posts/components/editor/toolbar/CodeBlockToolbar';
import LinkToolbar from '@/features/posts/components/editor/toolbar/LinkToolbar';
import InsertRuleToolbar from '@/features/posts/components/editor/toolbar/InsertRuleToolbar';
import ImageToolbar from '@/features/posts/components/editor/toolbar/ImageToolbar';
import AlignmentToolbar from '@/features/posts/components/editor/toolbar/AlignmentToolbar';
import CodeLanguageToolbar from '@/features/posts/components/editor/toolbar/CodeLanguageToolbar';

import type { PostEditorHandle, PostEditorProps } from '@/features/posts/components/editor/PostEditorTypes';
import PostEditorTheme from '@/features/posts/components/editor/themes/PostEditorTheme';
import { PostEditorNodes } from '@/features/posts/components/editor/nodes';
import { PlaceholderText, StyledEditable } from '@/features/posts/components/editor/ui/PostEditorStyledComponents';
import ColorPickerToolbar from './toolbar/ColorPickerToolbar';

const editorConfig = {
  namespace: 'BlueCoolEditor',
  nodes: PostEditorNodes,
  theme: PostEditorTheme,
  onError: (error: Error) => console.error(error),
};

export const PostEditor = forwardRef<PostEditorHandle, PostEditorProps>(
  ({ initialContent, postId }, ref) => {
    return (
      <LexicalComposer initialConfig={editorConfig} >
        <Paper
          variant='outlined'
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            bgcolor: 'background.paper',
            color: 'text.primary',
            transition: 'background-color 0.2s ease',
          }}
        >

          {/* 상단 툴바 영역 */}
          <Box
            sx={{
              p: 1,
              bgcolor: 'background.default',
              borderBottom: '1px solid',
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              '&::-webkit-scrollbar': { display: 'none' },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
            }}
          >
            <HistoryToolbar />
            <Divider orientation='vertical' flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

            <HeadingToolbar />
            <Divider orientation='vertical' flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

            <TextFormatToolbar />
            <ColorPickerToolbar />
            <Divider orientation='vertical' flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

            <CodeBlockToolbar />
            <LinkToolbar />
            <InsertRuleToolbar />
            <ImageToolbar postId={postId} />
            <Divider orientation='vertical' flexItem sx={{ mx: 0.5, height: 24, alignSelf: 'center' }} />

            <AlignmentToolbar />

            <Box sx={{ flexGrow: 1 }} />
            <CodeLanguageToolbar />
          </Box>

          {/* 본문 에디터 영역 */}
          <Box
            sx={{
              maxHeight: 'calc(100dvh - 400px)',
              overflowY: 'auto',
              position: 'relative',
              flexDirection: 'column',
              bgcolor: 'background.paper',
            }}
          >
            <RichTextPlugin
              contentEditable={
                <StyledEditable
                  className='lexical-theme'
                  sx={{
                    height: '100%',
                  }}
                />
              }
              placeholder={<PlaceholderText>이곳에 내용을 적어주세요...</PlaceholderText>}
              ErrorBoundary={LexicalErrorBoundary}
            />
            <LinkPlugin />
            <ListPlugin />
            <CheckListPlugin />
            <HistoryPlugin />
            <HorizontalRulePlugin />
            <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
            <ImagesPlugin />
            <CodeHighlightPlugin />
            <PostEditorStatePlugin ref={ref} initialContent={initialContent} />
          </Box>

        </Paper>
      </LexicalComposer >
    );
  }
)