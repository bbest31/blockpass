import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import {
  Tab,
  Box,
  Grid,
  Card,
  Typography,
  Tabs,
  Stack,
  Button,
  Container,
  TableContainer,
  TablePagination,
  Table,
  Tooltip,
  TableBody,
  IconButton,
  TableRow,
  TableCell,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// utils
import { capitalCase, sentenceCase } from 'change-case';
import { fDate } from '../../../../utils/formatTime';
// hooks
import useSettings from '../../../../hooks/useSettings';
import useAuth from '../../../../hooks/useAuth';
import useTable, { getComparator, emptyRows } from '../../../../hooks/useTable';
import Iconify from '../../../../components/Iconify';
import Scrollbar from '../../../../components/Scrollbar';
import { TableNoData, TableSkeleton, TableEmptyRows, TableHeadCustom } from '../../../../components/table';
// sections
import { OrganizationTicketTierDialog } from '.';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'tier', label: 'Ticket Tier', align: 'left' },
  { id: 'price', label: 'Price', align: 'left' },
  { id: 'liveDate', label: 'Live Date', align: 'left' },
  { id: 'supply', label: 'Supply', align: 'left' },
];

const denseHeight = 80;

OrganizationCreateEventTicketTier.propTypes = {
  eventId: PropTypes.string,
  eventInformation: PropTypes.object,
  handleNext: PropTypes.func,
};

// ----------------------------------------------------------------------

export default function OrganizationCreateEventTicketTier({ eventId, eventInformation, handleNext }) {
  const { order, orderBy } = useTable({
    defaultOrderBy: 'tier',
  });

  const [tableData, setTableData] = useState([]);
  const [showDialog, setShowDialog] = useState(false);

  const onCancelHandler = () => {
    if (tableData.length > 0) window.location.reload();
  };

  const isNotFound = !tableData.length;

  const addTicketTierOnClickHandler = () => setShowDialog(true);

  const showDialogHandler = () => setShowDialog((show) => !show);

  const onContinueClickHandler = () => handleNext();

  const addTicketTierRow = (ticketTier) => setTableData([...tableData, { ...ticketTier }]);

  return (
    <>
      <OrganizationTicketTierDialog
        open={showDialog}
        eventId={eventId}
        showHandler={showDialogHandler}
        addTicketTierRow={addTicketTierRow}
        eventInformation={eventInformation}
      />
      <Container sx={{ mb: '24px' }}>
        <Typography variant="h4" sx={{ mb: '10px' }}>
          {'Ticket Tier(s)'}
        </Typography>
        <p>Detail the different tiers of tickets you offer for your event, and when they are available for purchase.</p>
      </Container>

      <Card sx={{ mt: '40px' }}>
        <Stack direction="row" flexWrap="wrap" justifyContent={'space-between'} sx={{ p: 3 }}>
          <Typography variant="h5">Ticket Tiers</Typography>
          <Button color="secondary" variant="contained" onClick={showDialogHandler}>
            Add Ticket Tier
          </Button>
        </Stack>

        <Scrollbar>
          <TableContainer sx={{ minWidth: 960, position: 'relative' }}>
            <Table size="medium">
              <TableHeadCustom order={order} orderBy={orderBy} headLabel={TABLE_HEAD} rowCount={tableData.length} />

              <TableBody>
                {tableData.length > 0 ? (
                  tableData.map((row, index) => <TicketTierRow key={index} row={row} eventId={eventId} />)
                ) : (
                  <TableNoData isNotFound={isNotFound} />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>
      </Card>

      <Stack direction="row" flexWrap="wrap" spacing={3} justifyContent="flex-end" my={5}>
        <Button sx={{ px: '22px', py: '11px' }} onClick={onCancelHandler} disabled={tableData.length === 0}>
          Cancel
        </Button>
        <Button type="submit" variant="contained" onClick={onContinueClickHandler} sx={{ px: '22px', py: '11px' }}>
          Continue
        </Button>
      </Stack>
    </>
  );
}

// ----------------------------------------------------------------------

const TicketTierRow = ({ row }) => {
  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}>
          <img alt={row.title} src={row.tokenURI} style={{ width: 48, height: 48, objectFit: 'contain' }} />
        </Box>

        <Typography variant="subtitle2" noWrap>
          {row.title}
        </Typography>
      </TableCell>

      <TableCell align="left">{row.primarySalePrice}</TableCell>
      <TableCell align="left">{row.liveDate}</TableCell>
      <TableCell align="left">{row.maxSupply}</TableCell>
    </TableRow>
  );
};
