import PropTypes from 'prop-types';
import { Box } from '@mui/material';


TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
};

export default function TabPanel(props) {
    const { children, value, ...other } = props;

    return (
        <div
            role="tabpanel"
            id={`tabpanel-${value}`}
            aria-labelledby={`tab-${value}`}
            {...other}
        >
            <Box sx={{ p: 3, flexGrow: 1, mr: 5 }}>
                {children}
            </Box>
        </div>
    );
}

