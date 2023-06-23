import { useState } from "react";
import { styled } from "@mui/system";
import PropTypes from 'prop-types';
import Scrollbar from "src/components/Scrollbar";
import {
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TablePagination,
    TableRow,
    TableCell,
    Paper
} from '@mui/material';
import TableSkeleton from "./TableSkeleton";
import { useTranslation } from 'react-i18next';
// ------------------------------------------------------------

const alignType = PropTypes.oneOf(
    ["right", "left", "center", "inherit", "justify"]
); // default: left

const headCellProp = PropTypes.shape({
    key: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    sortable: PropTypes.bool,
    align: alignType,
});

const dataCellProp = PropTypes.arrayOf(
    PropTypes.shape({
        key: PropTypes.string.isRequired,
        value: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.node,
        ]),
        cellComponentType: PropTypes.oneOf(["th", "tr"]), // default: tr
        align: alignType,
    })
);

const paginationProp = PropTypes.shape({
    paginationData: PropTypes.object,
    setPaginationData: PropTypes.func,
});

BaseTable.propTypes = {
    head: PropTypes.arrayOf(headCellProp).isRequired,
    data: PropTypes.arrayOf(dataCellProp).isRequired,
    pagination: paginationProp,
    actionItemPrep: PropTypes.func,
    collapsible: PropTypes.bool,
};

// ------------------------------------------------------------

const PaperStyle = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.primary.light,
}));

const TableHeadCellStyle = styled(TableCell)(({ theme }) => ({
    color: theme.palette.secondary.dark,
    fontWeight: "bold",
    fontSize: "0.93rem",
}));

const TablePaginationStyle = styled(TablePagination)(({ theme }) => ({
    color: theme.palette.secondary.dark,
    textDecoration: "bold",
}));

const TableDataCellStyle = styled(TableCell)(({ theme }) => ({
    color: "var(--st-white)",
}));

const TableRowStyle = styled(TableRow)(({ theme }) => ({
    '&:hover': {
        backgroundColor: theme.palette.primary.lighter,
    },
}));

export default function BaseTable({ head, data, pagination, actionItemPrep, collapsible = false, loadingData = true }) {
    const { paginationData, setPaginationData } = pagination;
    const [open, setOpen] = useState(false); //  TODO: implement when collapsible table finalized
    const { t } = useTranslation();

    function* getTableRows(rowData) {
        for (const idx in rowData) {
            let cellData = [];
            rowData[idx].map((c, i) => { if (!c.noRender) { cellData.push(c) } });
            yield (
                <TableRowStyle key={idx}>
                    {getTableCells(cellData, idx)}
                </TableRowStyle>
            )
        }
    }

    const getTableCells = (cellData, index) => {
        let cells = [];
        for (const idx in cellData) {
            const d = cellData[idx];
            cells.push(
                <TableDataCellStyle
                    key={`${d.key}-${index}`}
                    component={d.cellComponentType ? d.cellComponentType : "tr"}
                    align={d.align ? d.align : "left"}
                > {d.value}
                </TableDataCellStyle>
            );
        }
        if (actionItemPrep) {
            cells.push(<TableDataCellStyle
                key={`actions-${index}`}
                align="center"
            > {actionItemPrep(index)}
            </TableDataCellStyle>)
        };
        return cells;
    }

    const handleChangePage = (event, newPage) => {
        const data = { ...paginationData, page: newPage };
        setPaginationData(data);
    };

    const handleChangeRowsPerPage = (event) => {
        const data = { ...paginationData, rowsPerPage: +event.target.value, page: 0 };
        setPaginationData(data);
    };

    const getTableHead = () => {
        return <TableHead sx={{ width: "100%" }}>
            <TableRow>
                {
                    head.map((h, index) => {
                        return (
                            <TableHeadCellStyle component="th" key={h.key} align={h.align}>
                                {h.label}
                            </TableHeadCellStyle>
                        )
                    })
                }
            </TableRow>
        </TableHead>
    }

    const getPaginationLabel = (from, to, count) => {
        console.log('Yey');
    }

    return (
        <Scrollbar>
            <TableContainer component={PaperStyle}>
                <Table aria-label="base table">
                    {getTableHead()}
                    <TableBody>
                        {!loadingData ? [...getTableRows(data)] : null}
                    </TableBody>
                </Table>
            </TableContainer>
            {loadingData ? <TableSkeleton /> : null}
            {
                setPaginationData ?
                    <TablePaginationStyle
                        rowsPerPageOptions={[10]}
                        component="div"
                        count={paginationData.totalCount}
                        rowsPerPage={paginationData.rowsPerPage}
                        page={paginationData.page}
                        labelDisplayedRows={({ from, to, count }) => `${t("common.table.viewingRows")} ${from}-${to} ${t("common.of")} ${count}`}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                    : null
            }
        </Scrollbar>
    );
}
