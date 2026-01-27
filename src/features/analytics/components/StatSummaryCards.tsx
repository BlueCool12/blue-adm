import { AccessTimeRounded, ExitToAppRounded, PeopleAltRounded, TrendingDownRounded, TrendingUpRounded, VisibilityRounded } from "@mui/icons-material";
import { Box, Card, CardContent, Grid, Skeleton, Stack, Typography } from "@mui/material";
import { useAnalyticsSummary } from "../hooks/useAnalytics";

export interface StatCardProps {
  title: string;
  value: number;
  diff: number | string;
  trend: number;
  unit: string;
  icon: React.ReactNode;
}

const formatDuration = (seconds: number) => {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return { min, sec };
};

const StatCard = ({ title, value, trend, unit, icon }: StatCardProps) => {

  const isPositive = trend >= 0;
  const TrendIcon = isPositive ? TrendingUpRounded : TrendingDownRounded;
  const trendColor = isPositive ? 'primary.main' : 'error.main';
  const trendText = `${isPositive ? '+' : ''}${trend}%`;

  const renderValue = () => {
    if (unit === '초') {
      const { min, sec } = formatDuration(Number(value));
      return (
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          {min > 0 && (
            <>
              <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{min}</Typography>
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>분</Typography>
            </>
          )}

          <Typography variant="h4" sx={{ fontWeight: 'bold', ml: 1 }}>{sec}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 'medium' }}>초</Typography>
        </Stack>
      );
    }

    return (
      <Stack direction="row" alignItems="baseline" spacing={0.5}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
          {Number(value).toLocaleString()}
        </Typography>
        {unit && unit !== '초' && (
          <Typography variant="body2" color="text.secondary">
            {unit}
          </Typography>
        )}
      </Stack>
    );
  };

  return (
    <Card sx={{ height: '100%', boxShadow: 1 }}>
      <CardContent>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              {title}
            </Typography>

            {renderValue()}

            <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 1 }}>
              <TrendIcon sx={{ fontSize: '1rem', color: trendColor }} />

              <Typography variant="caption" sx={{ color: trendColor, fontWeight: 'medium' }}>
                {trendText}
              </Typography>

              <Typography variant="caption" color="text.secondary">
                전일 대비
              </Typography>
            </Stack>
          </Box>

          <Box
            sx={{
              p: 1,
              borderRadius: 2,
              display: 'flex',
              color: 'text.secondary',
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export const StatSummaryCards = () => {

  const { data, isLoading } = useAnalyticsSummary();

  const getIcon = (title: string) => {
    if (title.includes('방문자')) return <PeopleAltRounded />;
    if (title.includes('조회수')) return <VisibilityRounded />;
    if (title.includes('체류')) return <AccessTimeRounded />;
    if (title.includes('이탈률')) return <ExitToAppRounded />;
    return <TrendingUpRounded />;
  };

  if (isLoading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((item) => (
          <Grid size={{ xs: 12, sm: 6, md: 3 }} key={item}>
            <Card sx={{ height: 140, boxShadow: 1 }}>
              <CardContent>
                <Skeleton variant="text" width="60%" height={30} />
                <Skeleton variant="text" width="80%" height={60} />
                <Skeleton variant="text" width="40%" height={20} />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {data?.map((stat, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <StatCard
            {...stat}
            icon={getIcon(stat.title)}
          />
        </Grid>
      ))}
    </Grid>
  );
};