import React from "react";

import {
    Button,
    Card,
    FormControl,
    MenuItem,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TableRow,
} from "@mui/material";
import {
    flexRender,
    getCoreRowModel,
    useReactTable,
} from "@tanstack/react-table";
import { FormattedMessage } from "react-intl";
//
import useQueryParams from "../../hooks/useQueryParams";
import { styled } from "@mui/material/styles";
import { Box } from "@mui/system";
import Iconify from "../Iconify";
import SearchNotFound from "../SearchNotFound";
import CustomToolbar from "./Partials/CustomToolbar";
import TablePaginationActions from "./TablePaginationActions";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ModalSpinner } from "../lib";

const SimpleBarStyle = styled(Card)(({ theme }) => ({
    maxHeight: "100%",
    overflowX: "scroll",
    "&::-webkit-scrollbar": {
        height: "6px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#707070",
        borderRadius: "6px",
        padding: "1px",
        visibility: "hidden",
    },
    "&:hover": {
        "&::-webkit-scrollbar-thumb": {
            visibility: "visible",
        },
    },
}));

const PaginationTalbleFooter = styled("div")(() => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "3px 0 ",
}));
const PaginationTableRow = styled("div")(() => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "3px 0 ",
}));
const Pagination = styled("span")(() => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "3px 0 ",
    gap: "10px",
}));
const FormControlStyle = styled(FormControl)(() => ({
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    margin: "3px 0 ",
}));
const RootTable = styled(Table)(() => ({}));
const DragButton = styled(Button)(() => ({
    padding: "1rem",
    cursor: "grab",
}));
const DraggableRow = ({ row, reorderRow }) => {
    const [, dropRef] = useDrop({
        accept: "row",
        drop: (draggedRow) => reorderRow(draggedRow.index, row.index),
    });

    const [{ isDragging }, dragRef, previewRef] = useDrag({
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
        item: () => row,
        type: "row",
    });

    return (
        <TableRow
            key={row.id}
            ref={previewRef} //previewRef could go here
        >
            <TableCell ref={dropRef}>
                <DragButton ref={dragRef}>
                    <Iconify width={24} height={24} icon="system-uicons:drag" />
                </DragButton>
            </TableCell>
            {row.getVisibleCells().map((cell) => {
                return (
                    <TableCell
                        sx={cell.column?.style ? cell.column?.style : null}
                        align="left"
                        key={cell.id}
                    >
                        {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                        )}
                    </TableCell>
                );
            })}
        </TableRow>
    );
};

