import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid, Select, TextField, MenuItem, FormControl, InputLabel, Stack, IconButton } from '@mui/material';
import EyeIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import AddNewButton from 'src/components/buttons/AddNewButton';
import BaseModal from 'src/components/BaseModal';
import { rowArrayToObject } from 'src/utils/Util';
import { DefaultPaginationData } from 'src/constants/index';
import { SmsTariffForm, DeleteSmsTariffForm } from './Forms';
import { TariffService, CommonService } from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';
import { fDateTime } from 'src/utils/formatTime';


const SearchButtonContainer = styled(Grid)(({ theme }) => ({
    [theme.breakpoints.up('md')]: {
        textAlign: "left",
    },
    [theme.breakpoints.down('md')]: {
        textAlign: "right",
    },
}));

const TABLE_HEAD = [
    { key: "id", label: "ID" },
    { key: "breakout", label: "Breakout" },
    { key: "country_name", label: "Country" },
    { key: "prefix", label: "Prefix" },
    { key: "rate", label: "Rate" },
    { key: "effective_start", label: "Effective Start" },
    { key: "action", label: "Actions" },
];

const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    breakout: { key: "breakout", index: 1 },
    country_name: { key: "country_name", index: 2 },
    prefix: { key: "prefix", index: 3 },
    rate: { key: "rate", index: 4 },
    effective_start: { key: "effectiveStart", index: 5 },
    effective_end: { key: "effectiveEnd", index: 6, noRender: true },
    country: { key: "country", index: 7, noRender: true },
};


export default function SmsTariff() {
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [countries, setCountries] = useState([]);
    const [filterCountry, setCountry] = useState("0");
    const [filterBreakout, setBreakout] = useState("");
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openAddSmsTariffModal, setAddSmsTariffModalStatus] = useState(false);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const fetchSmsTariffs = () => {
        const params = {
            breakout: filterBreakout ? filterBreakout : undefined,
            country: filterCountry !== "0" ? filterCountry : undefined,
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
        };
        setLoadingData(true);
        TariffService.listSmsTariffs(params)
            .then((response) => {
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
            })
            .catch((err) => {
                console.log(err);
            })
            .finally(() => {
                setLoadingData(false);
            })
    }

    useEffect(() => {
        fetchSmsTariffs();
        return () => {
            setData([]);
        }
    }, [paginationData]);


    useEffect(() => {
        CommonService.getCountries({})
            .then((response) => {
                let items = [];
                Object.entries(response.data).forEach(([key, value]) => {
                    Object.entries(value).forEach(([code, name]) => {
                        if (code === "null") {
                            items.push({code: "0", name: name});
                        } else {
                            items.push({code: code, name: name});
                        }
                    })
                })
                setCountries(items);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "effectiveStart") {
                formatted.push({
                    ...d,
                    value: fDateTime(+d.value * 1000),
                });
            } else if (d.key === "effectiveEnd") {
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

    const modalHandler = (modalType, index = undefined) => {
        if (modalType === "add") {
            setAddSmsTariffModalStatus(!openAddSmsTariffModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        return (
            <Stack direction="row" spacing={2}>
                <IconButton color="secondary" size="small" aria-label="edit-sms-tariff" onClick={() => modalHandler("edit", index)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="delete-sms-tariff" onClick={() => modalHandler("delete", index)}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        )
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseModal title="Add New Tariff" open={openAddSmsTariffModal} setOpen={setAddSmsTariffModalStatus} children={<SmsTariffForm successCallback={fetchSmsTariffs} formType="add" formData={{}} setModalStatus={setAddSmsTariffModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} countries={countries} />} />
            <BaseModal title="Edit Tariff" open={openEditModal} setOpen={setEditModalStatus} children={<SmsTariffForm formType="edit" successCallback={fetchSmsTariffs} formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} countries={countries} />} />
            <BaseModal title="Delete Tariff" open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteSmsTariffForm successCallback={fetchSmsTariffs} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={filterBreakout}
                                label="Breakout"
                                name="breakout"
                                margin="normal"
                                variant="outlined"
                                color="secondary"
                                onChange={event => { setBreakout(event.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <InputLabel id="country-label">Country</InputLabel>
                            <Select
                                label="Country"
                                labelId="country-label"
                                color="secondary"
                                value={filterCountry}
                                onChange={event => { setCountry(event.target.value) }}
                            >
                                {countries.map((country, idx) => {
                                    return <MenuItem key={country.code} value={country.code}>{country.name}</MenuItem>;
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchSmsTariffs() }} />
                    </SearchButtonContainer>
                </Grid>
            </TableFilterContainer>
            <AddNewButton label="Add New Tariff" onClick={() => modalHandler("add")} />
            <br />
            <BaseTable
                head={TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                actionItemPrep={getActionItems}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    );
}
