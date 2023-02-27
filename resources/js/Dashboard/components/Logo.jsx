import * as React from "react";
import PropTypes from "prop-types";
import { Link as RouterLink } from "react-router-dom";
// @mui
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import { getRouteWithLang } from "../utils/routesHelpers";

//TODO: Should not load two of logo + never use ../../ import
import whiteLogo from "#/sheen-store-high-resolution-logo-white-on-transparent-background.png";
import blueLogo from "#/sheen-store-high-resolution-logo-color-on-transparent-background.png";
// ----------------------------------------------------------------------

Logo.propTypes = {
    disabledLink: PropTypes.bool,
    sx: PropTypes.object,
};

export default function Logo({ disabledLink = false, sx }) {
    const theme = useTheme();
    const logo = (
        <Box
            sx={{
                width: 60,
                height: 60,
                ...sx,
            }}
        >
            <img src={theme.palette.mode === "dark" ? whiteLogo : blueLogo} />
        </Box>
    );

    if (disabledLink) {
        return <>{logo}</>;
    }

    return <RouterLink to={getRouteWithLang("/")}>{logo}</RouterLink>;
}
