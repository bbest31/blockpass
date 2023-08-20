import PropTypes from 'prop-types';
// @mui
import { Box, Table, TableBody, TableContainer, TablePagination, TableCell, TableRow } from '@mui/material';
// hooks
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
// components
import Scrollbar from '../../../../components/Scrollbar';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from '../../../../components/table';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'address', label: 'Wallet Address', align: 'left' },
  { id: 'id', label: 'Token Id', align: 'left' },
];

// ----------------------------------------------------------------------

OrganizationTicketTierOwnersList.propTypes = {
  ticketTierOwners: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
};

export default function OrganizationTicketTierOwnersList({ ticketTierOwners, isLoading }) {
  const { page, order, orderBy, rowsPerPage, selected, onChangePage, onChangeRowsPerPage } = useTable({
    defaultOrderBy: 'id',
  });

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

OwnerRow.propTypes = {
  walletAddress: PropTypes.string.isRequired,
  tokenId: PropTypes.string.isRequired,
};

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
