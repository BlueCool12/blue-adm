import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useCreateUser, type CreateUserPayload } from "../hooks/useCreateUser";
import type { User, UserRole } from "@/features/users/types/user";
import { useUpdateUser, type UpdateUserPayload } from "@/features/users/hooks/useUpdateUser";

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  initialData?: User;
}

interface UserFormInputs {
  loginId: string;
  name: string;
  nickname: string;
  role: UserRole;
  password: string;
  passwordConfirm: string;
}

export function UserFormModal({ open, onClose, initialData }: UserFormModalProps) {

  const isEditMode = !!initialData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<UserFormInputs>({
    defaultValues: {
      role: 'USER'
    }
  });

  const password = watch("password");

  useEffect(() => {
    if (open) {
      if (initialData) {
        reset({
          loginId: initialData.loginId,
          name: initialData.name,
          nickname: initialData.nickname,
          role: initialData.role,
          password: "",
          passwordConfirm: ""
        });
      } else {
        reset({ loginId: "", name: "", nickname: "", role: "USER", password: "", passwordConfirm: "" });
      }
    }
  }, [open, initialData, reset]);

  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();

  const onSubmit = (data: UserFormInputs) => {
    if (isEditMode) {
      const updatePayload: Partial<UserFormInputs> & { id: string } = {
        id: initialData.id,
        ...data,
      };

      delete updatePayload.passwordConfirm;
      delete updatePayload.loginId;

      if (!data.password) {
        delete updatePayload.password;
      }

      updateUser(updatePayload as UpdateUserPayload, {
        onSuccess: () => {
          handleClose();
        }
      });
    } else {
      const payload: Partial<UserFormInputs> = { ...data };
      delete payload.passwordConfirm;

      createUser(payload as CreateUserPayload, {
        onSuccess: () => {
          reset();
          onClose();
        }
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="xs">
      <DialogTitle sx={{ fontWeight: 'bold' }}>
        {isEditMode ? '계정 정보 수정' : '새 계정 추가'}
      </DialogTitle>

      <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <DialogContent dividers>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              {...register("loginId", {
                required: "아이디를 입력해주세요",
                pattern: { value: /^[a-z0-9]+$/, message: "영문 소문자와 숫자만 가능합니다" }
              })}
              label="아이디"
              fullWidth
              size="small"
              disabled={isEditMode}
              error={!!errors.loginId}
              helperText={errors.loginId?.message}
            />

            <TextField
              {...register("password", {
                required: !isEditMode && "비밀번호를 입력해주세요",
                minLength: { value: 6, message: "6자 이상 입력하세요" }
              })}
              label={isEditMode ? "비밀번호 (변경 시에만 입력)" : "비밀번호"}
              type="password"
              fullWidth
              size="small"
              error={!!errors.password}
              helperText={errors.password?.message}
            />

            <TextField
              {...register("passwordConfirm", {
                required: (!isEditMode || !!password) && "비밀번호를 한 번 더 입력해주세요",
                validate: (value) => value === password || "비밀번호가 일치하지 않습니다"
              })}
              label="비밀번호 확인"
              type="password"
              fullWidth
              size="small"
              error={!!errors.passwordConfirm}
              helperText={errors.passwordConfirm?.message}
            />

            <TextField
              {...register("name", { required: "이름을 입력해주세요" })}
              label="이름"
              fullWidth
              size="small"
              error={!!errors.name}
              helperText={errors.name?.message}
            />

            <TextField
              {...register("nickname", { required: "닉네임을 입력해주세요" })}
              label="활동명(닉네임)"
              fullWidth
              size="small"
              error={!!errors.nickname}
              helperText={errors.nickname?.message}
            />

            <TextField
              {...register("role")}
              select
              label="권한 설정"
              fullWidth
              size="small"
              value={watch("role") || "USER"}
            >
              <MenuItem value="ADMIN">관리자(ADMIN)</MenuItem>
              <MenuItem value="USER">게스트(USER)</MenuItem>
            </TextField>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={handleClose} color="inherit">취소</Button>

          <Button type="submit" variant="contained" disabled={isCreating || isUpdating}>
            {isEditMode ? (isUpdating ? '수정 중...' : '수정 완료') : (isCreating ? '생성 중...' : '생성')}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}