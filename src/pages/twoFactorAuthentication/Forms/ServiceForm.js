import { useState, useEffect } from 'react';
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
import SendIcon from '@mui/icons-material/Send';
import SaveIcon from '@mui/icons-material/Save';
// app
import * as Constants from 'src/constants';
import { TwoFactorAuthenticationService, CommonService } from 'src/api/services';
import { VerifyOTPForm } from '.';

// ----------------------------------------------------------------------

export default function ServiceForm({ formData, setModalStatus, setSnackbarStatus, setMessage, formType = "add", successCallback }) {
    const [languages, setLanguages] = useState([]);
    const [testMessageSent, setTestMessageSent] = useState(false);
    const [otpDetails, setOtpDetails] = useState({});

    useEffect(() => {
        CommonService.getTTSLanguages({})
            .then((response) => {
                setLanguages(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const ServiceSchema = Yup.object().shape({
        formType: Yup.string(),
        name: Yup.string().when('formType', {
            is: 'test',
            then: Yup.string(),
            otherwise: Yup.string().min(4, 'Too short!').max(48, 'Too long!').required('Service name is required'),
        }),
        serviceId: Yup.string().when('formType', {
            is: 'test',
            then: Yup.string().required('Service ID is required'),
            otherwise: Yup.string(),
        }),
        codeLength: Yup.string().required('Code length must be selected'),
        type: Yup.string().required('Type must be selected'),
        timeout: Yup.number().min(0, 'Timeout must be at least 0').required('Timeout is required'),
        guardTime: Yup.number().min(0, 'Guard time must be at least 0').required('Guard time is required'),
        body: Yup.string().matches(/(\{code\})/, 'Body must include {code} in it'),
        status: Yup.string().when('formType', {
            is: 'test',
            then: Yup.string(),
            otherwise: Yup.string().required('Status must be selected'),
        }),
        ttsLanguageId: Yup.number().when('type', {
            is: '2',
            then: Yup.number().required('Language must be selected'),
            otherwise: Yup.number()
        }),
        fromNumber: Yup.string().when('formType', {
            is: 'test',
            then: Yup.string().matches(/^[a-zA-Z0-9]*$/, 'From number must be alphanumeric').required('From number is required'),
            otherwise: Yup.string(),
        }),
        toNumber: Yup.string().when('formType', {
            is: 'test',
            then: Yup.string().matches(/^[a-zA-Z0-9]*$/, 'To number must be alphanumeric').required('To number is required'),
            otherwise: Yup.string(),
        }),
    });

    const formik = useFormik({
        initialValues: {
            formType: formType,
            name: formData.name || '',
            serviceId: formData.serviceId || '',
            codeLength: formData.codeLength || "4",
            type: formData.type ? formData.type.toString() : "1",
            timeout: formData.timeout || 180,
            guardTime: formData.guardTime || 60,
            body: formData.body || "Your verification code is {code}",
            ttsLanguageId: formData.ttsLanguageId || "",
            status: formData.status ? formData.status.toString() : "1",
            fromNumber: "",
            toNumber: "",
        },
        validationSchema: ServiceSchema,
        onSubmit: (values, actions) => {
            const payload = formType === "test" ? {
                service: formData.serviceId || values.serviceId,
                from_number: values.fromNumber,
                to_number: values.toNumber,
                timeout: values.timeout,
                code_length: values.codeLength,
                body: values.body,
            } : {
                name: values.name,
                type: values.type,
                code_length: values.codeLength,
                status: values.status,
                default_body: values.body,
                default_guard_time: values.guardTime,
                default_timeout: values.timeout,
                tts_language: values.type === "2" ? values.ttsLanguageId : undefined,
            };
            let apiService, successMessage, failMessage;
            if (formType === "test") {
                apiService = TwoFactorAuthenticationService.sendOTPMessage(payload);
                successMessage = "Test message has been successfully sent";
                failMessage = "Test message could not be sent";
            } else if (formType === "add") {
                apiService = TwoFactorAuthenticationService.addTwoFAService(payload);
                successMessage = "New service has been successfully added";
                failMessage = "New service could not be added";
            } else {
                apiService = TwoFactorAuthenticationService.updateTwoFAService(formData.id, payload);
                successMessage = `${formData.name} has been successfully updated`;
                failMessage = `${formData.name} could not be updated`;
            }

            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        const otpData = { ...values, code: response.data.code, requestId: response.data.request_id };
                        if (formType === "test") {
                            setOtpDetails(otpData);
                            setTestMessageSent(true);
                        };
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus && formType !== "test") { setModalStatus(false); };
                        if (successCallback) {
                            formType === "test" ?
                                successCallback(otpData) :
                                successCallback()
                        };
                        actions.setSubmitting(false);
                    } else { throw "two fa operation failed"; }
                })
                .catch((err) => {
                    if (setMessage) { setMessage(failMessage); };
                    if (setSnackbarStatus) { setSnackbarStatus(true); };
                    if (setModalStatus) { setModalStatus(false); };
                })
        }
    });


    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    const getFieldByName = (fieldName) => {
        if (fieldName === "name") {
            return formType === "test" ? null : (
                <TextField
                    fullWidth
                    label="Service Name"
                    {...getFieldProps('name')}
                    error={Boolean(touched.name && errors.name)}
                    helperText={touched.name && errors.name}
                />
            );
        }
        if (fieldName === "serviceId") {
            return formType === "add" ? null : (
                <TextField
                    fullWidth
                    {...getFieldProps('serviceId')}
                    label="Service ID"
                    disabled={formData.serviceId ? true : false}
                    error={Boolean(touched.serviceId && errors.serviceId)}
                    helperText={touched.serviceId && errors.serviceId}
                />
            );
        }
        if (fieldName === "codeLength") {
            return formType === "test" && formData.codeLength ? null : (
                Constants.getRadioButtonComponent(
                    Constants.TwoFAServiceCodeLengths,
                    getFieldProps('codeLength'),
                    "Code Length"
                )
            )
        }
        if (fieldName === "type") {
            return formType === "test" && formData.type ? null : (
                Constants.getRadioButtonComponent(
                    Constants.TwoFAServiceTypes,
                    getFieldProps('type'),
                    "Type"
                )
            )
        }
        if (fieldName === "timeout") {
            return formType === "test" && formData.timeout ? null : (
                <TextField
                    fullWidth
                    type="number"
                    label="Timeout (s)"
                    {...getFieldProps('timeout')}
                    error={Boolean(touched.timeout && errors.timeout)}
                    helperText={touched.timeout && errors.timeout}
                />
            )
        }
        if (fieldName === "guardTime") {
            return formType === "test" && formData.guardTime ? null : (
                <TextField
                    fullWidth
                    type="number"
                    label="Guard Time (s)"
                    {...getFieldProps('guardTime')}
                    error={Boolean(touched.guardTime && errors.guardTime)}
                    helperText={touched.guardTime && errors.guardTime}
                />
            )
        }
        if (fieldName === "body") {
            return formType === "test" && formData.body ? null : (
                <TextField
                    fullWidth
                    multiline
                    label="Body"
                    {...getFieldProps('body')}
                    error={Boolean(touched.body && errors.body)}
                    helperText={touched.body && errors.body}
                />
            )
        }
        if (fieldName === "status") {
            return formType === "test" ? null : (
                Constants.getRadioButtonComponent(
                    Constants.TwoFAServiceStatuses,
                    getFieldProps('status'),
                    "Status"
                )
            )
        }
        if (fieldName === "ttsLanguageId") {
            return values.type === "1" ? null : (
                formData.serviceId && formType === "test" ? null : <FormControl fullWidth>
                    <InputLabel id="tts-language-label">Language</InputLabel>
                    <Select
                        label="Language"
                        labelId="tts-language-label"
                        color="secondary"
                        {...getFieldProps('ttsLanguageId')}
                        error={Boolean(touched.ttsLanguageId && errors.ttsLanguageId)}
                        helperText={touched.ttsLanguageId && errors.ttsLanguageId}
                    >
                        {languages.map((lang, idx) => {
                            return <MenuItem key={lang.id} value={lang.id}>{lang.name}</MenuItem>;
                        })}
                    </Select>
                </FormControl>
            )
        }
        if (fieldName === "fromNumber") {
            return formType !== "test" ? null : (
                <TextField
                    fullWidth
                    label="From Number"
                    {...getFieldProps('fromNumber')}
                    error={Boolean(touched.fromNumber && errors.fromNumber)}
                    helperText={touched.fromNumber && errors.fromNumber}
                />
            )
        }
        if (fieldName === "toNumber") {
            return formType !== "test" ? null : (
                <TextField
                    fullWidth
                    label="To Number"
                    {...getFieldProps('toNumber')}
                    error={Boolean(touched.toNumber && errors.toNumber)}
                    helperText={touched.toNumber && errors.toNumber}
                />
            )
        }
        if (fieldName === "submitButton") {
            return (
                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={testMessageSent}
                    loading={isSubmitting}
                    loadingPosition={formType === "test" ? "end" : "start"}
                    endIcon={formType === "test" ? <SendIcon /> : null}
                    startIcon={formType !== "test" ? <SaveIcon /> : null}
                >
                    {formType === "test" ? "Send" : "Save"}
                </LoadingButton>
            )
        }
    }

    return (
        <>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {getFieldByName("name")}
                        {getFieldByName("serviceId")}
                        {getFieldByName("codeLength")}
                        {getFieldByName("type")}
                        {getFieldByName("ttsLanguageId")}
                        {getFieldByName("timeout")}
                        {getFieldByName("guardTime")}
                        {getFieldByName("body")}
                        {getFieldByName("status")}
                        {getFieldByName("fromNumber")}
                        {getFieldByName("toNumber")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                </Form>
            </FormikProvider >
            {formType === "test" && formData.serviceId && testMessageSent ? <VerifyOTPForm formData={otpDetails} /> : null}
        </>
    );
}
