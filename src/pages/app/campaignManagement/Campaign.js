import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Box, Grid, Select, TextField, FormControl, InputLabel, Stack, IconButton, Snackbar } from '@mui/material';
import EyeIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloneIcon from '@mui/icons-material/ContentCopy';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import AddNewButton from 'src/components/buttons/AddNewButton';
import BaseModal from 'src/components/BaseModal';
import { rowArrayToObject } from 'src/utils/Util';
import {
    getSelectOptions,
    getLabelByValue,
    CampaignChannelTypes,
    CampaignStatuses,
    DefaultPaginationData
} from 'src/constants/index';
import { fDate, fDateTime } from 'src/utils/formatTime';
import { CampaignForm, CloneCampaignForm } from './Forms';
import { LocalizationProvider, DateRangePicker } from '@mui/lab';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import moment from 'moment';
import { CampaignManagementService } from 'src/api/services';
import BaseSnackbar from 'src/components/BaseSnackbar';
import DeleteCampaignForm from './Forms/DeleteCampaignForm';
import AdvancedCampaignDialog from './Forms/AdvancedCampaignDialog';


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
    { key: "name", label: "Campaign Name" },
    { key: "type", label: "Type", align: "center" },
    { key: "startDate", label: "Start Date" },
    { key: "createdDate", label: "Created Date" },
    { key: "status", label: "Status", align: "center" },
];


const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    name: { key: "name", index: 1 },
    channel_type: { key: "type", index: 2, align: "center" },
    scheduled_at: { key: "startDate", index: 3 },
    created: { key: "createdDate", index: 4 },
    campaign_status: { key: "status", index: 5, align: "center" },
    message_body: { key: "messageBody", index: 6, noRender: true },
    encoding: { key: "encoding", index: 7, noRender: true },
    dial_timeout: { key: "dialTimeout", index: 8, noRender: true },
    to_number_list: { key: "toNumbers", index: 9, noRender: true },
    from_number_list: { key: "fromNumbers", index: 10, noRender: true },
    callback_url: { key: "callbackUrl", index: 11, noRender: true },
    announcement: { key: "announcementId", index: 12, noRender: true },
};


