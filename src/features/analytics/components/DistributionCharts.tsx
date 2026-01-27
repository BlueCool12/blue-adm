import { Box, Grid, Paper, Skeleton, Typography } from "@mui/material";
import { PieChart, type PieChartProps, type PieValueType } from "@mui/x-charts";
import { useDistribution } from "../hooks/useAnalytics";

const COLORS: Record<string, string> = {
  // 유입 경로
  'Google': '#4285F4',
  'Naver': '#03C75A',
  'Daum': '#FEE500',
  'GitHub': '#6E5494',
  'OKKY': '#0090F9',
  'JobKorea': '#003399',
  'Social': '#E1306C',
  'Direct': '#757575',
  'Others': '#FF9800',

  // 기기
  'Desktop': '#1565C0',
  'Mobile': '#42A5F5',
  'Tablet': '#90CAF9',
  'Bot': '#9E9E9E',
  'Unknown': '#BDBDBD',
};

const DEFAULT_PALETTE = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export interface DistributionProps {
  id: number;
  label: string;
  value: number;
}

export const DistributionCharts = () => {

  const { data: referrerData, isLoading: isReferrerLoading } = useDistribution('referrer');
  const { data: deviceData, isLoading: isDeviceLoading } = useDistribution('device');

  const isLoading = isReferrerLoading || isDeviceLoading;

  const commonChartProps: Partial<PieChartProps> = {
    height: 300,
    margin: { top: 30, bottom: 30, left: 10, right: 10 },
    slotProps: {
      legend: {
        direction: 'horizontal',
        position: { vertical: 'bottom', horizontal: 'center' }
      },
    },
  };

  const transformData = (items: DistributionProps[] | undefined): PieValueType[] => {
    if (!items || items.length === 0) return [];

    return items.map((item, index) => ({
      id: item.id,
      value: item.value,
      label: item.label,
      color: COLORS[item.label] || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length],
    }));
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2].map((key) => (
          <Grid size={{ xs: 12, md: 6 }} key={key}>
            <Paper sx={{ p: 3, height: '100%', minHeight: 350 }}>
              <Skeleton variant="text" width={150} height={32} sx={{ mb: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                <Skeleton variant="circular" width={200} height={200} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    );
  }

  const referrerChartData = transformData(referrerData);
  const deviceChartData = transformData(deviceData);

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%', minHeight: 300 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            유입 경로 (Referrer)
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {referrerChartData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: referrerChartData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                    faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    innerRadius: 60,
                    paddingAngle: 2,
                    cornerRadius: 4,
                  },
                ]}
                {...commonChartProps}
              />
            ) : (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                데이터가 없습니다.
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3, height: '100%', minHeight: 300 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
            접속 기기 (Device)
          </Typography>

          <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            {deviceChartData.length > 0 ? (
              <PieChart
                series={[
                  {
                    data: deviceChartData,
                    highlightScope: { fade: 'global', highlight: 'item' },
                  },
                ]}
                {...commonChartProps}
              />
            ) : (
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                데이터가 없습니다.
              </Box>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
}