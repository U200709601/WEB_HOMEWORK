import * as Yup from 'yup';
import { useState } from 'react';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
    Stack,
    TextField,
    FormControl,
    Box,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import copyOutline from '@iconify/icons-eva/copy-outline';
// app
import { useStore } from 'src/store/Store';
import { ProfileService } from 'src/api/services';
import BaseSnackbar from '../BaseSnackbar';
// ----------------------------------------------------------------------

export default function ProfileDetailsForm() {
    const [showNotification, setShowNotification] = useState(false);
    const [message, setMessage] = useState("");
    const [showApiKey, setShowApiKey] = useState(false);
    const [showApiAccountId, setShowApiAccountId] = useState(false);
    const [store, dispatch] = useStore();
    const ProfileDetailsSchema = Yup.object().shape({
        first_name: Yup.string().required('First name is required'),
        last_name: Yup.string().required('Last name is required'),
    });

    const handleCopyText = (text) => {
        navigator.clipboard.writeText(text);
    }

    const formik = useFormik({
        initialValues: {
            first_name: store.user.first_name,
            last_name: store.user.last_name
        },
        validationSchema: ProfileDetailsSchema,
        onSubmit: (values, actions) => {
            const payload = {
                first_name: values.first_name,
                last_name: values.last_name,
                email: store.user.email,
            };
            ProfileService.updateProfile(store.user.id, payload)
                .then((response) => {
                    if (response.status === 200) {
                        dispatch({
                            type: "UPDATE_USER",
                            payload: {
                                user: {
                                    first_name: values.first_name,
                                    last_name: values.last_name,
                                    email: store.user.email,
                                    organization: store.user.organization
                                }
                            }
                        });
                        setMessage("Profile updated successfully");
                        setShowNotification(true);
                    } else {
                        throw "profile could not be updated";
                    }
                })
                .catch((err) => {
                    setMessage("Profile could not be updated");
                    setShowNotification(true);
                })
                .finally(() => {
                    actions.setSubmitting(false);
                })
        }
    });

    const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

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
                                label="First Name"
                                {...getFieldProps('first_name')}
                                error={Boolean(touched.first_name && errors.first_name)}
                                helperText={touched.first_name && errors.first_name}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                required
                                color="secondary"
                                label="Last Name"
                                {...getFieldProps('last_name')}
                                error={Boolean(touched.last_name && errors.last_name)}
                                helperText={touched.last_name && errors.last_name}
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                color="secondary"
                                type="email"
                                label="Email"
                                defaultValue={store.user.email}
                                disabled
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                color="secondary"
                                label="Organization"
                                defaultValue={store.user.organization}
                                disabled
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                color="secondary"
                                label="API Account ID"
                                defaultValue={store.user.api_account_id}
                                type={showApiAccountId ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleCopyText(store.user.api_account_id)} edge="end">
                                                <Icon icon={copyOutline} />
                                            </IconButton>
                                            <IconButton onClick={() => setShowApiAccountId(!showApiAccountId)} edge="end">
                                                <Icon icon={showApiAccountId ? eyeFill : eyeOffFill} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                disabled
                            />
                        </FormControl>

                        <FormControl>
                            <TextField
                                color="secondary"
                                label="API Key"
                                defaultValue={store.user.api_key}
                                type={showApiKey ? 'text' : 'password'}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleCopyText(store.user.api_key)} edge="end">
                                                <Icon icon={copyOutline} />
                                            </IconButton>
                                            <IconButton onClick={() => setShowApiKey(!showApiKey)} edge="end">
                                                <Icon icon={showApiKey ? eyeFill : eyeOffFill} />
                                            </IconButton>
                                        </InputAdornment>
                                    )
                                }}
                                disabled
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
                            Update Profile
                        </LoadingButton>
                    </Box>
                </Form>
            </FormikProvider >
        </>
    );
}
