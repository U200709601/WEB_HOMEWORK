import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
import SaveIcon from '@mui/icons-material/Save';
// app
import { TariffService } from 'src/api/services';

// ----------------------------------------------------------------------

export default function SmsTariffForm({ formData, setModalStatus, setSnackbarStatus, setMessage, formType = "add", successCallback, countries }) {
    const SmsTariffSchema = Yup.object().shape({
        formType: Yup.string(),
        breakout: Yup.string().min(4, "Too short!").max(48, "Too long!").required("Breakout is required"),
        country: Yup.string().required("Country must be selected"),
        prefix: Yup.string().min(1, "Too short!").max(16, "Too long!").matches(/^\d+$/, "Prefix must contain digits only").required("Prefix is required"),
        rate: Yup.number().min(0.0000001, "Rate must be greater than zero").required("Rate is required"),
        effectiveStart: Yup.date().nullable(true),
        effectiveEnd: Yup.date().nullable(true).min(
            Yup.ref("effectiveStart"),
            "End date can't be before start date"
          ),
    });

    const formik = useFormik({
        initialValues: {
            formType: formType,
            breakout: formData.breakout || "",
            country: formData.country || "",
            prefix: formData.prefix || "",
            rate: formData.rate || 0,
            effectiveStart: formData.effectiveStart ? new Date(+formData.effectiveStart * 1000) : "",
            effectiveEnd: formData.effectiveEnd ? new Date(+formData.effectiveEnd * 1000) : "",
        },
        validationSchema: SmsTariffSchema,
        onSubmit: (values, actions) => {
            const payload = {
                breakout: values.breakout,
                country: values.country,
                prefix: values.prefix,
                rate: values.rate,
                effective_start: values.effectiveStart ? values.effectiveStart : undefined,
                effective_end: values.effectiveEnd ? values.effectiveEnd : undefined,
            };
            let apiService, successMessage, failMessage;
            if (formType === "add") {
                apiService = TariffService.addSmsTariff(payload);
                successMessage = "New breakout has been successfully added";
                failMessage = "New breakout could not be added";
            } else {
                apiService = TariffService.updateSmsTariff(formData.id, payload);
                successMessage = `${formData.breakout} has been successfully updated`;
                failMessage = `${formData.breakout} could not be updated`;
            }

            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus) { setModalStatus(false); };
                        if (successCallback) { successCallback() };
                        actions.setSubmitting(false);
                    } else { throw "sms tariff operation failed"; }
                })
                .catch((err) => {
                    if (err.response.data.error) { failMessage = `${failMessage}. ${err.response.data.error[0]}`; }
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        }
    });


    const { errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const getFieldByName = (fieldName) => {
        if (fieldName === "breakout") {
            return (
                <TextField
                    fullWidth
                    label="Breakout"
                    {...getFieldProps('breakout')}
                    error={Boolean(touched.breakout && errors.breakout)}
                    helperText={touched.breakout && errors.breakout}
                />
            );
        }
        if (fieldName === "country") {
            return (
                <FormControl fullWidth>
                    <InputLabel id="country-label">Country</InputLabel>
                    <Select
                        label="Country"
                        labelId="country-label"
                        color="secondary"
                        {...getFieldProps('country')}
                        error={Boolean(touched.country && errors.country)}
                        helperText={touched.country && errors.country}
                    >
                        {countries.map((country, idx) => {
                            return <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            );
        }
        if (fieldName === "prefix") {
            return (
                <TextField
                    fullWidth
                    label="Prefix"
                    {...getFieldProps('prefix')}
                    error={Boolean(touched.prefix && errors.prefix)}
                    helperText={touched.prefix && errors.prefix}
                />
            );
        }
        if (fieldName === "rate") {
            return (
                <TextField
                    fullWidth
                    type="number"
                    label="Rate"
                    {...getFieldProps('rate')}
                    error={Boolean(touched.rate && errors.rate)}
                    helperText={touched.rate && errors.rate}
                />
            );
        }
        if (fieldName === "effectiveStart") {
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Effective Start"
                        {...getFieldProps("effectiveStart")}
                        minDateTime={new Date()}
                        onChange={(newValue) => { setFieldValue("effectiveStart", newValue) }}
                        renderInput={(params) => <TextField {...params} error={Boolean(touched.effectiveStart && errors.effectiveStart)} helperText={touched.effectiveStart && errors.effectiveStart ? errors.effectiveStart : "Leave blank to start immediately"}/>}
                    />
                </LocalizationProvider>
            );
        }
        if (fieldName === "effectiveEnd") {
            return (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DateTimePicker
                        label="Effective End"
                        {...getFieldProps("effectiveEnd")}
                        minDateTime={new Date()}
                        onChange={(newValue) => { setFieldValue("effectiveEnd", newValue) }}
                        renderInput={(params) => <TextField {...params} error={Boolean(touched.effectiveEnd && errors.effectiveEnd)} helperText={touched.effectiveEnd && errors.effectiveEnd ? errors.effectiveEnd : "Leave blank to set no end date"}/>}
                    />
                </LocalizationProvider>
            );
        }

        if (fieldName === "submitButton") {
            return (
                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    loading={isSubmitting}
                    startIcon={<SaveIcon />}
                >
                    Save
                </LoadingButton>
            )
        }
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {getFieldByName("breakout")}
                        {getFieldByName("country")}
                        {getFieldByName("prefix")}
                        {getFieldByName("rate")}
                        {getFieldByName("effectiveStart")}
                        {getFieldByName("effectiveEnd")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                </Form>
            </FormikProvider >
        </>
    );
}
