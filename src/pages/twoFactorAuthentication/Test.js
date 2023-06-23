import { useState } from 'react';
// material
import { styled } from '@mui/system';
import { Box, Grid, Typography, Paper } from '@mui/material';
// components
import { ServiceForm } from './Forms';
import { VerifyOTPForm } from './Forms';

// ----------------------------------------------------------------------

const RootContainerStyle = styled(Box)(({ theme }) => ({
    flexGrow: 1,
    borderRadius: 10,
    padding: "4px",
    backgroundColor: theme.palette.primary.light,
}));

const FormContainerStyle = styled('div')(({ theme }) => ({
    borderRadius: 10,
    padding: "20px",
    backgroundColor: theme.palette.common.white,
    maxWidth: "400px",
    marginLeft: "auto",
    marginRight: "auto",
}));

const ResultContainerStyle = styled(Paper)(({ theme }) => ({
    minWidth: 400,
    minHeight: 400,
    textAlign: "center",
    padding: "20px",
    backgroundColor: theme.palette.common.white,
    borderRadius: 10,
}));

// ----------------------------------------------------------------------

export default function Test() {
    const [otpDetails, setOtpDetails] = useState({});

    return (
        <RootContainerStyle>
            <Grid container sx={{ mt: 1, mb: 1 }}>
                <Grid item sx={{ p: 2 }} xs={12} md={6}>
                    <FormContainerStyle>
                        <ServiceForm formType="test" formData={{}} successCallback={setOtpDetails} />
                    </FormContainerStyle>
                </Grid>
                <Grid item sx={{ p: 2 }} xs={12} md={6}>
                    <FormContainerStyle>
                        {otpDetails.codeLength ? <VerifyOTPForm formData={otpDetails} /> : <Typography >Please send a test message to verify the code</Typography>}
                    </FormContainerStyle>
                </Grid>
            </Grid>
        </RootContainerStyle>
    );
}
