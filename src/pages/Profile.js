// material
import { styled } from '@mui/material/styles';
import { Grid, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { ProfileDetailsForm, ChangePasswordForm } from '../components/profile';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const StyledContainer = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
    padding: theme.spacing(4, 4),
    margin: "1px",
    borderRadius: 10,
}));

const StyledProfileGrid = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(4, 4),
    borderRadius: 10,
    [theme.breakpoints.up('md')]: {
        marginLeft: "-10px",
        marginRight: "10px",
    },
    [theme.breakpoints.down('md')]: {
        marginBottom: "10px",
    },
}));

const StyledPasswordGrid = styled(Grid)(({ theme }) => ({
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(4, 4),
    borderRadius: 10,
    [theme.breakpoints.up('md')]: {
        marginLeft: "10px",
        marginRight: "-10px",
    },
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
    color: theme.palette.secondary.main,
    fontWeight: "bold",
    marginBottom: "4px"
}));

const TitleTypographyStyle = styled(Typography)(({ theme }) => ({
    marginTop: "-24px",
    marginBottom: "12px",
    color: theme.palette.secondary.lightmost,
}));


// ----------------------------------------------------------------------

export default function Profile() {
    return (
        <>
            <TitleTypographyStyle sx={{ ml: 2 }} variant="h4">Profile</TitleTypographyStyle>
            <RootStyle title="Profile | Smartcpaas">
                <StyledContainer container spacing={4}>
                    <StyledProfileGrid sx={{ mr: 5 }} item xs={12} md={6}>
                        <StyledTypography variant="h4">Profile Details</StyledTypography>
                        <ProfileDetailsForm />
                    </StyledProfileGrid>
                    <StyledPasswordGrid sx={{ mr: 5 }} item xs={12} md={6}>
                        <StyledTypography variant="h4">Change Password</StyledTypography>
                        <ChangePasswordForm />
                    </StyledPasswordGrid>
                </StyledContainer>
            </RootStyle>
        </>
    );
}
