import PropTypes from 'prop-types';
import { styled } from '@mui/system';
import { Box, TextField } from '@mui/material';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';


const BoxStyle = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2, 2),
    textAlign: 'center',
    color: theme.palette.common.black,
    backgroundColor: theme.palette.secondary.main,
    width: "100%",
    flexGrow: 1,
    borderRadius: 10,
    flexDirection: { xs: 'column', md: 'row' },
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: "10px"
}));

ReportDateFilter.propTypes = {
    setDateRange: PropTypes.func.isRequired,
    dateRange: PropTypes.array.isRequired,
};


export default function ReportDateFilter({ dateRange, setDateRange }) {
    return (
        <BoxStyle>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateRangePicker
                    startText="Start"
                    endText="End"
                    value={dateRange}
                    onChange={(values) => setDateRange(values)}
                    renderInput={(startProps, endProps) => (
                        <>
                            <TextField {...startProps} variant="filled" />
                            <Box sx={{ mx: 2 }}> to </Box>
                            <TextField {...endProps} variant="filled" />
                        </>
                    )}
                />
            </LocalizationProvider>
        </BoxStyle>
    );
}
