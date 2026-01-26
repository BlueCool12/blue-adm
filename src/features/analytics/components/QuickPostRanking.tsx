import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Paper, Skeleton, Typography } from "@mui/material";
import { useTopPosts } from "../hooks/useAnalytics";

export interface QuickPostRankingProps {
  id: string;
  title: string;
  views: number;
}

export const QuickPostRanking = () => {

  const { data: posts, isLoading } = useTopPosts(5);

  return (
    <Paper sx={{ p: 3, height: '100%', minHeight: 350, display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" sx={{ mb: 1, fontWeight: 'bold' }}>
        실시간 인기 콘텐츠
      </Typography>

      {isLoading ? (
        <List sx={{ flexGrow: 1 }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <ListItem key={item} sx={{ px: 1 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Skeleton variant="circular" width={24} height={24} />
              </ListItemAvatar>
              <Box sx={{ width: '100%' }}>
                <Skeleton variant="text" width="80%" />
                <Skeleton variant="text" width="40%" height={15} />
              </Box>
            </ListItem>
          ))}
        </List>
      ) : (
        <List sx={{ flexGrow: 1 }}>
          {posts?.length === 0 && (
            <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                데이터가 없습니다.
              </Typography>
            </Box>
          )}

          {posts?.map((post, index) => (
            <ListItem key={index} sx={{ px: 1 }}>
              <ListItemAvatar sx={{ minWidth: 40 }}>
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.75rem',
                    bgcolor: index < 3 ? 'primary.main' : 'action.disabled'
                  }}
                >
                  {index + 1}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={post.title}
                secondary={`${post.views} views today`}
                slotProps={{
                  primary: {
                    variant: 'body2',
                    fontWeight: 'medium',
                    noWrap: true,
                  },
                  secondary: {
                    variant: 'caption',
                    color: 'text.secondary',
                  }
                }}
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
}