function ReactTableDnD({
    data,
    columns,
    isPaginated = true,
    isToolbar = true,
    filtered,
    searchBox,
    reorderRow,
    isLoading,
}) {
    const defaultData = React.useMemo(() => [], []);
    const [globalFilter, setGlobalFilter] = React.useState("");
    const { setArrayOfQueryParams, removeArrayOfQueryParams, getQueryParams } =
        useQueryParams();

    const [{ pageIndex, pageSize }, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    });
    const [sorting, setSorting] = React.useState(
        getQueryParams("sort") && getQueryParams("direction")
            ? [
                  {
                      id: getQueryParams("sort"),
                      desc:
                          getQueryParams("direction") === "desc" ? true : false,
                  },
              ]
            : []
    );

    React.useEffect(() => {
        if (pageIndex === 0) {
            removeArrayOfQueryParams(["page"]);
        } else {
            setArrayOfQueryParams([{ name: "page", value: pageIndex + 1 }]);
        }
    }, [pageIndex]);

    React.useEffect(() => {
        if (pageSize === 10) {
            removeArrayOfQueryParams(["limit"]);
        } else {
            setArrayOfQueryParams([{ name: "limit", value: pageSize }]);
        }
    }, [pageSize]);

    React.useEffect(() => {
        if (sorting.length === 0) {
            removeArrayOfQueryParams(["sort", "direction"]);
        } else {
            setArrayOfQueryParams([
                { name: "sort", value: sorting[0]?.id },
                { name: "direction", value: sorting[0]?.desc ? "desc" : "asc" },
            ]);
        }
    }, [sorting]);

    const table = useReactTable({
        data: data ?? defaultData,
        columns,
        pageCount: data?.pages ?? 1,
        state: {
            sorting,
            pagination: { pageIndex, pageSize },
            globalFilter,
        },
        onSortingChange: setSorting,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        getRowId: (row) => {
            return row?.sortOrder;
        }, //good to have guaranteed unique row ids/keys for rendering
    });
    const handleChangePage = (event, newPage) => {
        table.setPageIndex(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        table.setPageSize(parseInt(event.target.value, 10));
        table.setPageIndex(0);
    };

    if (isLoading) {
        return <ModalSpinner />;
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <SimpleBarStyle sx={{ overflowX: "auto" }}>
                {isToolbar ? (
                    <CustomToolbar
                        selectedRows={""}
                        onDelete={() => {}}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                        filtered={filtered}
                        searchBox={searchBox}
                    />
                ) : (
                    <Box sx={{ height: 20 }} />
                )}

                <TableContainer sx={{ minWidth: 800 }}>
                    <RootTable>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    <TableCell />

                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            {...{
                                                sx: header.column.getCanSort()
                                                    ? { cursor: "pointer" }
                                                    : null,
                                                onClick:
                                                    header.column.getToggleSortingHandler(),
                                            }}
                                        >
                                            <div
                                                style={{
                                                    alignItems: "center",
                                                    display: "flex",
                                                }}
                                            >
                                                {flexRender(
                                                    <FormattedMessage
                                                        id={
                                                            header.column
                                                                .columnDef
                                                                .header
                                                        }
                                                    />,
                                                    header.getContext()
                                                )}
                                                {{
                                                    asc: (
                                                        <Iconify
                                                            icon="akar-icons:arrow-up"
                                                            width={30}
                                                            height={20}
                                                        />
                                                    ),
                                                    desc: (
                                                        <Iconify
                                                            icon="akar-icons:arrow-down"
                                                            width={30}
                                                            height={20}
                                                        />
                                                    ),
                                                }[
                                                    header.column.getIsSorted()
                                                ] ?? null}
                                            </div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows.map((row) => (
                                <DraggableRow
                                    key={row.id}
                                    row={row}
                                    reorderRow={reorderRow}
                                />
                            ))}
                        </TableBody>
                        {table.getRowModel().rows.length === 0 && (
                            <TableBody>
                                <TableRow>
                                    <TableCell
                                        align="center"
                                        colSpan={6}
                                        sx={{ py: 3 }}
                                    >
                                        <SearchNotFound
                                            isSearchQuery={isToolbar}
                                            searchQuery={
                                                getQueryParams("query")
                                                    ? getQueryParams("query")
                                                    : ""
                                            }
                                        />
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )}
                    </RootTable>
                </TableContainer>
                <PaginationTableRow>
                    {Boolean(isPaginated) && (
                        <Pagination>
                            <FormattedMessage id="rows_per_page" />
                            <FormControlStyle size="small">
                                <Select
                                    value={table.getState().pagination.pageSize}
                                    onChange={(e) => {
                                        table.setPageSize(
                                            Number(e.target.value)
                                        );
                                    }}
                                >
                                    {[10, 20, 30, 40, 50].map((pageSize) => (
                                        <MenuItem
                                            key={pageSize}
                                            value={pageSize}
                                        >
                                            {pageSize}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControlStyle>
                        </Pagination>
                    )}
                    {Boolean(isPaginated) && (
                        <PaginationTalbleFooter>
                            <PaginationTableRow>
                                <TablePaginationActions
                                    colSpan={3}
                                    rowsPerPage={
                                        table.getState().pagination.pageSize
                                    }
                                    page={table.getState().pagination.pageIndex}
                                    pageCount={table.getPageCount()}
                                    SelectProps={{
                                        inputProps: {
                                            "aria-label": "rows per page",
                                        },
                                        native: true,
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={
                                        handleChangeRowsPerPage
                                    }
                                    ActionsComponent={TablePaginationActions}
                                />
                            </PaginationTableRow>
                        </PaginationTalbleFooter>
                    )}
                </PaginationTableRow>
            </SimpleBarStyle>
        </DndProvider>
    );
}

export default ReactTableDnD;
