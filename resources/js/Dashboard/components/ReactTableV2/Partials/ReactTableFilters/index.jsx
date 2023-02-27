import Iconify from "../../../Iconify";
import useQueryParams from "../../../../hooks/useQueryParams";
import { Button, InputAdornment, OutlinedInput } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const SearchStyle = styled(OutlinedInput)(({ theme }) => ({
    width: 240,
    transition: theme.transitions.create(["box-shadow", "width"], {
        easing: theme.transitions.easing.easeInOut,
        duration: theme.transitions.duration.shorter,
    }),
    "&.Mui-focused": { width: 320, boxShadow: theme.customShadows.z8 },
    "& fieldset": {
        borderWidth: `1px !important`,
        borderColor: `${theme.palette.grey[500_32]} !important`,
        padding: "20px",
    },
}));

export function GlobalFilter({ globalFilter, setGlobalFilter }) {
    const { getQueryParams, removeQueryParams, setQueryParams } =
        useQueryParams();

    const [value, setValue] = React.useState(
        getQueryParams("query") ? getQueryParams("query") : globalFilter
    );
    const onChange = (value) => {
        setGlobalFilter(value || "");
    };

    const handleSearchChange = (value) => {
        value ? setQueryParams("query", value) : removeQueryParams("query");
    };
    return (
        <>
            <SearchStyle
                value={value || ""}
                onChange={(e) => {
                    setValue(e.target.value);
                    onChange(e.target.value);
                }}
                onKeyPress={(e) =>
                    e.key === "Enter" && handleSearchChange(value)
                }
                placeholder={`Search...`}
                startAdornment={
                    <InputAdornment position="start">
                        <Iconify
                            icon="eva:search-fill"
                            sx={{ color: "text.disabled" }}
                        />
                    </InputAdornment>
                }
                endAdornment={
                    <Button
                        onClick={() => {
                            handleSearchChange(value);
                        }}
                    >
                        ok
                    </Button>
                }
            />
        </>
    );
}
