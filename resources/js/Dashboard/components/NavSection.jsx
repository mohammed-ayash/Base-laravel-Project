import * as React from "react";
import { useState } from "react";
import PropTypes from "prop-types";
import {
    NavLink as RouterLink,
    matchPath,
    useLocation,
} from "react-router-dom";
// material
import { alpha, useTheme, styled } from "@mui/material/styles";
import {
    Box,
    List,
    Collapse,
    ListItemText,
    ListItemIcon,
    ListItemButton,
} from "@mui/material";
//
import Iconify from "./Iconify";
import { FormattedMessage } from "react-intl";
import { getRouteWithLang } from "../utils/routesHelpers";
import useRoles from "../hooks/useRoles";

// ----------------------------------------------------------------------

const ListItemStyle = styled((props) => (
    <ListItemButton disableGutters {...props} />
))(({ theme }) => ({
    ...theme.typography.body2,
    height: 48,
    position: "relative",
    textTransform: "capitalize",
    color: theme.palette.text.secondary,
    borderRadius: theme.shape.borderRadius,
    padding: "0.6rem",
}));

const ListItemIconStyle = styled(ListItemIcon)({
    width: 22,
    height: 22,
    color: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
});

// ----------------------------------------------------------------------

NavItem.propTypes = {
    item: PropTypes.object,
    active: PropTypes.func,
};

function NavItem({ item, active }) {
    const baseRout = getRouteWithLang();
    const theme = useTheme();

    const isActiveRoot = active(baseRout + item.path);

    const { title, path, icon, info, children } = item;

    const [open, setOpen] = useState(isActiveRoot);

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };

    const activeRootStyle = {
        color: "primary.main",
        fontWeight: "fontWeightMedium",
        bgcolor: alpha(
            theme.palette.primary.main,
            theme.palette.action.selectedOpacity
        ),
    };

    const activeSubStyle = {
        color: "text.primary",
        fontWeight: "fontWeightMedium",
    };

    if (children) {
        return (
            <>
                <ListItemStyle
                    onClick={handleOpen}
                    sx={{
                        ...(isActiveRoot && activeRootStyle),
                    }}
                >
                    <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
                    <ListItemText disableTypography primary={title} />
                    {info && info}
                    <Iconify
                        icon={
                            open
                                ? "eva:arrow-ios-downward-fill"
                                : "eva:arrow-ios-forward-fill"
                        }
                        sx={{ width: 16, height: 16, ml: 1 }}
                    />
                </ListItemStyle>

                <Collapse in={open} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        {children.map((item) => {
                            const { title, path } = item;
                            const isActiveSub = active(baseRout + path);

                            return (
                                <ListItemStyle
                                    key={title}
                                    component={RouterLink}
                                    to={baseRout + path}
                                    sx={{
                                        ...(isActiveSub && activeSubStyle),
                                    }}
                                >
                                    <ListItemIconStyle>
                                        <Box
                                            component="span"
                                            sx={{
                                                width: 4,
                                                height: 4,
                                                display: "flex",
                                                borderRadius: "50%",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                bgcolor: "text.disabled",
                                                transition: (theme) =>
                                                    theme.transitions.create(
                                                        "transform"
                                                    ),
                                                ...(isActiveSub && {
                                                    transform: "scale(2)",
                                                    bgcolor: "primary.main",
                                                }),
                                            }}
                                        />
                                    </ListItemIconStyle>
                                    <ListItemText
                                        disableTypography
                                        primary={
                                            <FormattedMessage id={title} />
                                        }
                                    />
                                </ListItemStyle>
                            );
                        })}
                    </List>
                </Collapse>
            </>
        );
    }

    return (
        <ListItemStyle
            component={RouterLink}
            to={baseRout + path}
            sx={{
                ...(isActiveRoot && activeRootStyle),
            }}
        >
            <ListItemIconStyle>{icon && icon}</ListItemIconStyle>
            <ListItemText
                disableTypography
                primary={<FormattedMessage id={title} />}
            />
            {info && info}
        </ListItemStyle>
    );
}

NavSection.propTypes = {
    navConfig: PropTypes.array,
};

export default function NavSection({ navConfig, ...other }) {
    // const { checkIfRolesInUserRoles } = useRoles();
    const { pathname } = useLocation();

    const match = (path) =>
        path ? !!matchPath({ path, end: false }, pathname) : false;
    return (
        <Box {...other}>
            <List disablePadding sx={{ p: 1 }}>
                {navConfig.map((item) => {
                    //   if (checkIfRolesInUserRoles(item?.roles)) {
                    return (
                        <NavItem key={item.title} item={item} active={match} />
                    );
                    //   }
                })}
            </List>
        </Box>
    );
}
