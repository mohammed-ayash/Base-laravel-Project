import * as React from "react";
import PropTypes from "prop-types";
// @mui
import { alpha, styled } from "@mui/material/styles";
import { Box } from "@mui/material";

// ----------------------------------------------------------------------

const RootStyle = styled("div")(() => ({
    flexGrow: 1,
    height: "100%",
    overflow: "hidden",
}));

const SimpleBarStyle = styled(Box)(({ theme }) => ({
    maxHeight: "100%",
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
        width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#707070",
        borderRadius: "6px",
        padding: "2px",
        visibility: "hidden",
    },
    "&:hover": {
        "&::-webkit-scrollbar-thumb": {
            visibility: "visible",
        },
    },
}));

// ----------------------------------------------------------------------

Scrollbar.propTypes = {
    children: PropTypes.node.isRequired,
    sx: PropTypes.object,
};

export default function Scrollbar({ children, sx, ...other }) {
    const userAgent =
        typeof navigator === "undefined" ? "SSR" : navigator.userAgent;

    const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
            userAgent
        );

    if (isMobile) {
        return (
            <Box sx={{ overflowX: "auto", ...sx }} {...other}>
                {children}
            </Box>
        );
    }

    return (
        <RootStyle>
            <SimpleBarStyle
                timeout={500}
                clickontrack="false"
                sx={sx}
                {...other}
            >
                {children}
            </SimpleBarStyle>
        </RootStyle>
    );
}
