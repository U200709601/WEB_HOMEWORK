import { useState } from 'react';
// material
import {
    Stack,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { CampaignManagementService } from 'src/api/services';

// ----------------------------------------------------------------------

export default function DeleteAnnouncementForm({ formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const [loading, setLoading] = useState(false);
    const deleteAnnouncement = () => {
        setLoading(true);
        CampaignManagementService.deleteAnnouncement(formData.id)
            .then((response) => {
                if (response.status === 204) {
                    setMessage(`${formData.name} has been successfully deleted`);
                    setSnackbarStatus(true);
                    setModalStatus(false);
                    setLoading(false);
                    successCallback();
                } else {
                    throw "announcement could not be deleted";
                }
            })
            .catch((err) => {
                setMessage(`${formData.name} could not be deleted`);
                setSnackbarStatus(true);
                setModalStatus(false);
                setLoading(false);
            });
    }

    return (
        <>
            <Stack spacing={3}>
                <Typography component="h6">
                    {`Are you sure delete this announcement?`}
                </Typography>
                <Typography component="subtitle1" variant="h6">
                    {formData.name}
                </Typography>
                <Stack sx={{ display: "block" }} direction="row" spacing={2}>
                    <LoadingButton
                        type="submit"
                        color="primary"
                        variant="contained"
                        disabled={loading}
                        onClick={() => setModalStatus(false)}
                    >
                        Cancel
                    </LoadingButton>
                    <LoadingButton
                        type="submit"
                        color="secondary"
                        variant="contained"
                        loading={loading}
                        onClick={deleteAnnouncement}
                    >
                        Delete
                    </LoadingButton>
                </Stack>
            </Stack>
        </>
    );
}
