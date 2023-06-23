import { useState } from 'react';
// material
import {
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { TwoFactorAuthenticationService } from 'src/api/services';
// ----------------------------------------------------------------------

export default function DeleteServiceForm({ formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const [loading, setLoading] = useState(false);
    const deleteService = () => {
        setLoading(true);
        TwoFactorAuthenticationService.deleteTwoFAService(formData.id)
            .then((response) => {
                if (response.status === 204) {
                    setMessage(`${formData.name} has been successfully deleted`);
                    setSnackbarStatus(true);
                    setModalStatus(false);
                    setLoading(false);
                    successCallback();
                } else {
                    throw "service could not be deleted";
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
                    {`Are you sure delete this service?`}
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
                        onClick={deleteService}
                    >
                        Delete
                    </LoadingButton>
                </Stack>
            </Stack>
        </>
    );
}
