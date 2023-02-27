import * as React from "react";
import { useState } from "react";
// material
import { styled, alpha } from "@mui/material/styles";
import {
    Slide,
    IconButton,
    ClickAwayListener,
    InputAdornment,
} from "@mui/material";
import { Box } from "@mui/system";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// component
import Iconify from "../../components/Iconify";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
//data
import navConfig from "../../layouts/dashboard/NavConfig";
import { getRouteWithLang } from "../../utils/routesHelpers";

const APPBAR_MOBILE = 64;
const APPBAR_DESKTOP = 92;

const SearchbarStyle = styled("div")(({ theme }) => ({
    top: 0,
    left: 0,
    zIndex: 99,
    width: "100%",
    display: "flex",
    position: "absolute",
    alignItems: "center",
    height: APPBAR_MOBILE,
    backdropFilter: "blur(6px)",
    WebkitBackdropFilter: "blur(6px)", // Fix on Mobile
    padding: theme.spacing(0, 3),
    boxShadow: theme.customShadows.z8,
    backgroundColor: `${alpha(theme.palette.background.default, 0.72)}`,
    [theme.breakpoints.up("md")]: {
        height: APPBAR_DESKTOP,
        padding: theme.spacing(0, 5),
    },
}));

const Styledbox = styled("div")(({}) => ({
    height: "auto",
    maxHeight: 500,
    overflowY: "scroll",
    "&::-webkit-scrollbar": {
        width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
        backgroundColor: "#707070",
        borderRadius: "6px",
        padding: "2px",
    },
}));
// ----------------------------------------------------------------------

export default function Searchbar() {
    const [value, setValue] = React.useState();
    const navigate = useNavigate();
    const baseRoute = getRouteWithLang();
    const StyledPath = styled("div")(({ theme }) => ({
        color: theme.palette.grey[400],
    }));
    const [isOpen, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen((prev) => !prev);
    };
    const handleChange = (event, newValue) => {
        handleClose();
        navigate(`${baseRoute + newValue.path}`);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box>
                {!isOpen && (
                    <IconButton onClick={handleOpen}>
                        <Iconify
                            icon="eva:search-fill"
                            width={20}
                            height={20}
                        />
                    </IconButton>
                )}
                <Slide direction="down" in={isOpen} mountOnEnter unmountOnExit>
                    <SearchbarStyle>
                        <Autocomplete
                            value={value}
                            onChange={handleChange}
                            id="search_bar"
                            options={navConfig}
                            sx={{
                                width: "100%",
                                mr: 1,
                                fontWeight: "fontWeightBold",
                            }}
                            ListboxComponent={Styledbox}
                            getOptionLabel={(option) => option.title ?? null}
                            renderOption={(props, option) => (
                                <li {...props}>
                                    <Box>
                                        <FormattedMessage id={option.title} />
                                        <StyledPath>{option.path}</StyledPath>
                                    </Box>
                                </li>
                            )}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    autoFocus
                                    variant="standard"
                                    placeholder="Search..."
                                    InputProps={{
                                        ...params.InputProps,
                                        disableUnderline: true,
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Iconify
                                                icon="eva:search-fill"
                                                sx={{
                                                    color: "text.disabled",
                                                    width: 20,
                                                    height: 20,
                                                }}
                                            />
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                    </SearchbarStyle>
                </Slide>
            </Box>
        </ClickAwayListener>
    );
}
