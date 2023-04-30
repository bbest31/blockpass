import { paramCase } from 'change-case';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
// @mui
import {
  Box,
  Card,
  Table,
  // Button,
  // Stack,
  // Switch,
  Tooltip,
  TableBody,
  Container,
  IconButton,
  TableContainer,
  TablePagination,
  FormControlLabel,
  Typography,
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
  { id: 'tier', label: 'Ticket Tier', align: 'left' },
  { id: 'owners', label: 'Owners', align: 'left' },
  { id: 'status', label: 'Status', align: 'center', width: 180 },
  { id: 'price', label: 'Price', align: 'right' },
  { id: 'options', label: '', align: 'right' },
];

const TICKET_TIERS = [
  { tier: 'Early Bird Special', owners: 25, status: 'active', price: '$23.42' },
  { tier: 'General Admission', owners: 48, status: 'closed', price: '$23.42' },
  { tier: 'VIP Access', owners: 15, status: 'paused', price: '$23.42' },
];
// ----------------------------------------------------------------------

export default function OrganizationTicketTierList({ eventItem }) {
  const {
    // dense,
    page,
    order,
    orderBy,
    rowsPerPage,
    setPage,
    //
    selected,
    setSelected,
    onSelectRow,
    onSelectAllRows,
    //
    onSort,
    // onChangeDense,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const _eventId = eventItem._id;

  const { themeStretch } = useSettings();
  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();

  // const dispatch = useDispatch();

  // const { products, isLoading } = useSelector((state) => state.product);
  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getEvents(controller);
    return () => {
      controller.abort();
    };
  }, []);

  const getEvents = async (controller) => {
    const token = await getAccessToken();

    axiosInstance
      .get(`/organizations/${organization.id}/events/${_eventId}/ticket-tiers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      })
      .then((res) => {
        console.log(res);
        setTableData(res.data.ticketTiers);
        setIsLoading(false)
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve ticket tiers.`, { variant: 'error' });
        }
      });
  };
  // useEffect(() => {
  //   dispatch(getProducts());
  // }, [dispatch]);

  // useEffect(() => {
  //   if (products.length) {
  //     setTableData(products);
  //   }
  // }, [products]);

  // TODO: turn to 'Close' row
  const handleDeleteRow = (id) => {
    const deleteRow = tableData.filter((row) => row.id !== id);
    setSelected([]);
    setTableData(deleteRow);
  };

  // TODO: turn to 'Close' rows
  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  // TODO: turn to 'View' row
  const handleEditRow = (id) => {
    navigate(PATH_DASHBOARD.eCommerce.edit(paramCase(id)));
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  // const denseHeight = dense ? 60 : 80;
  const denseHeight = 80;

  // const isNotFound = !dataFiltered.length || !isLoading;
  const isNotFound = !tableData.length || !isLoading;

  return (
    <Card>
      <Typography variant="h5" sx={{ py: 2.5, px: 3 }}>
        Ticket Tiers
      </Typography>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
              // dense={dense}
              numSelected={selected.length}
              rowCount={tableData.length}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
              actions={
                <Tooltip title="Delete">
                  <IconButton color="primary" onClick={() => handleDeleteRows(selected)}>
                    <Iconify icon={'eva:trash-2-outline'} />
                  </IconButton>
                </Tooltip>
              }
            />
          )}

          <Table size="medium">
            <TableHeadCustom
              order={order}
              orderBy={orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
              numSelected={selected.length}
              onSort={onSort}
              onSelectAllRows={(checked) =>
                onSelectAllRows(
                  checked,
                  tableData.map((row) => row.id)
                )
              }
            />

            <TableBody>
              {/* {tableData.map((data) => (
                <OrganizationEventTableRow key={_eventId} row={data}/>
              ))} */}

              {(isLoading ? [...Array(rowsPerPage)] : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <OrganizationEventTableRow
                      key={row.id}
                      row={row}
                      // selected={selected.includes(row.id)}
                      // onSelectRow={() => onSelectRow(row.id)}
                      // onDeleteRow={() => handleDeleteRow(row.id)}
                      // onEditRow={() => handleEditRow(row.name)}
                    />
                  ) : (
                    !isNotFound && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

              <TableNoData isNotFound={!isNotFound} />
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
    </Card>
  );
}

// ----------------------------------------------------------------------

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