export default function Campaign({ reportView = false }) {
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [dateRange, setDateRange] = useState([moment().subtract(1, "month"), moment()]);
    const [filterCampaign, setCampaign] = useState("");
    const [filterType, setType] = useState("0");
    const [filterStatus, setStatus] = useState("0");
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openViewModal, setViewModalStatus] = useState(false);
    const [openAddCampaignModal, setAddCampaignModalStatus] = useState(false);
    const [openCloneCampaignModal, setCloneCampaignModalStatus] = useState(false);
    const [openIsProgrammableDialog, setIsProgrammableDialogStatus] = useState(false);
    const [isProgrammable, setIsProgrammable] = useState(false);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const onDateChange = (values) => {
        setDateRange(values);
    }

    const handleNewCampaign = () => {
        setIsProgrammableDialogStatus(true);
        modalHandler("add");
    }

    const fetchCampaigns = () => {
        const params = {
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
            status: filterStatus !== "0" ? filterStatus : undefined,
            channel_type: filterType !== "0" ? filterType : undefined,
            name: filterCampaign ? filterCampaign : undefined,
            date_after: fDate(dateRange[0]),
            date_before: fDate(dateRange[1]),
        };
        setLoadingData(true);
        CampaignManagementService.listCampaigns(params)
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
        fetchCampaigns();
        return () => {
            setData([]);
        }
    }, [paginationData]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "type") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(CampaignChannelTypes, d.value.toString()),
                });
            } else if (d.key === "status") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(CampaignStatuses, d.value.toString()),
                });
            } else if (d.key === "startDate") {
                formatted.push({
                    ...d,
                    value: fDateTime(+d.value * 1000),
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

    const modalHandler = (modalType, index = undefined) => {
        if (modalType === "add") {
            setAddCampaignModalStatus(!openAddCampaignModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        } else if (modalType === "view") {
            setViewModalStatus(!openViewModal)
        } else if (modalType === "clone") {
            setCloneCampaignModalStatus(!openCloneCampaignModal);
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        let renderEditDeleteIcons = false;
        if (data[index]) {
            data[index].map((d, idx) => {
                if (d.key === "status" && d.value === 3) {
                    renderEditDeleteIcons = true;
                }
            })
        }
        return (
            <Stack direction="row" spacing={2}>
                <IconButton color="secondary" size="small" aria-label="view-campaign" onClick={() => modalHandler("view", index)}>
                    <EyeIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="clone-campaign" onClick={() => modalHandler("clone", index)}>
                    <CloneIcon />
                </IconButton>
                {renderEditDeleteIcons ?
                    <>
                        <IconButton color="secondary" size="small" aria-label="edit-announcement" onClick={() => modalHandler("edit", index)}>
                            <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" size="small" aria-label="delete-announcement" onClick={() => modalHandler("delete", index)}>
                            <DeleteIcon />
                        </IconButton>
                    </>
                    : null}
            </Stack>
        )
    }

    return (
        <>
            {!reportView ? <><BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
                <BaseModal title="Edit Campaign" open={openEditModal} setOpen={setEditModalStatus} children={<CampaignForm formType="edit" successCallback={fetchCampaigns} formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} sx={{ width: 600 }} />
                <BaseModal title="Delete Campaign" open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteCampaignForm successCallback={fetchCampaigns} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <BaseModal title="View Campaign" open={openViewModal} setOpen={setViewModalStatus} />
                <BaseModal title="Add New Campaign" open={openAddCampaignModal} setOpen={setAddCampaignModalStatus} children={<CampaignForm formType="add" successCallback={fetchCampaigns} formData={{}} setModalStatus={setAddCampaignModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} isProgrammable={isProgrammable} />} sx={{ width: 600 }} />
                <BaseModal title="Clone Campaign" open={openCloneCampaignModal} setOpen={setCloneCampaignModalStatus} children={<CloneCampaignForm successCallback={fetchCampaigns} formData={selectedRow} setModalStatus={setCloneCampaignModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
                <AdvancedCampaignDialog open={openIsProgrammableDialog} setOpen={setIsProgrammableDialogStatus} setIsProgrammable={setIsProgrammable} />
                <TableFilterContainer>
                    <Grid sx={{ alignItems: "center" }} container spacing={4}>
                        <Grid item md={3} xs={12}>
                            <LocalizationProvider dateAdapter={AdapterDateFns}>
                                <DateRangePicker
                                    startText="Start"
                                    endText="End"
                                    value={dateRange}
                                    onChange={onDateChange}
                                    renderInput={(startProps, endProps) => (
                                        <>
                                            <TextField sx={{ marginTop: "0" }} {...startProps} color="secondary" variant="filled" />
                                            <Box sx={{ mx: 2 }}> to </Box>
                                            <TextField sx={{ marginTop: "0" }} {...endProps} color="secondary" variant="filled" />
                                        </>
                                    )}
                                />
                            </LocalizationProvider>
                        </Grid>
                        <Grid item md={2} xs={12}>
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
                                    {getSelectOptions(CampaignChannelTypes)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={2} xs={12}>
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
                                    {getSelectOptions(CampaignStatuses)}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item md={3} xs={12}>
                            <FormControl fullWidth>
                                <TextField
                                    value={filterCampaign}
                                    label="Campaign Name"
                                    name="campaignname"
                                    margin="normal"
                                    variant="outlined"
                                    color="secondary"
                                    onChange={event => { setCampaign(event.target.value) }}
                                />
                            </FormControl>
                        </Grid>
                        <SearchButtonContainer item md={2} xs={12}>
                            <SearchButton onClick={() => { fetchCampaigns() }} />
                        </SearchButtonContainer>
                    </Grid>
                </TableFilterContainer>
                <AddNewButton label="Add New Campaign" onClick={() => handleNewCampaign()} />
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
