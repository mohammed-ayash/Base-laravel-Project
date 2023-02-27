import React from "react";
import PropTypes from "prop-types";
import { Helmet } from "react-helmet-async";
import { forwardRef } from "react";
// @mui
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import fav from "#/sheen-store-website-favicon-color.png";

// ----------------------------------------------------------------------

const Page = forwardRef(({ children, title = "", meta, ...other }, ref) => {
    const theme = useTheme();

    return (
        <>
            <Helmet>
                <title>{`${title}`}</title>
                <link rel="icon" type="image/png" href={fav} sizes="16x16" />
                {meta}
            </Helmet>

            <Box ref={ref} {...other}>
                {children}
            </Box>
        </>
    );
});

Page.propTypes = {
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
    meta: PropTypes.node,
};

export default Page;
