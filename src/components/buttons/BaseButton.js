import PropTypes from 'prop-types';
// material
import { Button } from '@mui/material';
import palette from 'src/theme/palette';
// ----------------------------------------------------------------------

BaseButton.propTypes = {
    label: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    StartIcon: PropTypes.node,
    EndIcon: PropTypes.node,
    sx: PropTypes.object,
    color: PropTypes.string,
    props: PropTypes.object,
};

export default function BaseButton({ label, onClick, StartIcon, EndIcon, sx, color = "secondary", props = {} }) {
    const textColor = color === "secondary" ? palette.secondary.contrastText : palette.primary.contrastText;

    return (
        <Button
            variant="contained"
            color={color}
            onClick={onClick ? onClick : null}
            sx={{ color: textColor, ...sx }}
            startIcon={StartIcon ? <StartIcon /> : null}
            endIcon={EndIcon ? <EndIcon /> : null}
            {...props}
        >{label}
        </Button>
    );
}
