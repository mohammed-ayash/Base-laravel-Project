import * as React from "react";
import { Button, Container, Stack, styled, Typography } from "@mui/material";
import ReactTableV2 from "@/components/ReactTableV2";
import { useMemo } from "react";
import { Link as RouterLink } from "react-router-dom";
import Iconify from "@/components/Iconify";
import Page from "@/components/Page";
import { tableColumns } from "./data";
import { useQuery } from "react-query";
import { FullPageSpinner } from "@/components/lib";
import { useClient } from "@/context/auth-context";
import { FormattedMessage } from "react-intl";
import { getRouteWithLang } from "@/utils/routesHelpers";
import Breadcrumbs from "@/components/Breadcrumbs";
import useQueryParams from "@/hooks/useQueryParams";
import FiltersForm from "./Filters";
import queryString from "query-string";

export default function Users() {
    const columns = useMemo(() => tableColumns, []);
    const client = useClient();
    let { searchParams } = useQueryParams();
    const fetchDataOptions = {
        page: searchParams?.get("page") || 1,
        limit: searchParams?.get("limit") || 10,
        name: searchParams?.get("query") || undefined,
        sort: searchParams?.get("sort")
            ? `u.${searchParams?.get("sort")}`
            : undefined,
        direction: searchParams?.get("direction") || undefined,
        search: searchParams?.get("search") || undefined,
        gender: searchParams?.get("gender") || undefined,
        blocked: searchParams?.get("blocked") || undefined,
        emailVerified: searchParams?.get("verified") || undefined,
        email: searchParams?.get("email") || undefined,
        phoneNumber: searchParams?.get("phoneNumber") || undefined,
        userGroup:
            queryString.parse(searchParams?.get("userGroup")).id || undefined,
        country:
            queryString.parse(searchParams?.get("country")).id || undefined,
        rolesGroup:
            queryString.parse(searchParams?.get("roleGroup")).id || undefined,
        trusted: searchParams?.get("trusted") || undefined,
    };

    const { data, isLoading } = useQuery(
        ["users", fetchDataOptions],
        () =>
            client(`users?${queryString.stringify(fetchDataOptions)}`).then(
                (data) => data?.pagination
            ),
        {
            keepPreviousData: true,
            onError: () => {
                errorWithCustomMessage("failed_with_reload_msg");
            },
        }
    );

    return (
        <Page title="All Users">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h4">
                        <FormattedMessage id="users" />
                    </Typography>

                    <Button
                        variant="contained"
                        component={RouterLink}
                        to={getRouteWithLang("/users/add")}
                        startIcon={<Iconify icon="eva:plus-fill" />}
                    >
                        <FormattedMessage id="new_user" />
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
