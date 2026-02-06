import React, { useState } from "react";
import { useLocation, useNavigate, type Location } from "react-router-dom";

import {
  Alert, Box, Button, Checkbox, FormControlLabel, IconButton,
  InputAdornment, Paper, Stack, TextField, Typography, Collapse,
  Container
} from "@mui/material";
import { CheckCircleOutlineRounded, CheckCircleRounded, VisibilityOffRounded, VisibilityRounded } from "@mui/icons-material";
import { useLogin } from "@/features/auth/hooks/useLogin";
import type { NestErrorResponse } from "@/shared/types/api";
import type { AxiosError } from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as Location & { state?: { from?: Location } };

  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useLogin();

  const from = location.state?.from?.pathname || '/dashboard';

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const id = loginId.trim();
    if (!id || !password) {
      setError('아이디와 비밀번호를 입력하세요.');
      return;
    }

    try {
      await login.mutateAsync({ loginId: id, password, remember });
      navigate(from, { replace: true });
    } catch (e) {
      const axiosError = e as AxiosError<NestErrorResponse>;
      const serverMessage = axiosError.response?.data?.message;
      const displayMessage = Array.isArray(serverMessage)
        ? serverMessage[0]
        : serverMessage || '로그인 중 오류가 발생했습니다.';

      setError(displayMessage);
    }
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          minHeight: '100dvh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 4
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            p: { xs: 3, sm: 5 },
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            bgcolor: 'background.paper',
          }}
        >
          <Stack spacing={1} sx={{ mb: 4, width: '100%', textAlign: 'center' }}>
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                background: (t) => `linear-gradient(45deg, ${t.palette.primary.main} 30%, ${t.palette.primary.light} 90%)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              BLUECOOL ADM
            </Typography>
          </Stack>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ width: '100%' }}>
            <Stack spacing={2.5}>
              <TextField
                name="username"
                label="아이디"
                required
                fullWidth
                autoFocus
                disabled={login.isPending}
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
                autoComplete="username"
                size="medium"
              />

              <TextField
                name="password"
                label="비밀번호"
                required
                fullWidth
                type={showPassword ? 'text' : 'password'}
                disabled={login.isPending}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                size="medium"
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="비밀번호 보기"
                          onClick={() => setShowPassword((v) => !v)}
                          edge="end"
                          disabled={login.isPending}
                        >
                          {showPassword ? <VisibilityOffRounded /> : <VisibilityRounded />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    icon={<CheckCircleOutlineRounded />}
                    checkedIcon={<CheckCircleRounded />}
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': { color: 'primary.main' }
                    }}
                  />
                }
                label={
                  <Typography variant="body2" color="text.secondary">
                    로그인 상태 유지
                  </Typography>
                }
              />

              <Collapse in={!!error}>
                <Alert severity="error" sx={{ mb: 1 }}>
                  {error}
                </Alert>
              </Collapse>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={login.isPending}
                sx={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                {login.isPending ? '로그인 중...' : '로그인'}
              </Button>
            </Stack>
          </Box>
        </Paper>

        <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 4 }}>
          © {new Date().getFullYear()} BlueCool. All rights reserved.
        </Typography>
      </Box>
    </Container>
  );
}