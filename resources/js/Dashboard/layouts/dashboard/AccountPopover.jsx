import * as React from "react";
import { useRef, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
// @mui
import {
    Avatar,
    Box,
    Divider,
    IconButton,
    MenuItem,
    Stack,
    Switch,
    Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
// components
import MenuPopover from "../../components/MenuPopover";
// mocks_
import { useAuth } from "../../context/auth-context";
import useDarkMode from "../../hooks/useDarkMode";
import { FormattedMessage } from "react-intl";

// ----------------------------------------------------------------------

const MENU_OPTIONS = [
    {
        label: "home",
        icon: "eva:home-fill",
        linkTo: "/",
    },
    {
        label: "profile",
        icon: "eva:person-fill",
        linkTo: "profile",
    },
    {
        label: "settings",
        icon: "eva:settings-2-fill",
        linkTo: "website-settings",
    },
];

// ----------------------------------------------------------------------

export default function AccountPopover() {
    const { theme, toggleTheme } = useDarkMode();

    const anchorRef = useRef(null);

    const [open, setOpen] = useState(null);
    const { user, logout } = useAuth();

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
    };

    const handleClose = () => {
        setOpen(null);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        "&:before": {
                            zIndex: 1,
                            content: "''",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            position: "absolute",
                            bgcolor: (theme) =>
                                alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar src={user?.avatarFileUrl} alt="photoURL" />
            </IconButton>

            <MenuPopover
                open={Boolean(open)}
                anchorEl={open}
                onClose={handleClose}
                sx={{
                    p: 0,
                    mt: 1.5,
                    ml: 0.75,
                    "& .MuiMenuItem-root": {
                        typography: "body2",
                        borderRadius: 0.75,
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {user?.fullName?.toUpperCase()}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: "text.secondary" }}
                        noWrap
                    >
                        {user?.email}
                    </Typography>
                </Box>

                <Divider sx={{ borderStyle: "dashed" }} />

                <Stack sx={{ p: 1 }}>
                    {MENU_OPTIONS.map((option) => (
                        <MenuItem
                            key={option.label}
                            to={option.linkTo}
                            component={RouterLink}
                            onClick={handleClose}
                        >
                            <FormattedMessage id={option.label} />
                        </MenuItem>
                    ))}
                    <MenuItem
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}
                    >
                        <FormattedMessage id="dark_theme" />
                        <Switch
                            checked={theme === "dark"}
                            onChange={toggleTheme}
                        />
                    </MenuItem>
                </Stack>

                <Divider sx={{ borderStyle: "dashed" }} />

                <MenuItem onClick={() => logout()} sx={{ m: 1 }}>
                    <FormattedMessage id="logout" />
                </MenuItem>
            </MenuPopover>
        </>
    );
}
