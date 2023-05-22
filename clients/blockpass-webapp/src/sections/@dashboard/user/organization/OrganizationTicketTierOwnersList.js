import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
  TableCell,
  TableRow,
} from '@mui/material';
// redux
import { useDispatch, useSelector } from '../../../../redux/store';
import { getProducts } from '../../../../redux/slices/product';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// components
import Page from '../../../../components/Page';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import {
  TableNoData,
  TableSkeleton,
  TableEmptyRows,
  TableHeadCustom,
  TableSelectedActions,
} from '../../../../components/table';
// sections
import { OrganizationEventTableRow } from '.';
// utils
import axiosInstance from '../../../../utils/axios';
import { trackEvent } from '../../../../utils/mixpanelUtils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'address', label: 'Wallet Address', align: 'left' },
  { id: 'id', label: 'Token Id', align: 'left' },
];

// ----------------------------------------------------------------------

export default function OrganizationTicketTierOwnersList({ ticketTierOwners, isLoading }) {
  const { page, order, orderBy, rowsPerPage, setPage, selected, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'id',
  });

  const { themeStretch } = useSettings();
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  const dataFiltered = applySortFilter({
    tableData: ticketTierOwners,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = 80;

  const isNotFound = !ticketTierOwners.length && !isLoading;

  return (
    <>
      <Scrollbar>
        <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
          <Table size="medium">
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={ticketTierOwners.length}
              numSelected={selected.length}
              headerSx={{ backgroundColor: 'white' }}
            />
            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : ticketTierOwners)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <OwnerRow key={index} walletAddress={row.owner_of} tokenId={row.token_id} />
                  ) : (
                    isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, ticketTierOwners.length)} />

              <TableNoData isNotFound={isNotFound} />
            </TableBody>
          </Table>
        </TableContainer>
      </Scrollbar>

      <Box sx={{ position: 'relative' }}>
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={dataFiltered.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={onChangePage}
          onRowsPerPageChange={onChangeRowsPerPage}
        />
      </Box>
    </>
  );
}

// ----------------------------------------------------------------------

const OwnerRow = ({ walletAddress, tokenId }) => (
  <TableRow key={tokenId} hover>
    <TableCell>{walletAddress}</TableCell>
    <TableCell>{tokenId}</TableCell>
  </TableRow>
);

function applySortFilter({ tableData, comparator, filterName }) {
  const stabilizedThis = tableData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  tableData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    tableData = tableData.filter((item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1);
  }

  return tableData;
}
