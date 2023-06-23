import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Box } from '@mui/material';


const BoxStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.common.black,
    backgroundColor: theme.palette.primary.light,
    width: "100%",
    flexGrow: 1,
    borderRadius: 10,
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'flex-start',
    overflow: 'hidden',
}));

TableFilterContainer.propTypes = {
    children: PropTypes.node.isRequired,
};


export default function TableFilterContainer({ children }) {
    return (
        <BoxStyle>
            {children}
        </BoxStyle>
    );
}
