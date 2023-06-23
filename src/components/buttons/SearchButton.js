import PropTypes from 'prop-types';
// material
import BaseButton from './BaseButton';
import SearchIcon from '@mui/icons-material/Search';
// ----------------------------------------------------------------------
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

SearchButton.propTypes = {
    onClick: PropTypes.func,
    sx: PropTypes.object,
};

export default function SearchButton({ onClick, sx }) {
    const { t } = useTranslation();
    return (
        <BaseButton
            label={t("common.search")}
            onClick={onClick}
            StartIcon={SearchIcon}
            sx={sx}
        />
    );
}
