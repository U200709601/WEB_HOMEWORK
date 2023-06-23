import { useState, useRef, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Typography, ButtonBase, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReportHead, ReportDateFilter } from 'src/components/reportHead';
import { BarChart } from 'src/components/charts';
import { Service } from '.';
import { TwoFactorAuthenticationService } from 'src/api/services';
import { fDate } from 'src/utils/formatTime';
import moment from 'moment';


const StyledTypography = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.secondary.lighter,
}));

const ITEMS = [
    { icon: CloseIcon, count: 0, label: "OTP" },
    { icon: CloseIcon, count: 0, label: "SMS" },
    { icon: CloseIcon, count: 0, label: "VOICE" },
    { icon: CloseIcon, count: 354, label: "Today's Usage" },
];


export default function Report() {
    const [expand, setExpand] = useState(false);
    const usageTableContainerRef = useRef(null);
    const [dateRange, setDateRange] = useState([moment().subtract(1, "month"), moment()]);
    const [accountReportData, setAccountReportData] = useState([]);
    const [serviceReportData, setServiceReportData] = useState([]);

    const fetchAccountReportData = () => {
        const params = {
            date_after: fDate(dateRange[0]),
            date_before: fDate(dateRange[1]),
        };
        TwoFactorAuthenticationService.getTwoFAReport(params)
            .then((response) => {
                console.log(response);
            })
    }

    const handleExpandableContent = (event) => {
        setExpand(!expand);
    }

    const getDetailTable = () => {
        return (
            <Service reportView={true} dateRange={dateRange} />
        )
    }

    useEffect(() => {
        fetchAccountReportData();
        return () => {
            setAccountReportData([]);
        }
    }, [])

    return (
        <>
            <ReportHead
                item1={ITEMS[0]}
                item2={ITEMS[1]}
                item3={ITEMS[2]}
                totalUsage={ITEMS[3]}
            />
            <ReportDateFilter dateRange={dateRange} setDateRange={setDateRange} />
            <Box sx={{ height: 180 }} ref={usageTableContainerRef}>
                <Stack
                    sx={{ mt: 2, mb: 1, width: "100%" }}
                    direction="column"
                    justifyContent="space-evenly"
                    spacing={1}
                >
                    <ButtonBase onClick={handleExpandableContent} >
                        <StyledTypography variant="body1">{`View all usage (${expand ? "-" : "+"})`}</StyledTypography>
                    </ButtonBase>
                    {expand ? getDetailTable() : null}
                    <BarChart yAxisTitle={"Usage"} data={[10, 15, 20, 15, 15, 20, 25]} categories={["a", "b", "c", "d", "e", "f", "g"]} />
                </Stack>
            </Box>
        </>
    );
}
