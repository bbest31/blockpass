import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { useTheme } from '@mui/material/styles';
import { TableRow, Checkbox, TableCell, Typography, MenuItem, Box } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
import { fCurrency } from '../../../../utils/formatNumber';
// components
import Label from '../../../../components/Label';
import Image from '../../../../components/Image';
import Iconify from '../../../../components/Iconify';
import { TableMoreMenu } from '../../../../components/table';

// ----------------------------------------------------------------------

OrganizationEventTableRow.propTypes = {
  row: PropTypes.object,
  // selected: PropTypes.bool,
  // onEditRow: PropTypes.func,
  // onSelectRow: PropTypes.func,
  // onDeleteRow: PropTypes.func,
};

export default function OrganizationEventTableRow({ row, selected, onEditRow, onSelectRow, onDeleteRow }) {
  const theme = useTheme();

  const { name, primarySalePrice, supply, totalTickets, tokenURI } = row;

  const [openMenu, setOpenMenuActions] = useState(null);

  const handleOpenMenu = (event) => {
    setOpenMenuActions(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setOpenMenuActions(null);
  };

  return (
    // <TableRow hover selected={selected}>
    <TableRow hover>
      <TableCell padding="checkbox">
        {/* <Checkbox checked={selected} onClick={onSelectRow} /> */}
        <Checkbox />
      </TableCell>

      <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
        <Box sx={{ borderRadius: 1.5, width: 48, height: 48, mr: 2 }}>
          <img
            alt={name}
            src={tokenURI}
            style={{ width: 48, height: 48, 'object-fit': 'contain' }}
          />
        </Box>

        <Typography variant="subtitle2" noWrap>
          {name}
        </Typography>
      </TableCell>

      <TableCell>{totalTickets - supply}</TableCell>

      <TableCell align="center">
        <Label
          variant={theme.palette.mode === 'light' ? 'ghost' : 'filled'}
          // color={
          //   (inventoryType === 'out_of_stock' && 'error') || (inventoryType === 'low_stock' && 'warning') || 'success'
          // }
          color="success"
          sx={{ textTransform: 'capitalize' }}
        >
          {/* {inventoryType ? sentenceCase(inventoryType) : ''} */}
          Active
        </Label>
      </TableCell>

      <TableCell align="right">{primarySalePrice}</TableCell>

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
