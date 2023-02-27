import React from "react";
import { styled, Breadcrumbs as muiBreadcrumbs, Box } from "@mui/material";
import { getRouteWithLang } from "../../utils/routesHelpers";
import { Link, useMatches } from "react-router-dom";
import { FormattedMessage } from "react-intl";

const Dot = styled("span")(() => ({
    height: "0.3rem",
    width: "0.3rem",
    backgroundColor: "#333",
    borderRadius: "50%",
    display: "inline-block",
    marginRight: ".3rem",
    marginLeft: ".3rem",
}));

const StyledBreadcrumbs = styled(muiBreadcrumbs)(() => ({
    fontWeight: "700",
    marginBottom: "40px",
    color: "white",
    "& .last": {
        fontWeight: "300",
        color: "grey",
        PointerEvent: "none",
    },
    "& .last:hover": {
        textDecoration: "none",
        cursor: "default",
    },
}));

const StyledBox = styled(Box)(({ theme }) => ({
    textDecoration: "none",
    color: theme?.palette?.mode == "dark" ? "white" : theme?.palette?.grey[700],
    fontSize: "1rem",
    "&:hover": {
        textDecoration: "underline",
        cursor: "pointer",
    },
}));

const Breadcrumbs = () => {
    let matches = useMatches();
    let crumbs = matches
        .filter((match) => Boolean(match.handle?.crumb))
        .map((match) => match.handle.crumb(match.data));
    return (
        <StyledBreadcrumbs aria-label="Breadcrumbs " separator={<Dot />}>
            {crumbs.map((crumb, index) => {
                return index !== crumbs.length - 1 ? (
                    <StyledBox
                        key={index}
                        component={Link}
                        to={getRouteWithLang(crumb.props.to)}
                    >
                        <FormattedMessage id={crumb.props.children} />
                    </StyledBox>
                ) : (
                    <StyledBox key={index} component={"span"} className="last">
                        <FormattedMessage id={crumb.props.children} />
                    </StyledBox>
                );
            })}
        </StyledBreadcrumbs>
    );
};

export default Breadcrumbs;
