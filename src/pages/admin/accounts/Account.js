import {useEffect, useState} from 'react';
import {
    AccountTypes,
    AccountChannelTypes,
    AccountStatuses,
    DefaultPaginationData,
    getLabelByValue
} from 'src/constants/index';
import { useStore } from 'src/store/Store';
import {AccountService} from 'src/api/services';
import {BaseTable} from "../../../components/table";
import {rowArrayToObject} from "../../../utils/Util";
import {IconButton, Stack} from "@mui/material";
import EyeIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import BaseModal from "../../../components/BaseModal";
import {AccountForm} from "../../admin/accounts/Forms";
import BaseSnackbar from "../../../components/BaseSnackbar";
import DeleteAccountForm from "../../admin/accounts/Forms/DeleteAccountForm";
import {fDateTime} from "../../../utils/formatTime";
import {CampaignForm} from "../../app/campaignManagement/Forms";


const TABLE_HEAD = [
    {key: "id", label: "ID"},
    {key: "account_type", label: "Engine Name"},
    {key: "channel_type", label: "Channel Type"},
    {key: "status", label: "Status", align: "center"},
    {key: "created", label: "Created Date", align: "center"},
];

const TABLE_FIELD_MAPPING = {
    id: {key: "id", cellComponentType: "th", index: 0},
    account_type: {key: "account_type", index: 1},
    channel_type: {key: "channel_type", index: 2},
    status: {key: "status", index: 3, align: "center"},
    created: {key: "created", index: 4, align: "center"},
};


export default function Account({reportView = false}) {
    const [store, dispatch] = useStore();
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedRow, setSelectedRow] = useState({});
    const [openSnackbar, setSnackbarStatus] = useState(false);
    const [openEditModal, setEditModalStatus] = useState(false);
    const [openDeleteModal, setDeleteModalStatus] = useState(false);
    const [openViewModal, setViewModalStatus] = useState(false);


    const fetchAccounts = () => {
        setLoadingData(true);
        AccountService.listOrganizationAccounts(store.user.organization_id)
            .then((response) => {
                let items = [];
                setTotalCount(response.data.count);
                // console.log(response.data);
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
        fetchAccounts();
        return () => {
            setData([]);
        }
    }, [paginationData]);

    const formatRowData = (rowData) => {
        let formatted = [];
        rowData.map((d, idx) => {
            if (d.key === "account_type") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(AccountTypes, d.value.toString()),
                });
            } else if (d.key === "channel_type") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(AccountChannelTypes, d.value.toString()),
                });
            } else if (d.key === "status") {
                formatted.push({
                    ...d,
                    value: getLabelByValue(AccountStatuses, d.value.toString()),
                });
            } else if (d.key === "created") {
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
        if (modalType === "view") {
            setViewModalStatus(!openViewModal)
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
                <IconButton color="secondary" size="small" aria-label="view-account" onClick={() => modalHandler("view", index)}>
                    <EyeIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="edit-account" onClick={() => modalHandler("edit", index)}>
                    <EditIcon />
                </IconButton>
                <IconButton color="secondary" size="small" aria-label="delete-account" onClick={() => modalHandler("delete", index)}>
                    <DeleteIcon />
                </IconButton>
            </Stack>
        )
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseModal title="View Engine" open={openViewModal} setOpen={setViewModalStatus} children={<AccountForm formType="view" formData={selectedRow} setModalStatus={setViewModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title="Edit Engine" open={openEditModal} setOpen={setViewModalStatus} children={<AccountForm formType="edit" formData={selectedRow} setModalStatus={setViewModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseModal title="Delete Engine" open={openDeleteModal} setOpen={setDeleteModalStatus} children={<DeleteAccountForm successCallback={fetchAccounts} formData={selectedRow} setModalStatus={setDeleteModalStatus} setSnackbarStatus={setSnackbarStatus} setMessage={setMessage} />} />
            <BaseTable
                head={!reportView ? [...TABLE_HEAD, { key: "action", label: "Actions" }] : TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                actionItemPrep={!reportView ? getActionItems : null}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    )


}