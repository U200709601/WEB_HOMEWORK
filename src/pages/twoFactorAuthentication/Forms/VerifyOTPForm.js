import { useState } from 'react';
// material
import {
    Stack,
    TextField,
    FormControl,
    Typography,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
// app
import palette from 'src/theme/palette';
import { TwoFactorAuthenticationService } from 'src/api/services';
// ----------------------------------------------------------------------

export default function VerifyOTPForm({ formData }) {
    const [loading, setLoading] = useState(false);
    const [code, setCode] = useState("");
    const [result, setResult] = useState();

    const verifyOTPCode = () => {
        if (result === true) { return; }
        setLoading(true);
        const payload = {
            service: formData.serviceId,
            request_id: formData.requestId,
            to_number: formData.toNumber,
            code: code,
        };
        TwoFactorAuthenticationService.verifyOTPMessage(payload)
            .then((response) => {
                if (response.status === 200) {
                    setResult(true);
                } else {
                    throw "code could not be verified";
                }
            })
            .catch((err) => {
                setResult(false);
                setTimeout(() => {
                    setResult();
                    setCode("");
                }, 1000);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    const getSubmitButton = () => {
        let startIcon, label, bgColor, textColor, hoverBgColor;
        if (result === true) {
            startIcon = <CheckIcon />;
            label = "Verified";
            bgColor = palette.success.main;
            hoverBgColor = palette.success.lighter;
            textColor = palette.success.contrastText;
        } else if (result === false) {
            startIcon = <CloseIcon />;
            label = "Failed";
            bgColor = palette.error.main;
            hoverBgColor = palette.error.lighter;
            textColor = palette.error.contrastText;
        } else {
            startIcon = <LockOpenIcon />;
            label = "Verify";
            bgColor = palette.secondary.main;
            hoverBgColor = palette.secondary.lighter;
            textColor = palette.secondary.contrastText;
        }
        return <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            startIcon={startIcon}
            loading={loading}
            disabled={code.length !== +formData.codeLength ? true : false}
            sx={{ backgroundColor: bgColor, color: textColor, '&:hover': { backgroundColor: hoverBgColor } }}
            onClick={verifyOTPCode}
        >
            {label}
        </LoadingButton>
    }

    return (
        <>
            <Stack spacing={3}>
                <Typography component="h6" sx={{ mt: 3 }}>
                    {`Please type in the code you received`}
                </Typography>
                <FormControl fullWidth>
                    <TextField
                        fullWidth
                        value={code}
                        label="OTP Code"
                        onChange={(event) => setCode(event.target.value)}
                        error={code.length !== +formData.codeLength ? true : false}
                        helperText={code.length !== +formData.codeLength ? `Code should be ${formData.codeLength} characters` : null}
                        disabled={result === true ? true : false}
                    />
                </FormControl>
                <Stack sx={{ display: "block" }} direction="row" spacing={2}>
                    {getSubmitButton()}
                </Stack>
            </Stack>
        </>
    );
}
