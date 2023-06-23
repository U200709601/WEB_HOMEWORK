import { useState } from 'react';
import * as Yup from 'yup';
import { useFormik, Form, FormikProvider } from 'formik';
import CloseIcon from '@mui/icons-material/Close';
import { styled } from '@mui/system';
import { Grid, TextField, FormControl, Snackbar, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import SendIcon from '@mui/icons-material/Send';
import { TableFilterContainer } from 'src/components/table';
import { ProgrammableSmsService } from 'src/api/services';
import { useTranslation } from 'react-i18next';


const SendButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));


const TextFieldStyled = styled(TextField)(({ theme }) => ({
    minWidth: "275px",
}));


export default function Service() {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const { t } = useTranslation();

    const SendSmsSchema = Yup.object().shape({
        fromNumber: Yup.string().matches(/^[a-zA-Z0-9]*$/, t("form.validation.matches.alphanumeric", { fieldName: t("common.fromNumber") })).min(4, t("form.validation.min")).max(24, t("form.validation.max")).required(t("form.validation.required", { fieldName: t("common.fromNumber") })),
        toNumber: Yup.string().matches(/^[a-zA-Z0-9]*$/, t("form.validation.matches.alphanumeric", { fieldName: t("common.toNumber") })).min(4, t("form.validation.min")).max(24, t("form.validation.max")).required(t("form.validation.required", { fieldName: t("common.toNumber") })),
        body: Yup.string().min(20, t("form.validation.min")).required(t("form.validation.required", { fieldName: t("common.form.messageBody") }))
    });

    const formik = useFormik({
        initialValues: {
            fromNumber: '',
            toNumber: '',
            body: ''
        },
        validationSchema: SendSmsSchema,
        onSubmit: (values, actions) => {
            const payload = {
                from_number: values.fromNumber,
                to_number: values.toNumber,
                body: values.body,
            };

            ProgrammableSmsService.sendSms(payload)
                .then((response) => {
                    if (response.status === 201) {
                        setMessage(t("form.sendSms.successMessage"));
                    } else {
                        throw "send sms failed";
                    }
                })
                .catch((err) => {
                    setMessage(t("form.sendSms.failMessage"));
                })
                .finally(() => {
                    setOpen(true);
                    actions.setSubmitting(false);
                });
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
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
            </Snackbar>
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit} >
                    <TableFilterContainer>
                        <Grid direction="column" sx={{ alignItems: "center" }} container spacing={0}>
                            <Grid item md={3} xs={12}>
                                <FormControl fullWidth>
                                    <TextFieldStyled
                                        label={t("common.fromNumber")}
                                        margin="normal"
                                        variant="outlined"
                                        color="secondary"
                                        required
                                        {...getFieldProps('fromNumber')}
                                        error={Boolean(touched.fromNumber && errors.fromNumber)}
                                        helperText={touched.fromNumber && errors.fromNumber}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <FormControl fullWidth>
                                    <TextFieldStyled
                                        label={t("common.toNumber")}
                                        name="toNumber"
                                        margin="normal"
                                        variant="outlined"
                                        color="secondary"
                                        required
                                        {...getFieldProps('toNumber')}
                                        error={Boolean(touched.toNumber && errors.toNumber)}
                                        helperText={touched.toNumber && errors.toNumber}
                                    />
                                </FormControl>
                            </Grid>
                            <Grid item md={3} xs={12}>
                                <FormControl fullWidth>
                                    <TextFieldStyled
                                        label={t("common.form.messageBody")}
                                        name="body"
                                        margin="normal"
                                        variant="outlined"
                                        color="secondary"
                                        placeholder={t("common.form.messageBodyPlaceholder")}
                                        multiline
                                        required
                                        {...getFieldProps('body')}
                                        error={Boolean(touched.body && errors.body)}
                                        helperText={touched.body && errors.body}
                                    />
                                </FormControl>
                            </Grid>
                            <SendButtonContainer item md={3} xs={12}>
                                <LoadingButton
                                    size="large"
                                    type="submit"
                                    variant="contained"
                                    color="secondary"
                                    endIcon={<SendIcon />}
                                    loading={isSubmitting}
                                    sx={{ mt: 2, mb: 1 }}
                                >
                                    {t("form.sendSms.submit")}
                                </LoadingButton>
                            </SendButtonContainer>
                        </Grid>
                    </TableFilterContainer>
                </Form>
            </FormikProvider>
        </>

    )
}
