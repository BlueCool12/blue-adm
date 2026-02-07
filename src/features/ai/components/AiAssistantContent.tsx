import { Box, Typography, Paper, IconButton, CircularProgress, Skeleton, TextField, Avatar, Tabs, Tab, Divider } from '@mui/material';
import { RefreshRounded, ErrorOutlineRounded, AutoAwesomeRounded, RocketLaunchRounded, PersonRounded, SmartToyRounded, LinkRounded, ContentCopyRounded, CheckRounded, SummarizeRounded } from '@mui/icons-material';
import type { SuggestedTopic } from '@/features/ai/hooks/useSuggestedTopic';
import { useState, useRef, useEffect } from 'react';
import { useMe } from '@/features/auth/hooks/useMe';
import { useSuggestedSlug } from '@/features/ai/hooks/useSuggestedSlug';
import { useSuggestedSummary } from '@/features/ai/hooks/useSuggestedSummary';
import type { ChatMessage } from '@/features/ai/types';

interface AiAssistantContentProps {
  topicData?: SuggestedTopic;
  isTopicLoading: boolean;
  isTopicError: boolean;
  isTopicFetching: boolean;
  onTopicRefresh: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isSending: boolean;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`ai-tabpanel-${index}`}
      aria-labelledby={`ai-tab-${index}`}
      {...other}
      style={{
        display: value === index ? 'flex' : 'none',
        flexDirection: 'column',
        flex: 1,
        overflow: 'hidden',
        height: '100%'
      }}
    >
      {value === index && children}
    </div>
  );
}

