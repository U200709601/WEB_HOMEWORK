import { useRef, useState } from 'react';
import i18n from 'i18next';
// material
import { alpha } from '@mui/material/styles';
import { Box, MenuItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
// components
import MenuPopover from '../../components/MenuPopover';

// ----------------------------------------------------------------------

const LANGUAGES = [
  {
    value: 'en-US',
    label: 'English',
    icon: '/static/icons/ic_flag_en.svg'
  },
  {
    value: 'de-DE',
    label: 'German',
    icon: '/static/icons/ic_flag_de.svg'
  },
  {
    value: 'it-IT',
    label: 'Italian',
    icon: '/static/icons/ic_flag_it.svg'
  },
  {
    value: 'fr-FR',
    label: 'French',
    icon: '/static/icons/ic_flag_fr.svg'
  }
];

// ----------------------------------------------------------------------

export default function LanguagePopover() {
  const anchorRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLangChange = (lang) => {
    i18n.changeLanguage(lang);
    handleClose();
  };

  const getCurrentLangData = () => {
    let lang;
    LANGUAGES.map((option) => {
      if (option.value === i18n.language) {
        lang = option;
      }
    });
    return lang;
  };

  const currentLanguage = getCurrentLangData();

  return (
    <>
      <IconButton
        ref={anchorRef}
        onClick={handleOpen}
        sx={{
          padding: 0,
          width: 44,
          height: 44,
          ...(open && {
            bgcolor: (theme) => alpha(theme.palette.primary.main, theme.palette.action.focusOpacity)
          })
        }}
      >
        <img src={currentLanguage.icon} alt={currentLanguage.label} />
      </IconButton>

      <MenuPopover open={open} onClose={handleClose} anchorEl={anchorRef.current}>
        <Box sx={{ py: 1 }}>
          {LANGUAGES.map((option) => (
            <MenuItem
              key={option.value}
              selected={option.value === i18n.language}
              onClick={() => handleLangChange(option.value)}
              sx={{ py: 1, px: 2.5 }}
            >
              <ListItemIcon>
                <Box component="img" alt={option.label} src={option.icon} />
              </ListItemIcon>
              <ListItemText primaryTypographyProps={{ variant: 'body2' }}>
                {option.label}
              </ListItemText>
            </MenuItem>
          ))}
        </Box>
      </MenuPopover>
    </>
  );
}
