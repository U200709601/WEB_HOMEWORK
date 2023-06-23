// material
import { Snackbar, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
// ----------------------------------------------------------------------

export default function BaseSnackbar({ vertical = "top", horizontal = "center", open = false, message = "", setOpen }) {
    return <Snackbar
        anchorOrigin={{ vertical: vertical, horizontal: horizontal }}
        open={open}
        autoHideDuration={6000}
        message={message}
        onClose={() => setOpen(false)}
        action={
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={() => setOpen(false)}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        }>
    </Snackbar>;
}
