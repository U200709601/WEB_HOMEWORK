import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid, Select, TextField, FormControl, InputLabel, Stack, IconButton, Snackbar } from '@mui/material';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import AddNewButton from 'src/components/buttons/AddNewButton';
import BaseModal from 'src/components/BaseModal';
import { ServiceForm, DeleteServiceForm } from './Forms';
import { rowArrayToObject } from 'src/utils/Util';
import {
    getSelectOptions,
    getLabelByValue,
    TwoFAServiceCodeLengths,
    TwoFAServiceStatuses,
    TwoFAServiceTypes,
    DefaultPaginationData,
} from 'src/constants/index';
import { fDate } from 'src/utils/formatTime';
import { TwoFactorAuthenticationService } from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';


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
    { key: "serviceId", label: "Service ID" },
    { key: "name", label: "Service" },
    { key: "type", label: "Type", align: "center" },
    { key: "codeLength", label: "Code Length", align: "center" },
    { key: "status", label: "Status", align: "center" },
];

const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    uid: { key: "serviceId", index: 1 },
    name: { key: "name", index: 2 },
    type: { key: "type", index: 3, align: "center" },
    code_length: { key: "codeLength", index: 4, align: "center" },
    status: { key: "status", index: 5, align: "center" },
    default_guard_time: { key: "guardTime", noRender: true, index: 6 },
    default_timeout: { key: "timeout", noRender: true, index: 7 },
    default_body: { key: "body", noRender: true, index: 8 },
    tts_language: { key: "ttsLanguageId", noRender: true, index: 9 },
};

export default function Service({ reportView = false, dateRange }) {
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [filterService, setService] = useState("");
    const [filterType, setType] = useState("0");
    const [filterStatus, setStatus] = useState("0");
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openTestModal, setTestModalStatus] = useState(false);
    const [openAddServiceModal, setAddServiceModalStatus] = useState(false);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const fetchServices = () => {
        const params = {
            name: filterService ? filterService : undefined,
            type: filterType !== "0" ? filterType : undefined,
            status: filterStatus !== "0" ? filterStatus : undefined,
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
            date_after: dateRange ? fDate(dateRange[0]) : undefined,
            date_before: dateRange ? fDate(dateRange[1]) : undefined,
        };
        setLoadingData(true);
        TwoFactorAuthenticationService.listTwoFAServices(params)
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
        fetchServices();
        return () => {
            setData([]);
        }
    }, [paginationData, dateRange]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "type") {
                formatted.push({
                    ...d,
                    key: d.key,
                    value: getLabelByValue(TwoFAServiceTypes, d.value.toString()),
                });
            } else if (d.key === "status") {
                formatted.push({
                    ...d,
                    key: d.key,
                    value: getLabelByValue(TwoFAServiceStatuses, d.value.toString()),
                });
            } else if (d.key === "codeLength") {
                formatted.push({
                    ...d,
                    key: d.key,
                    value: getLabelByValue(TwoFAServiceCodeLengths, d.value.toString()),
                });
            } else {
                formatted.push(d);
            }
        })
        return formatted;
    }

    const modalHandler = (modalType, index = undefined) => {
        if (modalType === "add") {
            setAddServiceModalStatus(!openAddServiceModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        } else if (modalType === "test") {
            setTestModalStatus(!openTestModal)
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        return (
            <Stack direction="row" spacing={2}>
                <IconButton color="secondary" size="small" aria-label="edit-service" onClick={() => modalHandler("edit", index)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="delete-service" onClick={() => modalHandler("delete", index)}>
                    <DeleteIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="test-service" onClick={() => modalHandler("test", index)}>
                    <BuildIcon />
                </IconButton>
            </Stack>
        )
    }

    return (
        <>
            {!reportView ? <><BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
                <BaseModal title="Edit Service" open={openEditModal} setOpen={setEditModalStatus} children={<ServiceForm successCallback={fetchServices} formType="edit" formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <BaseModal title="Delete Service" open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteServiceForm successCallback={fetchServices} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <BaseModal title="Test Service" open={openTestModal} setOpen={setTestModalStatus} children={<ServiceForm formType="test" formData={selectedRow} setModalStatus={setTestModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <BaseModal title="Add New Service" open={openAddServiceModal} setOpen={setAddServiceModalStatus} children={<ServiceForm successCallback={fetchServices} formType="add" formData={{}} setModalStatus={setAddServiceModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <TableFilterContainer>
                    <Grid sx={{ alignItems: "center" }} container spacing={4}>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    value={filterService}
                                    label="Service"
                                    name="service"
                                    margin="normal"
                                    variant="outlined"
                                    color="secondary"
                                    onChange={event => { setService(event.target.value) }}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="filter-type-label">Type</InputLabel>
                                <Select
                                    label="Type"
                                    labelId="filter-type-label"
                                    name="type"
                                    color="secondary"
                                    value={filterType}
                                    onChange={event => { setType(event.target.value) }}
                                >
                                    {getSelectOptions(TwoFAServiceTypes)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <InputLabel id="filter-status-label">Status</InputLabel>
                                <Select
                                    label="Status"
                                    labelId="filter-status-label"
                                    name="status"
                                    color="secondary"
                                    value={filterStatus}
                                    onChange={event => { setStatus(event.target.value) }}
                                >
                                    {getSelectOptions(TwoFAServiceStatuses)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <SearchButtonContainer item md={3} xs={12}>
                            <SearchButton onClick={() => { fetchServices() }} />
                        </SearchButtonContainer>
                    </Grid>
                </TableFilterContainer>
                <AddNewButton label="Add New Service" onClick={() => modalHandler("add")} />
                <br /></> : null}
            <BaseTable
                head={!reportView ? [...TABLE_HEAD, { key: "action", label: "Actions" }] : TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                actionItemPrep={!reportView ? getActionItems : null}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    );
}
