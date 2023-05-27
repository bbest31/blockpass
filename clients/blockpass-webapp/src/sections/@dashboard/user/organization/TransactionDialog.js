import { useState } from 'react';
// @mui
import { Button, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@mui/material';

// ----------------------------------------------------------------------

export default function TransactionDialog({ isOpen, onCloseHandler }) {
  return (
    <div>
      {/* <Button color="info" variant="outlined" onClick={handleClickOpen}>
        Open alert dialog
      </Button> */}

      <Dialog open={isOpen} onClose={onCloseHandler}>
        <DialogTitle>Use Google's location service?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Let Google help apps determine location. This means sending anonymous location data to Google, even when no
            apps are running.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onCloseHandler}>Disagree</Button>
          <Button onClick={onCloseHandler} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
