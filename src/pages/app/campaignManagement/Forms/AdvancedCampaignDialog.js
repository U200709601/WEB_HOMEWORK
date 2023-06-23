import BaseButton from 'src/components/buttons/BaseButton';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';


export default function AdvancedCampaignDialog({ open, setOpen, setIsProgrammable }) {

    const handleClose = (isProgrammable) => {
        setIsProgrammable(isProgrammable);
        setOpen(false);
    };

    return (
        <>
            <Dialog
                open={open}
                onClose={() => handleClose(false)}
                aria-labelledby="advanced-campaign-dialog-title"
                aria-describedby="advanced-campaign-dialog-description"
            >
                <DialogTitle id="advanced-campaign-dialog-title">
                    Use programmable campaign designer?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="advanced-campaign-dialog-description">
                        Programmable campaign designer lets you customize the SMS body per destination number.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <BaseButton label={"No"} onClick={() => handleClose(false)} />
                    <BaseButton label={"Yes"} onClick={() => handleClose(true)} props={{ autoFocus: true }} />
                </DialogActions>
            </Dialog>
        </>
    );
}
