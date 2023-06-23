// ----------------------------------------------------------------------

export default function Select(theme) {
    return {
        MuiSelect: {
            styleOverrides: {
                select: {
                    color: theme.palette.secondary.main,
                    minWidth: 'auto',
                    marginTop: theme.spacing(1, 1),
                    borderColor: "red"
                }
            }
        },
    };
}
