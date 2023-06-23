// ----------------------------------------------------------------------

export default function InputLabel(theme) {
    return {
        MuiInputLabel: {
            styleOverrides: {
                root: {
                    color: theme.palette.secondary.dark,
                }
            }
        },
    };
}
