import PropTypes from 'prop-types';
// material
import { styled } from '@mui/system';
import { Modal, Box, Typography } from '@mui/material';
// ----------------------------------------------------------------------



const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    backgroundColor: theme.palette.common.white,
    boxShadow: 24,
    p: 4,
    borderRadius: 10,
}));

const ModalHeaderStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.common.black,
    backgroundColor: theme.palette.secondary.main,
    fontSize: "24px",
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: 10,
}));

const ModalContentStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.common.black,
    backgroundColor: theme.palette.common.white,
    fontSize: "16px",
    flexGrow: 1,
    alignItems: 'center',
    borderRadius: 10,
}));


BaseModal.propTypes = {
    title: PropTypes.string,
    open: PropTypes.bool,
    setOpen: PropTypes.func,
    children: PropTypes.node,
};

export default function BaseModal({ title, open, setOpen, children, sx }) {
    const handleClose = () => setOpen(false);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="base-modal-title"
            aria-describedby="base-modal-description"
        >
            <ModalContainer sx={sx}>
                <ModalHeaderStyle>
                    <Typography id="base-modal-title" variant="h6" component="h2">
                        {title}
                    </Typography>
                </ModalHeaderStyle>
                <ModalContentStyle>
                    <Typography id="base-modal-content" variant="p" >
                        {children ? children : "Modal Content Component"}
                    </Typography>
                </ModalContentStyle>
            </ModalContainer>
        </Modal>
    );
}
