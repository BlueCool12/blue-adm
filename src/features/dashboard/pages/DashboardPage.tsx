import { ChevronRightRounded, CommentRounded, DescriptionRounded, PeopleAltRounded, TrendingUpRounded } from "@mui/icons-material";
import { alpha, Box, Container, Grid, IconButton, List, ListItem, ListItemButton, ListItemText, Paper, Skeleton, Stack, Tooltip, Typography, useTheme } from "@mui/material";
import { LineChart } from '@mui/x-charts/LineChart';
import { useNavigate } from "react-router-dom";
import { SummaryCard } from "@/features/dashboard/components/SummaryCard";
import { useDashboardSummary, useRecentComments, useTopPosts, useTrafficTrend } from "@/features/dashboard/hooks/useDashboardStats";

export default function DashboardPage() {
    const navigate = useNavigate();
    const theme = useTheme();

    const summary = useDashboardSummary();
    const trend = useTrafficTrend();
    const comments = useRecentComments();
    const topPosts = useTopPosts();

    return (
        <Container maxWidth="lg" sx={{ py: 4 }} disableGutters>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="오늘 방문자 (UV)" value={summary.isLoading ? '—' : (summary.data?.todayUv.toLocaleString() ?? '—')} icon={<PeopleAltRounded />} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="오늘 페이지뷰 (PV)" value={summary.isLoading ? '—' : (summary.data?.todayPv.toLocaleString() ?? '—')} icon={<TrendingUpRounded />} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="대기 중인 댓글" value={summary.isLoading ? '—' : (summary.data?.pendingComments.toLocaleString() ?? '—')} icon={<CommentRounded />} />
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <SummaryCard title="전체 게시글" value={summary.isLoading ? '—' : (summary.data?.totalPosts.toLocaleString() ?? '—')} icon={<DescriptionRounded />} />
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: 400 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>방문자 추이 (최근 7일)</Typography>

                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: alpha(theme.palette.primary.main, 0.2) }} />
                                    <Typography variant="caption" fontWeight={600}>페이지뷰 (PV)</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: theme.palette.primary.main }} />
                                    <Typography variant="caption" fontWeight={600}>방문자 (UV)</Typography>
                                </Box>
                            </Stack>
                        </Box>

                        <Box sx={{ height: 300, width: '100%' }}>
                            {trend.isLoading ? (
                                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
                            ) : trend.data ? (
                                <LineChart
                                    dataset={trend.data}
                                    xAxis={[{ scaleType: 'point', dataKey: 'date' }]}
                                    series={[
                                        { dataKey: 'pv', label: '페이지뷰', area: true, color: alpha(theme.palette.primary.main, 0.2) },
                                        { dataKey: 'uv', label: '방문자', color: theme.palette.primary.main },
                                    ]}
                                    slotProps={{
                                        legend: {
                                            sx: { display: 'none' }
                                        }
                                    }}
                                    margin={{ left: 0, right: 15, top: 20, bottom: 20 }}
                                />
                            ) : null}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, lg: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 3, height: 400, display: 'flex', flexDirection: 'column' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>최근 댓글</Typography>

                            <Tooltip title="댓글 관리" arrow>
                                <IconButton onClick={() => navigate('/comments')} size="small">
                                    <ChevronRightRounded fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                            {comments.isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} variant="rectangular" height={52} sx={{ mb: 2, borderRadius: 2 }} />
                                ))
                            ) : comments.data?.map((comment) => (
                                <Box key={comment.id} sx={{ mb: 2, p: 1.5, bgcolor: 'action.hover', borderRadius: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{comment.nickname}</Typography>
                                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block' }}>
                                        {comment.content}
                                    </Typography>
                                </Box>
                            ))}
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3, borderRadius: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>🔥 인기 게시글 (Top 3)</Typography>

                            <Tooltip title="글 관리" arrow>
                                <IconButton onClick={() => navigate('/posts')} size="small">
                                    <ChevronRightRounded fontSize="medium" />
                                </IconButton>
                            </Tooltip>
                        </Box>

                        <List>
                            {topPosts.isLoading ? (
                                Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} variant="rectangular" height={48} sx={{ mb: 1, borderRadius: 1 }} />
                                ))
                            ) : topPosts.data?.map((post, index) => (
                                <ListItem key={post.id} disablePadding>
                                    <ListItemButton LinkComponent="a" href={`/posts/${post.id}/edit`}>
                                        <ListItemText
                                            primary={`${index + 1}. ${post.title}`}
                                            secondary={`조회수: ${post.views}회`}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};