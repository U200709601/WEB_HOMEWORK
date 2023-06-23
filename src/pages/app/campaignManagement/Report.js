import { useState, useRef } from 'react';
import { styled } from '@mui/system';
import { Box, Typography, ButtonBase, Stack } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ReportHead, ReportDateFilter } from 'src/components/reportHead';
import { BarChart } from 'src/components/charts';
import Campaign from 'src/pages/app/campaignManagement/Campaign';
import moment from 'moment';


const StyledTypography = styled(Typography)(({ theme }) => ({
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.secondary.lighter,
}));

const ITEMS = [
    { icon: CloseIcon, count: 0, label: "COMPLETED" },
    { icon: CloseIcon, count: 0, label: "SMS" },
    { icon: CloseIcon, count: 0, label: "VOICE" },
    { icon: CloseIcon, count: 354, label: "Today's Usage" },
];


export default function Report() {
    const [expand, setExpand] = useState(false);
    const usageTableContainerRef = useRef(null);
    const [dateRange, setDateRange] = useState([moment().subtract(1, "month"), moment()]);

    const handleExpandableContent = (event) => {
        setExpand(!expand);
    }

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
                    {expand ? <Campaign reportView={true} /> : null}
                    <BarChart yAxisTitle={"Usage"} data={[121, 12, 222, 125, 125, 220, 20]} categories={["a", "b", "c", "d", "e", "f", "g"]} />
                </Stack>
            </Box>
        </>
    );
}
