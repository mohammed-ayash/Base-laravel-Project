import Breadcrumbs from "@/components/Breadcrumbs";
import Iconify from "@/components/Iconify";
import { FullPageSpinner } from "@/components/lib";
import Page from "@/components/Page";
import {
    AvatarBox,
    AvatarSection,
    ContainerBox,
    DetailsBox,
    FlexBox,
    Item,
    Label,
    OrdersSection,
    StyledAvatar,
    Value,
    WalletSection,
} from "@/components/StyledComponents";
import { useClient } from "@/context/auth-context";
import { getDateFromISO } from "@/utils/formatTime";
import { getRouteWithLang } from "@/utils/routesHelpers";
import { Box, Container, Grid, IconButton, Typography } from "@mui/material";
import queryString from "query-string";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

// ----------------------------------------------------------------------

export default function ShowUser() {
    const client = useClient();
    const { id } = useParams();
    const navigate = useNavigate();
    const saleOrdersRoute = getRouteWithLang("/sale-orders");
    const walletTransactionsRoute = getRouteWithLang("/wallet-transactions");

    const { isLoading: fetchLoading, data: user } = useQuery({
        queryKey: `user_${id}`,
        queryFn: () => client(`users/${id}`).then((data) => data.data),
    });

    const saleOrderQuery =
        "user=" +
        queryString.stringify({
            id: user?.id,
            fullName: user?.fullName,
        });

    const walletTransactionsQuery = "wallet=" + user?.id;

    if (fetchLoading) {
        return <FullPageSpinner />;
    }

    return (
        <Page title="Show User">
            <Container>
                <Typography variant="h4" gutterBottom>
                    <FormattedMessage id="show_user" />
                </Typography>
                <Breadcrumbs />
                <ContainerBox>
                    <AvatarBox>
                        <AvatarSection component="label">
                            <StyledAvatar
                                className="avatar"
                                src={user.avatarFileUrl}
                            />
                        </AvatarSection>
                    </AvatarBox>
                    <DetailsBox>
                        <Grid
                            container
                            rowSpacing={3}
                            columnSpacing={5}
                            marginBottom={3}
                        >
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="fullName" />
                                    </Label>
                                    <Value>{user?.fullName}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="gender" />
                                    </Label>
                                    <Value>{user?.gender}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="country" />
                                    </Label>
                                    <Value>{user?.country?.name}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="date_of_birth" />
                                    </Label>
                                    <Value>
                                        {getDateFromISO(user?.dateOfBirth)}
                                    </Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="phone_number" />
                                    </Label>
                                    <Value>{user?.phoneNumber}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="roles_group" />
                                    </Label>
                                    <Value>
                                        {user?.rolesGroups?.map(
                                            (group) => group.name
                                        )}
                                    </Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="user_group" />
                                    </Label>
                                    <Value>{user?.userGroup?.name}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="email" />
                                    </Label>
                                    <Value>{user?.email}</Value>
                                </Item>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Item>
                                    <Label>
                                        <FormattedMessage id="created_at" />
                                    </Label>
                                    <Value>
                                        {getDateFromISO(user?.createdAt)}
                                    </Value>
                                </Item>
                            </Grid>
                        </Grid>
                    </DetailsBox>
                </ContainerBox>
                <ContainerBox>
                    <WalletSection>
                        <Typography variant="h5" gutterBottom>
                            <FormattedMessage id="wallet" />
                        </Typography>
                        <FlexBox>
                            <FormattedMessage id="balance" />
                            <Typography>
                                {user?.wallet?.balance}{" "}
                                <Box
                                    sx={{
                                        fontWeight: "bold",
                                        display: "inline-flex",
                                    }}
                                >
                                    ({user?.wallet?.currencyCode})
                                </Box>
                            </Typography>
                        </FlexBox>
                        <FlexBox>
                            <FormattedMessage id="transactions" />
                            <IconButton
                                onClick={() => {
                                    navigate(
                                        `${walletTransactionsRoute}?${walletTransactionsQuery}`
                                    );
                                }}
                            >
                                <Iconify
                                    icon="material-symbols:arrow-forward-rounded"
                                    width={24}
                                    height={24}
                                />
                            </IconButton>
                        </FlexBox>
                    </WalletSection>
                    <OrdersSection>
                        <FormattedMessage id="sale_orders" />
                        <IconButton
                            onClick={() => {
                                navigate(
                                    `${saleOrdersRoute}?${saleOrderQuery}`
                                );
                            }}
                        >
                            <Iconify
                                icon="material-symbols:arrow-forward-rounded"
                                width={24}
                                height={24}
                            />
                        </IconButton>
                    </OrdersSection>
                </ContainerBox>
            </Container>
        </Page>
    );
}
