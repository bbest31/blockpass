import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, TableCell, Typography, MenuItem, Box, Link } from '@mui/material';
// components
import Label from '../../../../components/Label';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

OrganizationEventTableRow.propTypes = {
  row: PropTypes.object,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onClickHandler: PropTypes.func,
};

export default function OrganizationEventTableRow({ row, onEditRow, onDeleteRow, onClickHandler }) {
  const theme = useTheme();

  const [ticketTierDetail, setTicketTierDetail] = useState(row);
  const [openMenu, setOpenMenuActions] = useState(null);
  const [isClosed] = useState(new Date() > new Date(ticketTierDetail.closeDate));
  const [isPaused] = useState(ticketTierDetail.paused);

  useEffect(() => {
    setTicketTierDetail(row);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  const displayContractState = () => {
    let color = 'success';
    let state = 'active';

    if (isClosed) {
      color = 'error';
      state = 'closed';
    } else if (isPaused) {
      color = 'warning';
      state = 'paused';
    }

    return (
      <Label
        variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
        color={color}
        sx={{ textTransform: 'uppercase' }}
      >
        {sentenceCase(state)}
      </Label>
    );
  };

  return (
    <TableRow hover>
      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}>
          <img
            alt={ticketTierDetail.name}
            src={ticketTierDetail.tokenURI}
            style={{ width: 48, height: 48, objectFit: 'contain' }}
          />
        </Box>

        <Typography variant="subtitle2" noWrap>
          <Link component="button" onClick={() => onClickHandler(row)}>
            {ticketTierDetail.name}
          </Link>
        </Typography>
      </TableCell>

      <TableCell>{ticketTierDetail.supply - ticketTierDetail.totalTicketsForSale}</TableCell>

      <TableCell align="center">{displayContractState()}</TableCell>

      <TableCell align="right">{ticketTierDetail.primarySalePrice}</TableCell>

      <TableCell align="right">
        <TableMoreMenu
          open={openMenu}
          onOpen={handleOpenMenu}
          onClose={handleCloseMenu}
          actions={
            <>
              <MenuItem
                onClick={() => {
                  onEditRow();
                  handleCloseMenu();
                }}
              >
                <Iconify icon={'eva:edit-fill'} />
                View
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDeleteRow();
                  handleCloseMenu();
                }}
                sx={{ color: 'error.main' }}
              >
                <Iconify icon={'eva:trash-2-outline'} />
                Close
              </MenuItem>
            </>
          }
        />
      </TableCell>
    </TableRow>
  );
}
