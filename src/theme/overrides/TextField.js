// ----------------------------------------------------------------------

export default function TextField(theme) {
    return {
        MuiTextField: {
            styleOverrides: {
                root: {
                    "& .MuiOutlinedInput-input": {
                        color: theme.palette.secondary.dark
                    },
                    marginTop: "8px",
                }
            }
        },
    };
}
