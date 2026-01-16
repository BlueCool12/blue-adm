import { Backdrop, CircularProgress } from "@mui/material";

export function Loading() {
  return (
    <Backdrop
      sx={{ backgroundColor: 'action.disabledBackground', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
    >
      <CircularProgress color="primary" />
    </Backdrop>
  )
}