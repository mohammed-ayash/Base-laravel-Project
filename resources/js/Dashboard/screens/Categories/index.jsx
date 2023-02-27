import * as React from "react";
import Iconify from "@/components/Iconify";
import { Button, Container, Stack, Typography } from "@mui/material";
import Page from "@/components/Page";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import Table from "./Table";
import { getRouteWithLang } from "@/utils/routesHelpers";
import Breadcrumbs from "@/components/Breadcrumbs";
import useRoles from "@/hooks/useRoles";

export default function Categories() {
    const { checkIfRolesInUserRoles } = useRoles();

    return (
        <Page title="Category">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Typography variant="h4">
                        <FormattedMessage id="categories" />
                    </Typography>
                    {
                        //   checkIfRolesInUserRoles(['ROLE_CATEGORY_ADD'])
                        true && (
                            <Button
                                variant="contained"
                                component={RouterLink}
                                to={getRouteWithLang("/categories/add")}
                                startIcon={<Iconify icon="eva:plus-fill" />}
                            >
                                <FormattedMessage id="new_parant_category" />
                            </Button>
                        )
                    }
                </Stack>
                <Breadcrumbs />
                <Table />
            </Container>
        </Page>
    );
}
