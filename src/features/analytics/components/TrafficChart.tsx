import { Box, Typography, useTheme } from "@mui/material";
import { LineChart } from "@mui/x-charts";

export interface TrafficData {
  date: string;
  pv: number;
  uv: number;
  [key: string]: string | number;
}

interface TrafficChartProps {
  data: TrafficData[];
}

export const TrafficChart = ({ data }: TrafficChartProps) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 2
        }}
      >
        <Typography color="text.secondary">데이터가 없습니다.</Typography>
      </Box>
    );
  }

  return (    
      <Box sx={{ width: '100%', height: 350 }}>
        <LineChart
          dataset={data}
          xAxis={[{
            dataKey: 'date',
            scaleType: 'point',
            disableTicks: true,
          }]}
          series={[
            {
              dataKey: 'pv',
              label: '페이지뷰 (PV)',
              color: `${theme.palette.primary.main}80`,
              area: true,
              showMark: false,
              curve: 'natural',
            },
            {
              dataKey: 'uv',
              label: '방문자 (UV)',
              color: theme.palette.info.dark,
              area: true,
              showMark: false,
              curve: 'natural',
            },
          ]}
          margin={{ left: 0, right: 10, top: 20, bottom: 10 }}
          slotProps={{
            legend: {
              direction: 'horizontal',
              position: { vertical: 'top', horizontal: 'end' },
            },
          }}
          grid={{ horizontal: true, vertical: true }}
        />
      </Box>
  );
}