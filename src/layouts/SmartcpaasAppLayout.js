import PropTypes from 'prop-types';
import { useState } from 'react';
// material
import { styled } from '@mui/material/styles';
import { Container, Typography, Box } from '@mui/material';
// components
import Page from '../components/Page';
import { TabGroup, TabPanel } from 'src/components/navTabs';

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        display: 'flex'
    }
}));

const TitleTypographyStyle = styled(Typography)(({ theme }) => ({
    marginBottom: 1.5,
    color: theme.palette.secondary.lightmost,
}));

// ----------------------------------------------------------------------

const tabObjectPropType = PropTypes.exact({
    id: PropTypes.number,  // starting from 0
    label: PropTypes.string,
    component: PropTypes.node
});

SmartcpaasAppLayout.propTypes = {
    tabs: PropTypes.arrayOf(tabObjectPropType).isRequired,
    title: PropTypes.string.isRequired,
};


export default function SmartcpaasAppLayout({ tabs, title }) {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event, newTabValue) => {
        setTabValue(newTabValue);
    }

    return (
        <RootStyle title={`${title} | Smartcpaas`}>
            <Box sx={{ ml: 2, width: "100%" }}>
                <TitleTypographyStyle sx={{ mt: -3, mb: 1.5 }} variant="h4">{`${title} - ${tabs[tabValue].label}`}</TitleTypographyStyle>
                <TabGroup items={tabs} handleTabChange={handleTabChange} tabValue={tabValue} />
                <TabPanel value={tabValue}>
                    {typeof tabs[tabValue].component === "string" ? <TitleTypographyStyle>{tabs[tabValue].component}</TitleTypographyStyle> : tabs[tabValue].component}
                </TabPanel>
            </Box>
        </RootStyle>
    );
}
