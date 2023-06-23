import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// app
import { useStore } from 'src/store/Store';
import { ProfileService } from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';
// ----------------------------------------------------------------------

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loginMessage, setLoginMessage] = useState("User not found");
  const [store, dispatch] = useStore();
  const navigate = useNavigate();

  const getFormData = (values) => {
    return {
      username: values.email,
      password: values.password,
    }
  }

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: LoginSchema,
    onSubmit: (values, actions) => {
      actions.setSubmitting(true);
      const payload = getFormData(values);

      ProfileService.login(payload)
        .then((response) => {
          if (response.status !== 200) {
            const errorMessage = response.response.data.non_field_errors ?
              response.response.data.non_field_errors[0] :
              response.response.data.detail;
            setLoginMessage(errorMessage);
            setOpenSnackbar(true);
            throw "login failed";
          }
          dispatch({
            type: "LOGIN",
            payload: {
              token: response.data.token,
              user: response.data.user
            }
          });
          navigate('/admin/engines', { replace: true });
        })
        .catch((err) => {
          dispatch({ type: "LOGIN_FAIL" });
        })
        .finally(() => {
          actions.setSubmitting(false);
        });
    }
  });

  const { errors, touched, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <>
      <BaseSnackbar open={openSnackbar} message={loginMessage} setOpen={setOpenSnackbar} />
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              fullWidth
              autoComplete="username"
              type="email"
              label="Email address"
              {...getFieldProps('email')}
              error={Boolean(touched.email && errors.email)}
              helperText={touched.email && errors.email}
            />

            <TextField
              fullWidth
              autoComplete="current-password"
              type={showPassword ? 'text' : 'password'}
              label="Password"
              {...getFieldProps('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleShowPassword} edge="end">
                      <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
              error={Boolean(touched.password && errors.password)}
              helperText={touched.password && errors.password}
            />
          </Stack>
          <br />

          <LoadingButton
            fullWidth
            size="large"
            type="submit"
            variant="contained"
            loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider >
    </>
  );
}
