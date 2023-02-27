import Breadcrumbs from "@/components/Breadcrumbs";
import Iconify from "@/components/Iconify";
import Page from "@/components/Page";
import { useClient } from "@/context/auth-context";
import { fToNow } from "@/utils/formatTime";
import { LoadingButton } from "@mui/lab";
import {
    Box,
    Container,
    Grid,
    IconButton,
    ListItemButton,
    ListItemText,
    Stack,
    Tab,
    Tabs,
    Tooltip,
    Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { FormattedMessage } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import useInfiniteScroll from "./useInfiniteScroll";
import {
    StyledTypography,
    StyledListItemButton,
    IconBox,
    MessageBox,
    HasMoreLoadingButton,
} from "@/components/StyledComponents";

const ShowAll = () => {
    const [value, setValue] = React.useState(0);
    const queryClient = useQueryClient();
    const [page, setPage] = React.useState(1);
    const { isLoading, notifications, hasMore } = useInfiniteScroll(
        page,
        value
    );
    const { mutate: markAllRead } = useMutation(
        () =>
            client("notifications", {
                method: "PUT",
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("my-notifications");
                refetch();
            },
        }
    );

    const handleMarkAllAsRead = () => markAllRead();

    function handleChange(event, newValue) {
        setValue(newValue);
        setPage(1);
    }

    const client = useClient();
    const observer = React.useRef();
    const lastBookElementRef = React.useCallback(
        (node) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver((entries) => {
                if (entries[0]?.isIntersecting && hasMore) {
                    setPage((prevPageNumber) => prevPageNumber + 1);
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasMore]
    );
    const { mutate: mutateSigleNotification } = useMutation(
        (notification) =>
            client(`notifications/${notification?.id}`, {
                method: "PUT",
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users/profile");
            },
        }
    );

    return (
        <Page title="All Notifications">
            <Container>
                <Typography variant="h4" gutterBottom>
                    <FormattedMessage id="notification_show_all" />
                </Typography>
                <Breadcrumbs />
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        sx={{ marginBottom: "10px" }}
                    >
                        <Tab label={<FormattedMessage id="all" />} />
                        <Tab label={<FormattedMessage id="unRead" />} />
                    </Tabs>
                    <Tooltip title=" Mark all as read">
                        <IconButton
                            color="primary"
                            onClick={handleMarkAllAsRead}
                        >
                            <Iconify
                                icon="eva:done-all-fill"
                                width={20}
                                height={20}
                            />
                        </IconButton>
                    </Tooltip>
                </Stack>

                <Grid container rowSpacing={3}>
                    {notifications &&
                        notifications.map((notification, index) => {
                            if (index + 1 == notifications.length) {
                                return (
                                    <Grid item xs={12}>
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            mutate={mutateSigleNotification}
                                            customRef={lastBookElementRef}
                                        />
                                    </Grid>
                                );
                            }
                            return (
                                <Grid item xs={12}>
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        mutate={mutateSigleNotification}
                                    />
                                </Grid>
                            );
                        })}
                </Grid>
                {hasMore ? (
                    <HasMoreLoadingButton loading={isLoading}>
                        <FormattedMessage id="loadmore" />
                    </HasMoreLoadingButton>
                ) : (
                    <></>
                )}
            </Container>
        </Page>
    );
};

function NotificationItem({ notification, mutate, customRef }) {
    const { palette } = useTheme();

    let title = (
        <Typography
            variant="subtitle2"
            onClick={() => {
                if (notification?.notificationTemplate?.resourceUrl)
                    window.open(
                        `${notification?.notificationTemplate?.resourceUrl}`,
                        "_blank"
                    );
            }}
        >
            <IconBox>
                <IconButton color={!notification?.read ? "primary" : "default"}>
                    <Iconify icon="eva:bell-fill" width={20} height={20} />
                </IconButton>
                {notification?.notificationTemplate?.title}
            </IconBox>
            <MessageBox component="span" variant="body2">
                {notification?.notificationTemplate?.message}
            </MessageBox>
        </Typography>
    );
    return (
        <StyledListItemButton
            sx={{
                ...(notification?.read && {
                    bgcolor: palette.background.paper,
                }),
            }}
            ref={customRef}
            onClick={() => {
                if (!notification.read) mutate(notification);
            }}
        >
            <ListItemText
                primary={title}
                secondary={
                    <StyledTypography variant="caption">
                        <Iconify
                            icon="eva:clock-outline"
                            sx={{ mr: 0.5, width: 16, height: 16 }}
                        />
                        {fToNow(notification?.createdAt)}
                    </StyledTypography>
                }
            />
        </StyledListItemButton>
    );
}

export default ShowAll;
