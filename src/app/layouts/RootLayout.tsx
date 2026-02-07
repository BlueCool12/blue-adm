import { Suspense, useState } from "react";
import { Outlet } from "react-router-dom";
import { Box, Drawer, styled } from "@mui/material";

import { Header } from "@/shared/components/Header";
import { Sidebar } from "@/shared/components/Sidebar";
import { Loading } from "@/shared/components/Loading";

import { AiAssistantButton } from "@/features/ai/components/AiAssistantButton";

const DRAWER_WIDTH = 260;

export function RootLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100dvh', width: '100%', overflow: 'hidden' }}>

      <MobileDrawer
        variant="temporary"
        open={isMobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
      >
        <Sidebar />
      </MobileDrawer>

      <DesktopSidebar>
        <Sidebar />
      </DesktopSidebar>

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header onDrawerToggle={handleDrawerToggle} />

        <Box component="main" sx={{ flex: 1, overflowY: 'auto', p: 3 }}>
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Box>
      </Box>

      <AiAssistantButton />
    </Box>
  );
}

// Styles

const MobileDrawer = styled(Drawer)(({ theme }) => ({
  display: 'block',
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    boxSizing: 'border-box',
  },
}));

const DesktopSidebar = styled(Box)(({ theme }) => ({
  width: DRAWER_WIDTH,
  flexShrink: 0,
  backgroundColor: theme.vars?.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  display: 'none',
  [theme.breakpoints.up('md')]: {
    display: 'block',
  },
}));