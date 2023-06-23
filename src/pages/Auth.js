import {NavLink} from 'react-router-dom';
// material
import {styled} from '@mui/material/styles';
import {Container, Stack, Typography} from '@mui/material';
// components
import Page from '../components/Page';
import {LoginForm} from '../components/authentication/login';
import {AdminLoginForm} from '../components/authentication/login';
import {RegisterForm} from '../components/authentication/register';
// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({theme}) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const ContentStyle = styled('div')(({theme}) => ({
    maxWidth: 480,
    margin: 'auto',
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------

export default function Auth({type = "login"}) {
    let title, subtitle, link, navigateText, formComponent, navLink;
    if (type === "login") {
        title = "Login";
        subtitle = "Sign in to Smartcpaas";
        link = "/register";
        navigateText = "Register if you don't have an account";
        formComponent = <LoginForm/>;
    } else if (type === "admin-login") {
        title = "Admin Login";
        subtitle = "Sign in Smartcpaas Administration";
        link = "/admin/login";
        navigateText = "Please contact with support team";
        formComponent = <AdminLoginForm/>;
    } else if (type === "register") {
        title = "Register";
        subtitle = "Register to Smartcpaas";
        link = "/login";
        navigateText = "Login if you already have an account";
        formComponent = <RegisterForm/>;
    }
    if (link) {
        navLink = <NavLink style={{marginTop: "12px", textAlign: "center"}} to={link}> {navigateText} </NavLink>
    } else {
        navLink = null;
    }
    return (
        <RootStyle title={`${title} | Smartcpaas`}>
            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{mb: 5}}>
                        <Typography variant="h4" gutterBottom>
                            {subtitle}
                        </Typography>
                        <Typography sx={{color: 'text.secondary'}}>Enter your details below.</Typography>
                    </Stack>
                    {formComponent}
                    {navLink}
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}
