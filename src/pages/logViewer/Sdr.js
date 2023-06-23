import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Grid, TextField } from '@mui/material';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import { DefaultPaginationData } from 'src/constants/index';
import SearchButton from 'src/components/buttons/SearchButton';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from 'moment';
import { fDate, fDateTime } from 'src/utils/formatTime';
import { useTranslation } from 'react-i18next';


const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));

const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    created: { key: "createdDate", index: 1 },
    from_number: { key: "fromNumber", index: 2 },
    to_number: { key: "toNumber", index: 3 },
    status: { key: "status", index: 4, align: "center" },
};

export default function Sdr({ sdrType }) {
    const [dateRange, setDateRange] = useState([moment().subtract(1, "month"), moment()]);
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const { t } = useTranslation();

    const TABLE_HEAD = [
        { key: "id", label: t("common.id") },
        { key: "createdDate", label: t("common.createdDate") },
        { key: "fromNumber", label: t("common.fromNumber") },
        { key: "toNumber", label: t("common.toNumber") },
        { key: "status", label: t("common.status"), align: "center" },
    ];

    const onDateChange = (values) => {
        setDateRange(values);
    }

    const fetchSdr = () => {
        const params = {
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
            date_after: dateRange ? fDate(dateRange[0]) : undefined,
            date_before: dateRange ? fDate(dateRange[1]) : undefined,
        };
        setLoadingData(true);
        setTimeout(() => {
            // fetch sdrs
            setLoadingData(false);
        }, 2000);
    }

    useEffect(() => {
        fetchSdr();
        return () => {
            setData([]);
        }
    }, [paginationData, sdrType]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "createdDate") {
                formatted.push({
                    ...d,
                    value: fDateTime(+d.value * 1000),
                });
            } else {
                formatted.push(d);
            }
        })
        return formatted;
    }

    return (
        <>
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={3} xs={12}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DateRangePicker
                                startText={t("common.dateRange.start")}
                                endText={t("common.dateRange.end")}
                                value={dateRange}
                                onChange={onDateChange}
                                renderInput={(startProps, endProps) => (
                                    <>
                                        <TextField sx={{ marginTop: "0" }} {...startProps} color="secondary" variant="filled" />
                                        <Box sx={{ mx: 2 }}> {t("common.dateRange.to")} </Box>
                                        <TextField sx={{ marginTop: "0" }} {...endProps} color="secondary" variant="filled" />
                                    </>
                                )}
                            />
                        </LocalizationProvider>
                    </Grid>
                    <SearchButtonContainer item md={3} xs={12}>
                        <SearchButton onClick={() => { fetchSdr() }} />
                    </SearchButtonContainer>
                </Grid>
            </TableFilterContainer>
            <br />
            <BaseTable
                head={TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    );
}
