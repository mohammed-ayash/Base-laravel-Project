import Breadcrumbs from "@/components/Breadcrumbs";
import Iconify from "@/components/Iconify";
import Page from "@/components/Page";
import ReactTableV2 from "@/components/ReactTableV2";
import { useClient } from "@/context/auth-context";
import useQueryParams from "@/hooks/useQueryParams";

import { errorWithCustomMessage } from "@/utils/notifications";
import { getRouteWithLang } from "@/utils/routesHelpers";
import { Button, Container, Stack, Typography } from "@mui/material";
import queryString from "query-string";
import * as React from "react";
import { useMemo } from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import FiltersForm from "./Filters";
import { tableColumns } from "./data";

export default function Notifications() {
    const columns = useMemo(() => tableColumns, []);
    const client = useClient();
    const addRoute = getRouteWithLang("/notifications/send");
    let { searchParams } = useQueryParams();

    const fetchDataOptions = {
        page: searchParams?.get("page") || 1,
        limit: searchParams?.get("limit") || 10,
        search: searchParams?.get("search") || undefined,
        sort: searchParams?.get("sort")
            ? `n.${searchParams?.get("sort")}`
            : undefined,
        direction: searchParams?.get("direction") || undefined,
        notificationTemplate:
            queryString.parse(searchParams?.get("notificationTemplate")).id ||
            undefined,
        user: queryString.parse(searchParams?.get("user")).id || undefined,
        read: searchParams?.get("read") || undefined,
    };

    const { data, isLoading } = useQuery(
        ["notifications", fetchDataOptions],
        () =>
            client(
                `notifications?${queryString.stringify(fetchDataOptions)}`
            ).then((data) => data?.pagination),
        {
            keepPreviousData: true,
            onError: () => {
                errorWithCustomMessage("failed_with_reload_msg");
            },
        }
    );

    return (
        <Page title="All Notifications">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h4">
                        <FormattedMessage id="notifications" />
                    </Typography>
                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={addRoute}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        <FormattedMessage id="send_notification" />
                    </Button>
                </Stack>
                <Breadcrumbs />
                <FiltersForm />
                <ReactTableV2
                    columns={columns}
                    data={data}
                    isToolbar={false}
                    isLoading={isLoading}
                />
            </Container>
        </Page>
    );
}
