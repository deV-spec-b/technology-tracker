import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function NotificationSnackbar({ 
    open, 
    message, 
    severity = 'info', 
    autoHideDuration = 6000,
    onClose 
}) {
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert 
                onClose={handleClose} 
                severity={severity} 
                sx={{ width: '100%' }}
                variant="filled"
            >
                {message}
            </Alert>
        </Snackbar>
    );
}

export default NotificationSnackbar;