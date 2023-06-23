import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Tabs, Tab } from '@mui/material';


const TabStyle = styled(Tab)(({ theme }) => ({
    color: theme.palette.secondary.main,
    '&:hover': {
        color: theme.palette.secondary.lightmost,
    },
}));

NavTabs.propTypes = {
    items: PropTypes.array.isRequired,
    handleTabChange: PropTypes.func.isRequired,
    tabValue: PropTypes.number.isRequired,
};

export default function NavTabs({ items, handleTabChange, tabValue }) {
    return (
        <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            textColor="secondary"
            indicatorColor="secondary"
            aria-label="nav tabs">
            {items.map(item => {
                return <TabStyle label={item.label} selected={tabValue === item.id} />
            })}
        </Tabs>
    );
}
