import { Box, Container, Grid, Paper, Skeleton, Stack, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { StatSummaryCards } from "../components/StatSummaryCards";
import { TrafficChart } from "../components/TrafficChart";
import { DistributionCharts } from "../components/DistributionCharts";
import { PostPerformanceTable } from "../components/PostPerformanceTable";
import { QuickPostRanking } from "../components/QuickPostRanking";
import { useState } from "react";
import { type TrafficRange } from "../types/analytics.types";
import { useTrafficData } from "../hooks/useAnalytics";

export default function AnalyticsPage() {

  const [range, setRange] = useState<TrafficRange>('7d');

  const { data: trafficData, isLoading: isTrafficLoading } = useTrafficData(range);

  const handleRangeChange = (_event: React.MouseEvent<HTMLElement>, newRange: TrafficRange | null) => {
    if (newRange !== null) setRange(newRange);
  }

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight="bold" color="text.primary">
            블로그의 흐름과 독자의 반응을 분석해보세요.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            방문자 추이와 인기 콘텐츠 데이터를 통해 블로그의 성장 가능성을 확인합니다.
          </Typography>
        </Box>

        <Box>
          <StatSummaryCards />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  방문자 추이
                </Typography>

                <ToggleButtonGroup
                  value={range}
                  exclusive
                  onChange={handleRangeChange}
                  size="small"
                >
                  <ToggleButton value="7d">최근 7일</ToggleButton>
                  <ToggleButton value="30d">최근 30일</ToggleButton>
                </ToggleButtonGroup>
              </Box>

              {isTrafficLoading ? (
                <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
              ) : (
                <TrafficChart data={trafficData ?? []} />
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <QuickPostRanking />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <PostPerformanceTable />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <DistributionCharts />
          </Grid>
        </Grid>
      </Stack>
    </Container>
  );
}