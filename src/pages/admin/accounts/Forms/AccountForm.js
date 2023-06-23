import * as Yup from 'yup';
import { useFormik, Form, FormikProvider, Field } from 'formik';
import { useState, useEffect } from 'react';
// material
import { TextField, Stack } from '@mui/material';
import {CommonService, AccountService} from 'src/api/services';
import { fDateTime } from 'src/utils/formatTime';
// app
import {
    AccountTypes,
    AccountStatuses,
    AccountChannelTypes,
    getLabelByValue,
    getValueByLabel
} from 'src/constants/index';
import {LoadingButton} from "@mui/lab";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
// ----------------------------------------------------------------------

export default function AccountForm({ formType, formData, setModalStatus, setSnackbarStatus, setMessage, successCallback }) {
    const [setLanguages] = useState([]);

    useEffect(() => {
        CommonService.getTTSLanguages({})
            .then((response) => {
                setLanguages(response.data.results);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const AccountSchema = Yup.object().shape({
        status: Yup.string(),
        accountType: Yup.string(),
        channelType: Yup.string(),
        createdDate: Yup.date(),
    });

    const formik = useFormik({
        initialValues: {
            status: getLabelByValue(AccountStatuses, formData.status),
            accountType: getLabelByValue(AccountTypes, formData.account_type),
            channelType: getLabelByValue(AccountChannelTypes, formData.channel_type),
            createdDate: formData.created ? fDateTime(+formData.created * 1000) : "",
        },
        validationSchema: AccountSchema,
        onSubmit: (values, actions) => {
            const payload = {
                account_type: parseInt(getValueByLabel(AccountTypes, values.accountType)),
                channel_type: parseInt(getValueByLabel(AccountChannelTypes, values.channelType)),
                status: parseInt(getValueByLabel(AccountStatuses, values.status)),
            };
            console.log(payload);
            let apiService, successMessage, failMessage;
            if (formType === "edit") {
                apiService = AccountService.addOrganizationAccount(formData.id, payload);
                successMessage = `${formData.name} has been successfully updated`;
                failMessage = `${formData.name} could not be updated`;
            }
            apiService
                .then((response) => {
                    if (response.status === 200 || response.status === 201) {
                        if (setMessage) { setMessage(successMessage); };
                        if (setSnackbarStatus) { setSnackbarStatus(true); };
                        if (setModalStatus && formType !== "test") { setModalStatus(false); };
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

    const { values, errors, touched, isSubmitting, handleSubmit, getFieldProps, setFieldValue } = formik;

    const getFieldByName = (fieldName) => {
        if (fieldName === "status" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Status"
                {...getFieldProps('status')}
                error={Boolean(touched.status && errors.status)}
                helperText={touched.status && errors.status}
            />
        }
        if (fieldName === "accountType" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Account Type"
                {...getFieldProps('accountType')}
                error={Boolean(touched.status && errors.status)}
                helperText={touched.status && errors.status}
            />
        }
        if (fieldName === "channelType" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Channel Type"
                {...getFieldProps('channelType')}
                error={Boolean(touched.status && errors.status)}
                helperText={touched.status && errors.status}
            />
        }
        if (fieldName === "createdDate" && formType === "view") {
            return <TextField
                fullWidth
                disabled
                label="Created Date"
                {...getFieldProps('createdDate')}
                error={Boolean(touched.createdDate && errors.createdDate)}
                helperText={touched.createdDate && errors.createdDate}
            />
        }
        if (fieldName === "submitButton") {
            return (
                <LoadingButton
                    size="large"
                    type="submit"
                    variant="contained"
                    disabled={formType === "view" ? true : false}
                    loading={isSubmitting}
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
                        {getFieldByName("status")}
                        {getFieldByName("accountType")}
                        {getFieldByName("channelType")}
                        {getFieldByName("createdDate")}
                        {getFieldByName("updatedDate")}
                    </Stack>
                    <br />
                    {getFieldByName("submitButton")}
                    <br />
                </Form>
            </FormikProvider >
        </>
    );
}
