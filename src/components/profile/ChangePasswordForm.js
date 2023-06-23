import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
    Stack,
    TextField,
    IconButton,
    InputAdornment,
    FormControl,
    Box,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { useStore } from 'src/store/Store';
import { ProfileService } from 'src/api/services';
import BaseSnackbar from '../BaseSnackbar';

// ----------------------------------------------------------------------

export default function ChangePasswordForm() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showVerifyPassword, setShowVerifyPassword] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");
    const [store, dispatch] = useStore();

    const ChangePasswordSchema = Yup.object().shape({
        oldPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(8, 'Password must contain at least 8 characters'),
        newPasswordVerify: Yup.string()
            .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
            .required("Verify password is required")
    });

    const formik = useFormik({
        initialValues: {
            oldPassword: '',
            newPassword: '',
            newPasswordVerify: '',
        },
        validationSchema: ChangePasswordSchema,
        onSubmit: (values, actions) => {
            const payload = {
                old_password: values.oldPassword,
                new_password1: values.newPassword,
                new_password2: values.newPasswordVerify,
            };
            ProfileService.changePassword(payload)
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: "CHANGE_PASSWORD",
                            payload: {
                                token: response.data.token,
                            }
                        });
                        setMessage("Password has been successfully changed");
                    } else if (response.response.data.non_field_errors) {
                        setMessage(response.response.data.non_field_errors[0]);
                    } else {
                        throw "password could not be changed";
                    }
                })
                .catch((err) => {
                    setMessage("Password could not be changed");
                })
                .finally(() => {
                    setShowNotification(true);
                    actions.setSubmitting(false);
                })
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

    const handleShowCurrentPassword = () => {
        setShowCurrentPassword((showCurrentPassword) => !showCurrentPassword);
    };

    const handleShowNewPassword = () => {
        setShowNewPassword((showNewPassword) => !showNewPassword);
    };

    const handleShowVerifyPassword = () => {
        setShowVerifyPassword((showVerifyPassword) => !showVerifyPassword);
    };

    return (
        <>
            <BaseSnackbar open={showNotification} message={message} setOpen={setShowNotification} />
            <FormikProvider value={formik}>
                <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        <FormControl>
                            <TextField
                                required
                                color="secondary"
                                type={showCurrentPassword ? 'text' : 'password'}
                                label="Current Password"
                                {...getFieldProps('oldPassword')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowCurrentPassword} edge="end">
                                                <Icon icon={showCurrentPassword ? eyeFill : eyeOffFill} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={Boolean(touched.oldPassword && errors.oldPassword)}
                                helperText={touched.oldPassword && errors.oldPassword}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                required
                                color="secondary"
                                type={showNewPassword ? 'text' : 'password'}
                                label="New Password"
                                {...getFieldProps('newPassword')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowNewPassword} edge="end">
                                                <Icon icon={showNewPassword ? eyeFill : eyeOffFill} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={Boolean(touched.newPassword && errors.newPassword)}
                                helperText={touched.newPassword && errors.newPassword}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                required
                                color="secondary"
                                type={showVerifyPassword ? 'text' : 'password'}
                                label="Verify Password"
                                {...getFieldProps('newPasswordVerify')}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={handleShowVerifyPassword} edge="end">
                                                <Icon icon={showVerifyPassword ? eyeFill : eyeOffFill} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                error={Boolean(touched.newPasswordVerify && errors.newPasswordVerify)}
                                helperText={touched.newPasswordVerify && errors.newPasswordVerify}
                            />
                        </FormControl>
                    </Stack>
                    <br />
                    <Box style={{ textAlign: "right" }}>
                        <LoadingButton
                            color="secondary"
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={isSubmitting}
                        >
                            Change Password
                        </LoadingButton>
                    </Box>
                </Form>
            </FormikProvider >
        </>
    );
}
