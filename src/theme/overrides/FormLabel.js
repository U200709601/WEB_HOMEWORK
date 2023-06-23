// ----------------------------------------------------------------------

export default function FormLabel(theme) {
    return {
        MuiFormLabel: {
            styleOverrides: {
                root: {
                    color: theme.palette.secondary.dark,
                },
            }
        },
    };
}