export function AiAssistantContent({
  topicData,
  isTopicLoading,
  isTopicError,
  isTopicFetching,
  onTopicRefresh,
  messages,
  onSendMessage,
  isSending
}: AiAssistantContentProps) {
  const { data: user } = useMe();
  const [tabValue, setTabValue] = useState(0);
  const [input, setInput] = useState('');

  // Slug Tool State
  const [slugInput, setSlugInput] = useState('');
  const [slugCopied, setSlugCopied] = useState(false);
  const { mutate: getSlug, data: slugData, isPending: isSlugPending } = useSuggestedSlug();

  // Summary Tool State
  const [summaryInput, setSummaryInput] = useState('');
  const [summaryCopied, setSummaryCopied] = useState(false);
  const { mutate: getSummary, data: summaryData, isPending: isSummaryPending } = useSuggestedSummary();

  const scrollRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    if (tabValue === 0 && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, tabValue]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestSlug = () => {
    if (!slugInput.trim()) return;
    getSlug({ title: slugInput });
  };

  const handleCopySlug = () => {
    if (slugData?.slug) {
      navigator.clipboard.writeText(slugData.slug);
      setSlugCopied(true);
      setTimeout(() => setSlugCopied(false), 2000);
    }
  };

  const handleSuggestSummary = () => {
    if (!summaryInput.trim()) return;
    getSummary({ content: summaryInput });
  };

  const handleCopySummary = () => {
    if (summaryData?.summary) {
      navigator.clipboard.writeText(summaryData.summary);
      setSummaryCopied(true);
      setTimeout(() => setSummaryCopied(false), 2000);
    }
  };

  return (
    <Paper elevation={0} sx={{ display: 'flex', flexDirection: 'column', height: 600, maxHeight: '75vh' }}>
      <Box sx={{ p: 2, bgcolor: 'primary.main', color: 'primary.contrastText', display: 'flex', alignItems: 'center', gap: 1 }}>
        <AutoAwesomeRounded fontSize="small" />
        <Typography variant="subtitle1" fontWeight="bold">
          AI 블로그 어시스턴트
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="ai assistant tabs" variant="fullWidth">
          <Tab label="채팅" id="ai-tab-0" aria-controls="ai-tabpanel-0" />
          <Tab label="기능" id="ai-tab-1" aria-controls="ai-tabpanel-1" />
        </Tabs>
      </Box>

      {/* Chat Tab */}
      <CustomTabPanel value={tabValue} index={0}>
        <Box sx={{ flex: 1, overflowY: 'auto', py: 3, px: 2, display: 'flex', flexDirection: 'column', gap: 2 }} ref={scrollRef}>
          {messages.length === 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.5, gap: 1 }}>
              <SmartToyRounded sx={{ fontSize: 40, color: 'text.disabled' }} />
              <Typography variant="body2" color="text.secondary">
                M-O에게 궁금한 점을 물어보세요!
              </Typography>
            </Box>
          )}
          {messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                display: 'flex',
                gap: 1,
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              <Avatar
                src={msg.role === 'user' ? user?.profileImageUrl || undefined : undefined}
                sx={{
                  width: 40,
                  height: 40,
                  bgcolor: msg.role === 'user' ? 'action.selected' : 'primary.light',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  color: msg.role === 'user' ? 'text.primary' : 'primary.main',
                }}
              >
                {msg.role === 'user' ? (
                  !user?.profileImageUrl && (user?.nickname?.charAt(0) || <PersonRounded sx={{ fontSize: 20 }} />)
                ) : (
                  <SmartToyRounded sx={{ fontSize: 20 }} />
                )}
              </Avatar>

              <Paper
                elevation={0}
                sx={{
                  p: 1.5,
                  bgcolor: msg.role === 'user' ? 'primary.main' : 'action.hover',
                  color: msg.role === 'user' ? 'primary.contrastText' : 'text.primary',
                  maxWidth: '80%',
                  borderRadius: 2,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{msg.content}</Typography>
              </Paper>
            </Box>
          ))}

          {isSending && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Paper sx={{ p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                <CircularProgress size={16} />
              </Paper>
            </Box>
          )}
        </Box>

        {/* Input Area */}
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <TextField
            fullWidth
            size="small"
            placeholder="M-O에게 무엇이든 물어보세요!"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            multiline
            maxRows={3}
            slotProps={{
              input: {
                endAdornment: (
                  <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                    edge="end"
                    size="small"
                  >
                    <RocketLaunchRounded />
                  </IconButton>
                ),
                sx: { pr: 1 }
              }
            }}
          />
        </Box>
      </CustomTabPanel>

      {/* Tools Tab */}
      <CustomTabPanel value={tabValue} index={1}>
        <Box sx={{ p: 2, flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Topic Suggestion Section */}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase">
                추천 주제
              </Typography>
              <IconButton
                size="small"
                onClick={onTopicRefresh}
                aria-label="refresh topic"
                disabled={isTopicFetching}
              >
                {isTopicFetching ? <CircularProgress size={16} /> : <RefreshRounded fontSize="small" />}
              </IconButton>
            </Box>

            {isTopicError ? (
              <Paper
                variant="outlined"
                sx={{
                  p: 2,
                  bgcolor: 'error.50',
                  borderColor: 'error.200',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ErrorOutlineRounded color="error" />
                <Typography variant="body2" color="error.main" fontWeight="medium">
                  주제를 불러오지 못했습니다.
                </Typography>
              </Paper>
            ) : isTopicLoading ? (
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Skeleton variant="text" width="30%" height={16} sx={{ mb: 1 }} />
                <Skeleton variant="text" width="80%" height={24} />
              </Paper>
            ) : (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                }}
              >
                {topicData?.category && (
                  <Typography variant="caption" fontWeight="bold" color="primary.main" sx={{ display: 'block', mb: 0.5 }}>
                    [{topicData.category}]
                  </Typography>
                )}
                <Typography variant="body2" fontWeight="bold" color="text.secondary">
                  {topicData?.topic || "새로운 글 주제를 추천받아보세요!"}
                </Typography>
              </Paper>
            )}
          </Box>

          <Divider />

          {/* Slug Suggestion Section */}
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" sx={{ display: 'block', mb: 1 }}>
              Slug 생성
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="제목을 입력하세요"
                value={slugInput}
                onChange={(e) => setSlugInput(e.target.value)}
                autoComplete="off"
              />
              <IconButton
                color="primary"
                onClick={handleSuggestSlug}
                disabled={!slugInput.trim() || isSlugPending}
                sx={{ bgcolor: 'action.hover' }}
              >
                {isSlugPending ? <CircularProgress size={20} /> : <LinkRounded fontSize="small" />}
              </IconButton>
            </Box>

            {slugData?.slug && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: 'action.selected',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium', wordBreak: 'break-all' }}>
                  {slugData.slug}
                </Typography>
                <IconButton size="small" onClick={handleCopySlug} color={slugCopied ? "success" : "default"}>
                  {slugCopied ? <CheckRounded fontSize="small" /> : <ContentCopyRounded fontSize="small" />}
                </IconButton>
              </Paper>
            )}
          </Box>

          <Divider />

          {/* Summary Suggestion Section */}
          <Box>
            <Typography variant="caption" fontWeight="bold" color="text.secondary" textTransform="uppercase" sx={{ display: 'block', mb: 1 }}>
              글 요약
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 1 }}>
              <TextField
                fullWidth
                multiline
                rows={5}
                size="small"
                placeholder="요약할 내용을 입력하세요"
                value={summaryInput}
                onChange={(e) => setSummaryInput(e.target.value)}
              />
              <IconButton
                color="primary"
                onClick={handleSuggestSummary}
                disabled={!summaryInput.trim() || isSummaryPending}
                sx={{ alignSelf: 'flex-end', bgcolor: 'action.hover' }}
              >
                {isSummaryPending ? <CircularProgress size={20} /> : <SummarizeRounded fontSize="small" />}
              </IconButton>
            </Box>

            {summaryData?.summary && (
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  bgcolor: 'action.selected',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                  {summaryData.summary}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton size="small" onClick={handleCopySummary} color={summaryCopied ? "success" : "default"}>
                    {summaryCopied ? <CheckRounded fontSize="small" /> : <ContentCopyRounded fontSize="small" />}
                  </IconButton>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </CustomTabPanel>
    </Paper>
  );
}
