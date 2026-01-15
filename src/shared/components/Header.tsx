import { LogoutRounded, MenuRounded, NavigateNext } from "@mui/icons-material";
import { Box, Breadcrumbs, IconButton, Link, styled, Tooltip, Typography, type BoxProps } from "@mui/material"
import { ThemeToggleButton } from "@/shared/components/ThemeToggleButton";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { HeaderIconButton } from "@/shared/components/Header.style";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useState } from "react";
import ConfirmDialog from "@/shared/components/ConfirmDialog";


interface HeaderProps {
  onDrawerToggle: () => void;
}

export function Header({ onDrawerToggle }: HeaderProps) {

  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const { mutate: logout, isPending: isLoggingOut } = useLogout();

  const breadcrumbNameMap: Record<string, string> = {
    dashboard: '대시보드',
    settings: '계정 설정',
    posts: '글 관리',
    edit: '글 작성',
    categories: '카테고리 관리',
    comments: '댓글 관리',
    users: '계정 관리',
  };

  const handleLogoutClick = () => {
    setIsLogoutConfirmOpen(true);
  };

  const handleConfirmLogout = () => {
    logout(undefined, {
      onSettled: () => {
        setIsLogoutConfirmOpen(false);
      }
    });
  };

  return (
    <HeaderContainer component="header">
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onDrawerToggle}
          sx={{ display: { md: 'none' } }}
        >
          <MenuRounded />
        </IconButton>

        <Breadcrumbs
          separator={<NavigateNext fontSize="small" sx={{ color: 'text.disabled' }} />}
          aria-label="breadcrumb"
          sx={{
            '& .MuiBreadcrumbs-ol': {
              flexWrap: 'nowrap',
              whiteSpace: 'nowrap',
            },
            overflow: 'hidden',
            display: { xs: 'none', sm: 'block' }
          }}
        >
          {pathnames.map((value, index) => {
            const last = index === pathnames.length - 1;
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const name = breadcrumbNameMap[value] || value;

            return last ? (
              <Typography
                key={to}
                variant="subtitle1"
                sx={{ fontWeight: 700, color: 'text.primary', fontSize: '0.875rem' }}
              >
                {name}
              </Typography>
            ) : (
              <Link
                key={to}
                component={RouterLink}
                to={to}
                underline="hover"
                color="inherit"
                sx={{ fontSize: '0.875rem' }}
              >
                {name}
              </Link>
            );
          })}
        </Breadcrumbs>
      </Box>

      {/* 우측 버튼 영역 */}
      <Box sx={{ ml: 'auto', display: 'flex', alignItems: 'center', gap: 1 }}>
        <ThemeToggleButton />

        <Box sx={{ width: '1px', height: '16px', bgcolor: 'divider', mx: 1 }} />

        <Tooltip title="로그아웃" arrow>
          <HeaderIconButton onClick={handleLogoutClick}>
            <LogoutRounded fontSize="small" />
          </HeaderIconButton>
        </Tooltip>
      </Box>


      {/* Confirm Dialog */}
      <ConfirmDialog
        open={isLogoutConfirmOpen}
        title="로그아웃"
        content="정말로 로그아웃 하시겠습니까?"
        confirmText="로그아웃"
        confirmColor="warning"
        isLoading={isLoggingOut}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleConfirmLogout}

      />
    </HeaderContainer>
  )
}

// Styles

const HeaderContainer = styled(Box)<BoxProps>(({ theme }) => ({
  height: 64,
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 3),
  backgroundColor: theme.vars?.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: theme.zIndex.appBar,
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.02)'
}));