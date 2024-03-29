import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
// @mui
import {
  Box,
  Card,
  Table,
  Tooltip,
  TableBody,
  IconButton,
  TableContainer,
  TablePagination,
  Typography,
} from '@mui/material';
// hooks
import useAuth from '../../../../hooks/useAuth';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
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

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tier', label: 'Ticket Tier', align: 'left' },
  { id: 'owners', label: 'Owners', align: 'left' },
  { id: 'status', label: 'Status', align: 'center', width: 180 },
  { id: 'price', label: 'Price', align: 'right' },
  { id: 'options', label: '', align: 'right' },
];
// ----------------------------------------------------------------------

OrganizationTicketTierList.propTypes = {
  eventItem: PropTypes.object.isRequired,
  onClickHandler: PropTypes.func.isRequired,
};

export default function OrganizationTicketTierList({ eventItem, onClickHandler }) {
  const {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    setSelected,
    onSelectAllRows,
    onSort,
    onChangePage,
    onChangeRowsPerPage,
  } = useTable({
    defaultOrderBy: 'createdAt',
  });

  const _eventId = eventItem._id;

  const { organization, getAccessToken } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(true);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    getEvents(controller);
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        setTableData([...res.data.ticketTiers]);
        setIsLoading(false);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          enqueueSnackbar(`Unable to retrieve ticket tiers.`, { variant: 'error' });
          console.error(err);
        }
        setIsLoading(false);
      });
  };

  const handleDeleteRows = (selected) => {
    const deleteRows = tableData.filter((row) => !selected.includes(row.id));
    setSelected([]);
    setTableData(deleteRows);
  };

  const dataFiltered = applySortFilter({
    tableData,
    comparator: getComparator(order, orderBy),
  });

  const denseHeight = 80;

  const isNotFound = !tableData.length && !isLoading;

  return (
    <Card>
      <Typography variant="h5" sx={{ py: 2.5, px: 3 }}>
        Ticket Tiers
      </Typography>

      <Scrollbar>
        <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
          {selected.length > 0 && (
            <TableSelectedActions
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
            />

            <TableBody>
              {(isLoading ? [...Array(rowsPerPage)] : tableData)
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) =>
                  row ? (
                    <OrganizationEventTableRow
                      key={index}
                      row={row}
                      eventId={_eventId}
                      onClickHandler={onClickHandler}
                    />
                  ) : (
                    isLoading && <TableSkeleton key={index} sx={{ height: denseHeight }} />
                  )
                )}

              <TableEmptyRows height={denseHeight} emptyRows={emptyRows(page, rowsPerPage, tableData.length)} />

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
