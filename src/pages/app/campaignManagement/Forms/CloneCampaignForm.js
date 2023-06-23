import * as React from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import {
    Stack,
    TextField,
    Select,
    Grid,
    MenuItem,
    Checkbox,
    FormControl,
    InputLabel,
    FormControlLabel
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import { LoadingButton } from '@mui/lab';
import { CampaignManagementService } from 'src/api/services';

const infoContainer = {
    backgroundColor: "#D5DDB9",
    color: "#0A1845",
    borderRadius: "4px",
    marginTop: "30px",
    padding: "20px 30px",
    fontSize: "12px",
    alignItems: "center",
}

export default function CampaignForm({ formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {

    const CampaignSchema = Yup.object().shape({
        scheduledDate: Yup.date().nullable(true),
        isRecurring: Yup.bool(),
        recurringDurationInDays: Yup.number().nullable(true),
        recurringFrequencyInMinutes: Yup.number().nullable(true),
    });

    const formik = useFormik({
        initialValues: {
            scheduledDate: null,
            isRecurring: false,
            recurringDurationInDays: 1,
            recurringFrequencyInMinutes: 60,
        },
        validationSchema: CampaignSchema,
        onSubmit: (values, actions) => {
            console.log(values);
            let payload = {
                scheduled_at: values.scheduledDate === null ? new Date() : values.scheduledDate,
                is_recurring: values.isRecurring,
                duration_in_days: values.recurringDurationInDays,
                frequency_in_minutes: values.recurringFrequencyInMinutes,
            };

            console.log("payload", payload);
            const apiService = CampaignManagementService.cloneCampaign(formData.id, payload);
            const successMessage = `${formData.name} has been successfully cloned`;
            const failMessage = `${formData.name} could not be cloned`;

            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus) { setModalStatus(false); };
                        if (successCallback) { successCallback(response); };
                        actions.setSubmitting(false);
                    } else { throw "campaign operation failed"; }
                })
                .catch((err) => {
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        },
        validateOnMount: true,
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3} sx={{ mt: 5 }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateTimePicker
                                label="Scheduled Date"
                                {...getFieldProps('scheduledDate')}
                                onChange={(newValue) => {
                                    formik.setFieldValue("scheduledDate", newValue);
                                }}
                                renderInput={(params) => <TextField {...params} helperText="Leave blank to schedule immediately" />}
                            />
                        </LocalizationProvider>
                        <FormControlLabel control={<Checkbox {...getFieldProps('isRecurring')} />} label="Recurring Campaign" />
                        {
                            formik.values.isRecurring &&
                            (<>
                                <FormControl fullWidth>
                                    <InputLabel id="duration-select-label">Recurring Duration</InputLabel>
                                    <Select
                                        labelId="duration-select-label"
                                        {...getFieldProps('recurringDurationInDays')}
                                        error={Boolean(touched.recurringDurationInDays && errors.recurringDurationInDays)}
                                        helperText={touched.recurringDurationInDays && errors.recurringDurationInDays}
                                        label="Recurring Duration"
                                    >
                                        <MenuItem value={1}>1 day</MenuItem>
                                        <MenuItem value={3}>3 days</MenuItem>
                                        <MenuItem value={7}>1 week</MenuItem>
                                    </Select>
                                </FormControl>
                                <FormControl fullWidth>
                                    <InputLabel id="frequency-select-label">Recurring Frequency</InputLabel>
                                    <Select
                                        labelId="frequency-select-label"
                                        {...getFieldProps('recurringFrequencyInMinutes')}
                                        error={Boolean(touched.recurringFrequencyInMinutes && errors.recurringFrequencyInMinutes)}
                                        helperText={touched.recurringFrequencyInMinutes && errors.recurringFrequencyInMinutes}
                                        label="Recurring Frequency"
                                    >
                                        <MenuItem value={60}>1 hour</MenuItem>
                                        <MenuItem value={360}>6 hours</MenuItem>
                                        <MenuItem value={720}>12 hours</MenuItem>
                                    </Select>
                                </FormControl>
                            </>)
                        }
                        <Grid style={infoContainer}>
                            <h2>
                                <NotificationsIcon /> Scheduling the Campaign
                            </h2>
                            <p style={{ height: "100" }}>
                                Choosing a date and time at which the campaign has to take
                                place. <b>Note:</b> To schedule the campaign immediately,
                                leave <b>"Schedule Date"</b> as blank and click on
                                <b>"Save"</b>.
                            </p>
                        </Grid>
                        <LoadingButton
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Save
                        </LoadingButton>
                    </Stack>
                </Form>
            </FormikProvider>
        </>
    );
}
