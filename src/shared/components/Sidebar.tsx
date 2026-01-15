import { Avatar, Box, Button, CircularProgress, Divider, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Stack, Typography } from "@mui/material";
import { AddRounded, CategoryRounded, CommentRounded, DashboardRounded, DescriptionRounded, ForumRounded, LanguageRounded, PeopleAltRounded, SettingsRounded } from "@mui/icons-material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useCreateDraft } from "@/features/posts/hooks/useCreateDraft";
import { useMe } from "@/features/auth/hooks/useMe";

const NAV_ITEMS = [
  { text: '대시보드', icon: <DashboardRounded />, path: '/dashboard' },
  { text: '글 관리', icon: <DescriptionRounded />, path: '/posts' },
  { text: '카테고리 관리', icon: <CategoryRounded />, path: '/categories' },
  { text: '댓글 관리', icon: <CommentRounded />, path: '/comments' },
  { text: '계정 관리', icon: <PeopleAltRounded />, path: '/users' },
  { text: '방명록 관리', icon: <ForumRounded />, path: 'https://github.com/BlueCool12/blue/issues/1', isExternal: true },
  { text: '웹 사이트', icon: <LanguageRounded />, path: 'https://pyomin.com', isExternal: true }
];

export function Sidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { data: user } = useMe();
  const { mutate: createDraft, isPending } = useCreateDraft();

  const CMS_VERSION = "v1.0.0";

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flexGrow: 1 }}>
        <Box
          component={RouterLink}
          to="/"
          sx={{
            p: 3,
            display: 'block',
            textDecoration: 'none',
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              color: 'primary.main',
              textAlign: 'center',
              letterSpacing: '0.1rem'
            }}
          >
            BLUECOOL ADM
          </Typography>
        </Box>

        <Box sx={{ px: 3, mb: 3, textAlign: 'center' }}>
          <Stack alignItems="center" spacing={1.5}>
            <Avatar
              src={user?.profileImageUrl || undefined}
              onClick={() => navigate('/settings')}
              sx={{
                width: 140,
                height: 140,
                cursor: 'pointer',
                border: '3px solid',
                borderColor: 'primary.lighter',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.05)',
                  borderColor: 'primary.main',
                }
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>

            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.role}
              </Typography>
            </Box>

            <IconButton
              size="small"
              onClick={() => navigate('/settings')}
              sx={{ bgcolor: 'action.hover' }}
            >
              <SettingsRounded sx={{ fontSize: 16 }} />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ px: 2, pb: 1 }}>
          <Button
            fullWidth
            variant="contained"
            size="large"
            disableElevation
            onClick={() => createDraft()}
            disabled={isPending}
            startIcon={isPending ? null : <AddRounded />}
            sx={{
              borderRadius: 2,
              fontWeight: 700,
            }}
          >
            {isPending ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "새 글 작성"
            )}
          </Button>
        </Box>

        <List sx={{ px: 2 }}>
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.path || (item.path !== '/' && pathname.startsWith(item.path));

            const handleClick = () => {
              if (item?.isExternal) {
                window.open(item.path, '_blank', 'noopener,noreferrer');
              } else {
                navigate(item.path);
              }
            };

            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={active}
                  onClick={handleClick}
                  sx={{
                    borderRadius: 2,
                    '&.Mui-selected': {
                      bgcolor: 'primary.lighter',
                      color: 'primary.main',
                      '& .MuiListItemIcon-root': { color: 'primary.main' },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: active ? 'primary.main' : 'text.secondary' }}>
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.text}
                    slotProps={{
                      primary: {
                        fontSize: 14,
                        fontWeight: active ? 700 : 500,
                        color: active ? 'primary.main' : 'text.primary'
                      }
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>



      <Box sx={{ mt: 'auto' }}>
        <Divider sx={{ mx: 2, borderColor: 'divider', opacity: 0.6 }} />

        <Box sx={{ p: 2.5, textAlign: 'center' }}>
          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontWeight: 700,
              letterSpacing: 0.5,
              display: 'block',
              mb: 0.5
            }}
          >
            BLUECOOL ADM {CMS_VERSION}
          </Typography>

          <Typography
            variant="caption"
            sx={{
              color: 'text.disabled',
              fontSize: '10px',
              fontWeight: 400,
              display: 'block'
            }}
          >
            © {new Date().getFullYear()} BlueCool. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}