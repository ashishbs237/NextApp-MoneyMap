import {
    DataGrid,
    GridColDef,
    GridRowsProp,
    GridToolbar,
    GridPaginationModel,
} from '@mui/x-data-grid'
import { Box, Typography } from '@mui/material'

interface SKDataTableProps {
    columns: GridColDef[]
    rows: GridRowsProp
    checkboxSelection?: boolean
    loading?: boolean
    pageSizeOptions?: number[]
    paginationModel?: GridPaginationModel
    onPaginationModelChange?: (model: GridPaginationModel) => void
    hideFooterPagination?: boolean
    height?: string | number
}

export const SKDataTable: React.FC<SKDataTableProps> = ({
    columns,
    rows,
    checkboxSelection = false,
    loading = false,
    pageSizeOptions = [5, 10, 20],
    paginationModel,
    onPaginationModelChange,
    hideFooterPagination = false,
    height = 'auto',
}) => {
    return (
        <Box
            sx={{
                height,
                width: '100%',
                backgroundColor: '#fff',
                borderRadius: '16px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden',
                '& .MuiDataGrid-columnHeaders': {
                    backgroundColor: '#f3f4f6',
                    fontWeight: 600,
                },
                '& .MuiDataGrid-row:hover': {
                    backgroundColor: '#f9fafb',
                },
            }}
        >
            <DataGrid
                rows={rows}
                columns={columns}
                checkboxSelection={checkboxSelection}
                loading={loading}
                pageSizeOptions={pageSizeOptions}
                paginationModel={paginationModel}
                onPaginationModelChange={onPaginationModelChange}
                autoHeight
                slots={{
                    toolbar: GridToolbar,
                    noRowsOverlay: () => (
                        <Box className="flex items-center justify-center h-40 text-gray-500">
                            <Typography variant="body2">No data to display.</Typography>
                        </Box>
                    ),
                }}
                hideFooterPagination={hideFooterPagination}
            />
        </Box>
    )
}
