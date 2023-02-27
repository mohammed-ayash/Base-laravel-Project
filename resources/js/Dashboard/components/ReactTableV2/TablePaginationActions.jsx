import * as React from "react";
import Iconify from "../Iconify";
import { IconButton } from "@mui/material";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

const RootStyle = styled("div")(({ theme }) => ({
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
}));

const StyledIcon = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
    "&.Mui-disabled": {
        color: "rgba(145, 158, 171, 0.8);",
    },
}));

function TablePaginationActions(props) {
    const theme = useTheme();
    const { page, onChangePage, pageCount } = props;

    const handleFirstPageButtonClick = (event) => {
        onChangePage(event, 0);
    };

    const handleBackButtonClick = (event) => {
        onChangePage(event, page - 1);
    };

    const handleNextButtonClick = (event) => {
        onChangePage(event, page + 1);
    };

    const handleLastPageButtonClick = (event) => {
        onChangePage(event, pageCount - 1);
    };

    return (
        <RootStyle>
            <StyledIcon
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
                aria-label="first page"
            >
                {theme.direction === "rtl" ? (
                    <Iconify icon="bx:last-page" />
                ) : (
                    <Iconify icon="bx:first-page" />
                )}
            </StyledIcon>
            <StyledIcon
                onClick={handleBackButtonClick}
                disabled={page === 0}
                aria-label="previous page"
            >
                {theme.direction === "rtl" ? (
                    <Iconify icon="ic:baseline-keyboard-arrow-right" />
                ) : (
                    <Iconify icon="ic:baseline-keyboard-arrow-left" />
                )}
            </StyledIcon>
            <StyledIcon
                onClick={handleNextButtonClick}
                disabled={page >= pageCount - 1}
                aria-label="next page"
            >
                {theme.direction === "rtl" ? (
                    <Iconify icon="ic:baseline-keyboard-arrow-left" />
                ) : (
                    <Iconify icon="ic:baseline-keyboard-arrow-right" />
                )}
            </StyledIcon>
            <StyledIcon
                onClick={handleLastPageButtonClick}
                disabled={page >= pageCount - 1}
                aria-label="last page"
            >
                {theme.direction === "rtl" ? (
                    <Iconify icon="bx:first-page" />
                ) : (
                    <Iconify icon="bx:last-page" />
                )}
            </StyledIcon>
        </RootStyle>
    );
}

TablePaginationActions.propTypes = {
    onPageChange: PropTypes.func,
    page: PropTypes.number.isRequired,
};

export default TablePaginationActions;
