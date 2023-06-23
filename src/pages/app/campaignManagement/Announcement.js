import { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import { Grid, Select, TextField, FormControl, InputLabel, Stack, IconButton, Snackbar } from '@mui/material';
import EyeIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { BaseTable, TableFilterContainer } from 'src/components/table';
import SearchButton from 'src/components/buttons/SearchButton';
import AddNewButton from 'src/components/buttons/AddNewButton';
import BaseModal from 'src/components/BaseModal';
import { rowArrayToObject } from 'src/utils/Util';
import {
    getSelectOptions,
    getLabelByValue,
    CampaignAnnouncementTypes,
    DefaultPaginationData,
} from 'src/constants/index';
import { AnnouncementForm, DeleteAnnouncementForm } from './Forms';
import { CampaignManagementService } from 'src/api/services';
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
    { key: "name", label: "Announcement Name" },
    { key: "description", label: "Description" },
    { key: "type", label: "Type", align: "center" },
    { key: "createdDate", label: "Created Date" },
    { key: "updatedDate", label: "Updated Date" },
    { key: "action", label: "Actions" },
];

const TABLE_FIELD_MAPPING = {
    id: { key: "id", cellComponentType: "th", index: 0 },
    name: { key: "name", index: 1 },
    description: { key: "description", index: 2 },
    announcement_type: { key: "type", index: 3, align: "center" },
    created: { key: "createdDate", index: 4 },
    modified: { key: "updatedDate", index: 5 },
    tts_language: { key: "ttsLanguageId", index: 6, noRender: true },
    tts_content: { key: "ttsText", index: 7, noRender: true },
    announcement_file: { key: "announcementFile", index: 8, noRender: true },
    file_uuid: { key: "fileUUID", index: 9, noRender: true },
};


export default function Announcement() {
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [message, setMessage] = useState("");
    const [filterAnnouncement, setAnnouncement] = useState("");
    const [filterType, setType] = useState("0");
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openViewModal, setViewModalStatus] = useState(false);
    const [openAddAnnouncementModal, setAddAnnouncementModalStatus] = useState(false);
    const [data, setData] = useState([]);
    const [selectedRow, setSelectedRow] = useState({});
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);

    const fetchAnnouncements = () => {
        const params = {
            name: filterAnnouncement ? filterAnnouncement : undefined,
            announcement_type: filterType !== "0" ? filterType : undefined,
            page: paginationData.page + 1,
            page_size: paginationData.rowsPerPage,
        };
        setLoadingData(true);
        CampaignManagementService.listAnnouncements(params)
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
        fetchAnnouncements();
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
                    value: getLabelByValue(CampaignAnnouncementTypes, d.value.toString()),
                });
            } else if (d.key === "createdDate") {
                formatted.push({
                    ...d,
                    value: fDateTime(+d.value * 1000),
                });
            } else if (d.key === "updatedDate") {
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
            setAddAnnouncementModalStatus(!openAddAnnouncementModal);
        } else if (modalType === "edit") {
            setEditModalStatus(!openEditModal);
        } else if (modalType === "delete") {
            setDeleteModalStatus(!openDeleteModal);
        } else if (modalType === "view") {
            setViewModalStatus(!openViewModal)
        }

        if (index) { setSelectedRow(rowArrayToObject(data[index])) };
    }

    const getActionItems = (index) => {
        return (
            <Stack direction="row" spacing={2}>
                <IconButton color="secondary" size="small" aria-label="view-announcement" onClick={() => modalHandler("view", index)}>
                    <EyeIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="edit-announcement" onClick={() => modalHandler("edit", index)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="delete-announcement" onClick={() => modalHandler("delete", index)}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        )
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseModal title="Add New Announcement" open={openAddAnnouncementModal} setOpen={setAddAnnouncementModalStatus} children={<AnnouncementForm successCallback={fetchAnnouncements} formType="add" formData={{}} setModalStatus={setAddAnnouncementModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title="View Announcement" open={openViewModal} setOpen={setViewModalStatus} children={<AnnouncementForm formType="view" formData={selectedRow} setModalStatus={setViewModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title="Edit Announcement" open={openEditModal} setOpen={setEditModalStatus} children={<AnnouncementForm formType="edit" successCallback={fetchAnnouncements} formData={selectedRow} setModalStatus={setEditModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title="Delete Announcement" open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteAnnouncementForm successCallback={fetchAnnouncements} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <TableFilterContainer>
                <Grid sx={{ alignItems: "center" }} container spacing={4}>
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
                                {getSelectOptions(CampaignAnnouncementTypes)}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item md={3} xs={12}>
                        <FormControl fullWidth>
                            <TextField
                                value={filterAnnouncement}
                                label="Announcement Name"
                                name="announcementname"
                                margin="normal"
                                variant="outlined"
                                color="secondary"
                                onChange={event => { setAnnouncement(event.target.value) }}
                            />
                        </FormControl>
                    </Grid>
                    <SearchButtonContainer item md={2} xs={12}>
                        <SearchButton onClick={() => { fetchAnnouncements() }} />
                    </SearchButtonContainer>
                </Grid>
            </TableFilterContainer>
            <AddNewButton label="Add New Announcement" onClick={() => modalHandler("add")} />
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
