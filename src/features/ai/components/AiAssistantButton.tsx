import { useState } from 'react';
import { Fab, Popover } from '@mui/material';
import { SmartToyRounded } from '@mui/icons-material';
import { useSuggestedTopic } from '@/features/ai/hooks/useSuggestedTopic';
import { AiAssistantContent } from '@/features/ai/components/AiAssistantContent';
import { useAiChat } from '@/features/ai/hooks/useAiChat';
import type { ChatMessage } from '@/features/ai/types';

export function AiAssistantButton() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const { mutate: sendMessage, isPending: isSending } = useAiChat();

  const handleSendMessage = (text: string) => {
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
    };

    setMessages((prev) => [...prev, userMessage]);

    sendMessage(
      { message: userMessage.content },
      {
        onSuccess: (response) => {
          const assistantMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: response.reply,
          };
          setMessages((prev) => [...prev, assistantMessage]);
        },
        onError: () => {
          const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: "죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.",
          };
          setMessages((prev) => [...prev, errorMessage]);
        }
      }
    );
  };

  const { data, isLoading, isError, refetch, isFetching } = useSuggestedTopic();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleRefresh = () => {
    refetch();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'ai-assistant-popover' : undefined;

  return (
    <>
      <Fab
        color="primary"
        aria-label="ai-assistant"
        onClick={handleClick}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1300,
        }}
      >
        <SmartToyRounded />
      </Fab>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        slotProps={{
          paper: {
            sx: {
              width: 400,
              marginTop: -2,
              borderRadius: 3,
              overflow: 'hidden'
            }
          }
        }}
      >
        <AiAssistantContent
          topicData={data}
          isTopicLoading={isLoading}
          isTopicError={isError}
          isTopicFetching={isFetching}
          onTopicRefresh={handleRefresh}
          messages={messages}
          onSendMessage={handleSendMessage}
          isSending={isSending}
        />
      </Popover>
    </>
  );
}
