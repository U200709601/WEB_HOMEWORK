import PropTypes from 'prop-types';
// material
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import BaseButton from './BaseButton';
// ----------------------------------------------------------------------

AddNewButton.propTypes = {
    label: PropTypes.string,
    onClick: PropTypes.func,
    sx: PropTypes.object,
};

export default function AddNewButton({ label, onClick, sx }) {
    return (
        <Box sx={{ textAlign: "right", marginTop: "24px", }}>
            <BaseButton
                label={label}
                StartIcon={AddIcon}
                onClick={onClick}
                sx={sx}
            />
        </Box>
    );
}
