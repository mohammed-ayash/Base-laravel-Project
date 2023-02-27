import Breadcrumbs from "@/components/Breadcrumbs";
import Iconify from "@/components/Iconify";
import Loading from "@/components/Loading";
import Page from "@/components/Page";
import ReactTableDnD from "@/components/ReactTableDnD";
import { useClient } from "@/context/auth-context";
import useQueryParams from "@/hooks/useQueryParams";
import {
    errorWithCustomMessage,
    successWithCustomMessage,
} from "@/utils/notifications";
import { getRouteWithLang } from "@/utils/routesHelpers";
import { Button, Container, Stack, Typography } from "@mui/material";
import queryString from "query-string";
import * as React from "react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { tableColumns } from "./data";

export default function Sliders() {
    const queryClient = useQueryClient();
    const columns = useMemo(() => tableColumns, []);
    const client = useClient();
    let { searchParams } = useQueryParams();
    const [tableData, setTableData] = React.useState();

    const reorderRow = (draggedRowIndex, targetRowIndex) => {
        onDrop && onDrop({ draggedRowIndex, targetRowIndex });
    };
    const fetchDataOptions = {
        sort: "s.sortOrder",
        direction: "asc",
        search: searchParams?.get("query") || undefined,
    };

    const { data, isLoading } = useQuery(
        ["sliders", fetchDataOptions],
        () =>
            client(`sliders?${queryString.stringify(fetchDataOptions)}`).then(
                (data) => data?.pagination
            ),
        {
            keepPreviousData: true,
            onError: () => {
                errorWithCustomMessage("failed_with_reload_msg");
            },
            onSuccess: (res) => {
                setTableData(res.items);
            },
        }
    );

    const { mutate, isLoading: mutateLoading } = useMutation(
        (data) =>
            client(`sliders/${data.id}`, {
                method: "POST",
                data: { sortOrder: data.sortOrder },
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("sliders");
                successWithCustomMessage("updated_success_msg");
            },
            onError: (error) => {
                errorWithCustomMessage("error_msg");
            },
        }
    );

    const onDrop = ({ draggedRowIndex, targetRowIndex }) => {
        // Drag from bottom to top
        if (draggedRowIndex > targetRowIndex) {
            mutate({
                id: data.items[draggedRowIndex]?.id,
                sortOrder: data.items[targetRowIndex].sortOrder,
            });
        }
        // Drag from top to bottom
        if (draggedRowIndex < targetRowIndex) {
            mutate({
                id: data.items[draggedRowIndex]?.id,
                sortOrder: data.items[targetRowIndex].sortOrder,
            });
        }
    };

    return (
        <Page title="All Sliders">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h4">
                        <FormattedMessage id="sliders" />
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={getRouteWithLang("/sliders/add")}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        <FormattedMessage id="new_slider" />
                    </Button>
                </Stack>
                <Breadcrumbs />
                <ReactTableDnD
                    columns={columns}
                    data={tableData}
                    reorderRow={reorderRow}
                    isToolbar={false}
                    isLoading={isLoading}
                />
            </Container>
            {mutateLoading && <Loading loading={mutateLoading} />}
        </Page>
    );
}
