import * as React from "react";
import PropTypes from "prop-types";
import { useState, useRef } from "react";
// @mui
import {
    Box,
    List,
    Badge,
    Button,
    Tooltip,
    Divider,
    Typography,
    IconButton,
    ListItemText,
    ListSubheader,
    ListItemButton,
} from "@mui/material";
// utils
import { fToNow } from "../../utils/formatTime";
// components
import Iconify from "../../components/Iconify";
import Scrollbar from "../../components/Scrollbar";
import MenuPopover from "../../components/MenuPopover";
import { useClient } from "../../context/auth-context";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FormattedMessage } from "react-intl";
import { Link as RouterLink } from "react-router-dom";
import { getRouteWithLang } from "../../utils/routesHelpers";

export default function NotificationsPopover({ unread }) {
    const anchorRef = useRef(null);
    const client = useClient();
    const queryClient = useQueryClient();
    const [unreadNumber, setUnreadNumber] = useState(unread ?? 0);
    const [notifications, setNotifications] = useState({
        all: [],
        unRead: [],
        read: [],
    });
    const [open, setOpen] = useState(null);

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
        refetch();
    };

    const handleClose = () => {
        setOpen(null);
    };

    const { refetch } = useQuery(
        ["my-notifications"],
        () =>
            client("notifications/my-notifications?limit=10").then((data) => {
                let notis = data?.pagination?.items;
                let unRead = notis?.filter((noti) => noti.read === false);
                let read = notis?.filter((noti) => noti.read === true);
                setNotifications({
                    all: notis,
                    unRead,
                    read,
                });
            }),
        { enabled: false }
    );
    const { mutate: mutateSingleNotification } = useMutation(
        (notification) =>
            client(`notifications/${notification?.id}`, {
                method: "PUT",
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("my-notifications");
                setUnreadNumber((prev) => {
                    return prev - 1;
                });
                refetch();
            },
        }
    );
    const { mutate } = useMutation(
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
    const handleMarkAllAsRead = () => mutate();

    return (
        <>
            <IconButton
                ref={anchorRef}
                color={open ? "primary" : "default"}
                onClick={handleOpen}
                sx={{ width: 40, height: 40 }}
            >
                <Badge badgeContent={unreadNumber} color="error">
                    <Iconify icon="eva:bell-fill" width={20} height={20} />
                </Badge>
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    width: 360,
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    maxHeight: 500,
                    overflow: "auto",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        py: 2,
                        px: 2.5,
                        overflow: "auto",
                    }}
                >
                    <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle1">
                            <FormattedMessage id="notifications" />
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}
                        >
                            {notifications?.unRead?.length > 0 && (
                                <>
                                    <FormattedMessage id="you_have" />{" "}
                                    {notifications?.unRead?.length}{" "}
                                    <FormattedMessage id="unread_messages" />
                                </>
                            )}
                        </Typography>
                    </Box>

                    {notifications?.unRead?.length > 0 && (
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
                    )}
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Scrollbar sx={{ height: { xs: 340, sm: "auto" } }}>
                    {notifications?.unRead?.length > 0 && (
                        <List
                            disablePadding
                            subheader={
                                <ListSubheader
                                    disableSticky
                                    sx={{
                                        py: 1,
                                        px: 2.5,
                                        typography: "overline",
                                    }}
                                >
                                    <FormattedMessage id="new" />
                                </ListSubheader>
                            }
                        >
                            {notifications.unRead.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                    mutate={mutateSingleNotification}
                                    setNotifications={setNotifications}
                                />
                            ))}
                        </List>
                    )}
                    {notifications?.read?.length > 0 && (
                        <List
                            disablePadding
                            subheader={
                                <ListSubheader
                                    disableSticky
                                    sx={{
                                        py: 1,
                                        px: 2.5,
                                        typography: "overline",
                                    }}
                                >
                                    <FormattedMessage id="before_that" />
                                </ListSubheader>
                            }
                        >
                            {notifications.read.map((notification) => (
                                <NotificationItem
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </List>
                    )}
                </Scrollbar>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Box sx={{ p: 1 }}>
                    <Button
                        fullWidth
                        disableRipple
                        component={RouterLink}
                        to={`notifications/show-all`}
                        onClick={handleClose}
                    >
                        <FormattedMessage id="view_all" />
                    </Button>
                </Box>
            </MenuPopover>
        </>
    );
}

// ----------------------------------------------------------------------

NotificationItem.propTypes = {
    notification: PropTypes.shape({
        createdAt: PropTypes.instanceOf(Date),
        id: PropTypes.string,
        isUnRead: PropTypes.bool,
        title: PropTypes.string,
        description: PropTypes.string,
        type: PropTypes.string,
        avatar: PropTypes.any,
    }),
};

function NotificationItem(props) {
    let { notification, mutate, setNotifications } = props;
    let dashboardRoute = getRouteWithLang("");

    let title = (
        <Typography
            variant="subtitle2"
            onClick={() => {
                if (notification?.notificationTemplate?.resourceUrl)
                    window.open(
                        `/dashboard${dashboardRoute}${
                            notification?.notificationTemplate?.resourceUrl
                        }/${notification?.data ?? ""}`,
                        "_blank"
                    );
            }}
        >
            <Typography
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 0.5,
                    mb: 0.5,
                }}
            >
                <IconButton color={!notification?.read ? "primary" : "default"}>
                    <Iconify icon="eva:bell-fill" width={20} height={20} />
                </IconButton>
                {notification?.notificationTemplate?.title}
            </Typography>
            <Typography
                component="span"
                variant="body2"
                sx={{ color: "text.secondary", display: "block" }}
            >
                {notification?.notificationTemplate?.message}
            </Typography>
        </Typography>
    );
    return (
        <ListItemButton
            sx={{
                py: 1.5,
                px: 2.5,
                mt: "1px",
                ...(notification?.read && {
                    bgcolor: "action.selected",
                }),
            }}
            onClick={() => {
                if (mutate) {
                    mutate(notification);
                }
            }}
        >
            <ListItemText
                primary={title}
                secondary={
                    <Typography
                        variant="caption"
                        sx={{
                            mt: 0.5,
                            display: "flex",
                            alignItems: "center",
                            color: "text.disabled",
                        }}
                    >
                        <Iconify
                            icon="eva:clock-outline"
                            sx={{ mr: 0.5, width: 16, height: 16 }}
                        />
                        {fToNow(notification?.createdAt)}
                    </Typography>
                }
            />
        </ListItemButton>
    );
}
