import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Grid, Select, TextField, FormControl, InputLabel } from '@mui/material';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import { getSelectOptions, getLabelByValue, ProgrammableSmsStatuses, DefaultPaginationData } from 'src/constants/index';
import SearchButton from 'src/components/buttons/SearchButton';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from 'moment';
import { ProgrammableSmsService } from 'src/api/services';
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

const DateRangeInputField = styled(TextField)(({ theme }) => ({
    color: theme.palette.secondary.main,
}));

const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    created: { key: "createdDate", index: 1 },
    from_number: { key: "fromNumber", index: 2 },
    to_number: { key: "toNumber", index: 3 },
    sent_status: { key: "status", index: 4, align: "center" },
};

export default function ViewSms() {
    const [dateRange, setDateRange] = useState([moment().subtract(1, "month"), moment()]);
    const [filterStatus, setStatus] = useState("0");
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

    const fetchSms = () => {
        const params = {
            sent_status: filterStatus !== "0" ? filterStatus : undefined,
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
            date_after: dateRange ? fDate(dateRange[0]) : undefined,
            date_before: dateRange ? fDate(dateRange[1]) : undefined,
        };
        setLoadingData(true);
        ProgrammableSmsService.listSms(params)
            .then((response) => {
                if (response.status === 200) {
                    let items = [];
                    setTotalCount(response.data.count);
                    for (const idx in response.data.results) {
                        let item = new Array(TABLE_HEAD.length - 1).fill({});
                        Object.entries(response.data.results[idx]).forEach(([key, value]) => {
                            if (key in TABLE_FIELD_MAPPING) {
                                item[TABLE_FIELD_MAPPING[key].index] = {
                                    ...TABLE_FIELD_MAPPING[key],
                                    value: value,
                                };
                            }
                        });
                        items.push(item);
                    }
                    setData(items);
                }
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoadingData(false);
            })
    }

    useEffect(() => {
        fetchSms();
        return () => {
            setData([]);
        }
    }, [paginationData]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "status") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(ProgrammableSmsStatuses, d.value.toString()),
                });
            } else if (d.key === "createdDate") {
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
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="filter-status-label">{t("common.status")}</InputLabel>
                            <Select
                                label="Status"
                                labelId="filter-status-label"
                                name="status"
                                color="secondary"
                                value={filterStatus}
                                onChange={event => { setStatus(event.target.value) }}
                            >
                                {getSelectOptions(ProgrammableSmsStatuses)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={3} xs={12}>
                        <SearchButton onClick={() => { fetchSms() }} />
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
