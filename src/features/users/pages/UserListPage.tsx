import { Box, Button, Chip, CircularProgress, Container, IconButton, InputAdornment, Paper, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Tooltip, Typography } from "@mui/material";
import { LockRounded, ManageAccountsRounded, PersonAddRounded, SearchRounded } from "@mui/icons-material";
import { useState } from "react";
import { UserFormModal } from "@/features/users/components/UserFormModal";
import { useUsers } from "@/features/users/hooks/useUsers";
import type { User } from "@/features/users/types/user";

export default function UserListPage() {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useUsers({ page, limit, search });

  const isLocked = (lockedUntil: string | null) => {
    if (!lockedUntil) return false;
    return new Date(lockedUntil) > new Date();
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  return (
    <Container maxWidth="lg" disableGutters>
      <Stack spacing={4}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: { xs: 2, sm: 1 }
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary">
              운영 계정 및 보안 설정
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              등록된 모든 관리자 계정을 확인하고 권한을 수정하거나 새로운 멤버를 추가하세요.
            </Typography>
          </Box>

          <Button
            variant="contained"
            sx={{
              width: { xs: '100%', sm: 'auto' }
            }}
            startIcon={<PersonAddRounded />}
            onClick={() => {
              setSelectedUser(null);
              setIsModalOpen(true);
            }}
          >
            계정 추가
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            size="small"
            placeholder="아이디, 이름, 닉네임 검색"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              setPage(1);
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRounded sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </InputAdornment>
                )
              }
            }}
            sx={{ width: { xs: '100%', sm: 300 } }}
          />
        </Box>

        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 'none', border: '1px solid', borderColor: 'divider' }}>
          <Table>
            <TableHead sx={{ bgcolor: 'action.hover' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 600 }}>계정 정보</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>활동명</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>권한</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>최근 접속일</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">설정</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                    <CircularProgress size={24} />
                    <Typography variant="body2" sx={{ mt: 1 }}>데이터를 불러오는 중...</Typography>
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 10, color: 'error.main' }}>
                    데이터를 불러오는 데 실패했습니다.
                  </TableCell>
                </TableRow>
              ) : (
                data?.items.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {user.name}
                            {isLocked(user.lockedUntil) && (
                              <Tooltip title="계정 잠금 상태">
                                <LockRounded color="error" sx={{ fontSize: 16, ml: 0.5, verticalAlign: 'middle' }} />
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {user.loginId}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>

                    <TableCell>{user.nickname}</TableCell>

                    <TableCell>
                      <Chip
                        label={user.role}
                        size="small"
                        color={user.role === 'ADMIN' ? 'primary' : 'default'}
                        variant={user.role === 'ADMIN' ? 'filled' : 'outlined'}
                      />
                    </TableCell>

                    <TableCell sx={{ typography: 'body2', color: 'text.secondary' }}>
                      {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : '기록 없음'}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleEditClick(user)}>
                        <ManageAccountsRounded fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>


          <TablePagination
            component="div"
            count={data?.total ?? 0}
            page={page - 1}
            onPageChange={(_, newPage) => setPage(newPage + 1)}
            rowsPerPage={limit}
            onRowsPerPageChange={(e) => {
              setLimit(parseInt(e.target.value, 10));
              setPage(1);
            }}
            labelRowsPerPage="페이지당 행 수:"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} / 전체 ${count !== -1 ? count : `${to}개 이상`}`
            }
          />
        </TableContainer>
      </Stack>

      {/* 계정 생성 모달 */}
      <UserFormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        initialData={selectedUser ?? undefined}
      />
    </Container>
  );
}