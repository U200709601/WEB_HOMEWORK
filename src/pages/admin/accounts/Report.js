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
import BaseSnackbar from "../../../components/BaseSnackbar";


const TABLE_HEAD = [
    {key: "id", label: "ID"},
    {key: "account_type", label: "Engine Name"},
    {key: "voice_total", label: "Voice Usage"},
    {key: "sms_total", label: "Sms Usage"},
];

const TABLE_FIELD_MAPPING = {
    id: {key: "id", cellComponentType: "th", index: 0},
    account_type: {key: "account_type", index: 1},
    voice_total: {key: "voice_total", index: 2},
    sms_total: {key: "sms_total", index: 3},
};


export default function Report({reportView = true}) {
    const [store] = useStore();
    const [data, setData] = useState([]);
    const [paginationData, setPaginationData] = useState(DefaultPaginationData);
    const [totalCount, setTotalCount] = useState(0);
    const [loadingData, setLoadingData] = useState(false);
    const [message] = useState("");
    const [openSnackbar, setSnackbarStatus] = useState(false);


    const fetchAccountsReport = () => {
        setLoadingData(true);
        AccountService.getOrganizationAccountsReport(store.user.organization_id)
            .then((response) => {
                let items = [];
                console.log(response.data);
                setTotalCount(response.data.length);
                for (const idx in response.data) {
                    let item = new Array(TABLE_HEAD.length - 1).fill({});
                    Object.entries(response.data[idx]).forEach(([key, value]) => {
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
        fetchAccountsReport();
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
            } else {
                formatted.push(d);
            }
        })
        return formatted;
    }

    return (
        <>
            <BaseSnackbar open={openSnackbar} message={message} setOpen={setSnackbarStatus} />
            <BaseTable
                head={!reportView ? [...TABLE_HEAD, { key: "action", label: "Actions" }] : TABLE_HEAD}
                data={[...data].map((d, idx) => { return formatRowData(d); })}
                pagination={{ paginationData: { ...paginationData, totalCount: totalCount }, setPaginationData: setPaginationData }}
                loadingData={loadingData}
            />
        </>
    )
}