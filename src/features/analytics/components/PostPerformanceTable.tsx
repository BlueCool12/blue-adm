import { Box, Chip, Paper, Typography } from '@mui/material';
import { DataGrid, type GridPaginationModel, type GridColDef } from '@mui/x-data-grid';
import { koKR } from '@mui/x-data-grid/locales';
import { useState } from 'react';
import { usePostPerformance } from '../hooks/useAnalytics';

interface PostStat {
  id: number;
  title: string;
  slug: string;
  publishedAt: string;
  views: number;  
  uv: number;
}

export interface PaginatedPostPerformance {
  items: PostStat[];
  total: number;
}

const columns: GridColDef[] = [
  {
    field: 'title',
    headerName: '글 제목',
    flex: 2,
    renderCell: (params) => (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          height: '100%',
        }}
      >
        <Typography variant='body2' fontWeight="medium">{params.value}</Typography>
        <Typography variant='caption' color='text.secondary'>{params.row.slug}</Typography>
      </Box>
    )
  },
  {
    field: 'views',
    headerName: '조회수(PV)',
    type: 'number',
    flex: 1,
    renderCell: (params) => (
      <Chip label={params.value.toLocaleString()} size='small' variant='outlined' />
    )
  },
  {
    field: 'uv',
    headerName: '방문자(UV)',
    type: 'number',
    flex: 1,
    valueFormatter: (value) => Number(value).toLocaleString()
  },
  {
    field: 'publishedAt',
    headerName: '게시일',
    flex: 1,
    valueFormatter: (value) => new Date(value).toLocaleString()
  },
  // { field: 'avgDuration', headerName: '평균 체류시간', flex: 1 },
];

export const PostPerformanceTable = () => {

  const [paginationModel, setPaginationModel] = useState<GridPaginationModel>({
    page: 0,
    pageSize: 5,
  });

  const { data, isLoading } = usePostPerformance(paginationModel.page + 1, paginationModel.pageSize);

  return (
    <Paper sx={{ p: 3, width: '100%' }}>
      <Typography variant='h6' sx={{ mb: 1, fontWeight: 'bold' }}>
        콘텐츠별 상세 성과 분석
      </Typography>

      <Box sx={{ width: '100%' }}>
        <DataGrid
          rows={data?.items ?? []}
          columns={columns}
          loading={isLoading}
          paginationMode='server'
          rowCount={data?.total ?? 0}
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          disableRowSelectionOnClick
          disableColumnMenu          
          autoHeight
          sx={{
            border: 'none',
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'action.hover',
              fontWeight: 'bold',
            },
          }}
          localeText={koKR.components.MuiDataGrid.defaultProps.localeText}
        />
      </Box>
    </Paper>
  );
};