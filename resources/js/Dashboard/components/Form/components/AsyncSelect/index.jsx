/* eslint-disable no-use-before-define */
import React, { useState, useEffect } from "react";
import useStyles from "./style";
import { Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useTheme } from "@mui/material/styles";
import { useClient } from "../../../../context/auth-context";
import { CircularProgress, TextField } from "@mui/material";
import { VariableSizeList as List } from "react-window";
import useMediaQuery from "@mui/material/useMediaQuery";
import ListSubheader from "@mui/material/ListSubheader";
import Typography from "@mui/material/Typography";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "react-query";
import queryString from "query-string";
import { styled } from "@mui/material/styles";

const StyledDiv = styled("div")(({ theme }) => ({
    "> div": {
        direction: `inherit !important`,
    },
}));

const LISTBOX_PADDING = 8;

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef((props, ref) => {
    const outerProps = React.useContext(OuterElementContext);
    return <div ref={ref} {...props} {...outerProps} />;
});

function useResetCache(data) {
    const ref = React.useRef(null);
    React.useEffect(() => {
        if (ref.current != null) {
            ref.current.resetAfterIndex(0, true);
        }
    }, [data]);
    return ref;
}
//not arrive
const renderOptionRow = (props, optionLabel, getLabel = null) => {
    const { data, index, style } = props;
    const dataSet = data[index];
    const inlineStyle = {
        ...style,
        top: style.top + LISTBOX_PADDING,
    };
    if (dataSet.hasOwnProperty("group")) {
        return (
            <ListSubheader
                key={`${dataSet.key}-${index}`}
                component="div"
                style={inlineStyle}
            >
                {dataSet.group}
            </ListSubheader>
        );
    }
    const label = getLabel ? getLabel(dataSet[1]) : dataSet[1][optionLabel];
    return (
        <Typography
            component="li"
            {...dataSet[0]}
            key={`${dataSet[0]?.key}-${index}`}
            noWrap
            style={inlineStyle}
        >
            {label}
            {/* {'TEST'} */}
        </Typography>
    );
};
const ListBoxComponent = React.forwardRef(function ListboxComponent(
    props,
    ref
) {
    const { children, onItemsRendered, optionLabel, getLabel, ...other } =
        props;
    const itemData = [];
    children.forEach((item) => {
        itemData.push(item);
        itemData.push(...(item.children || []));
    });
    const theme = useTheme();
    const smUp = useMediaQuery(theme.breakpoints.up("sm"), {
        noSsr: true,
    });

    const itemCount = itemData.length;
    const itemSize = smUp ? 36 : 48;

    const getChildSize = (child) => {
        if (child.hasOwnProperty("group")) {
            return 48;
        }

        return itemSize;
    };

    const getHeight = () => {
        if (itemCount > 8) {
            return 8 * itemSize;
        }
        return itemData.map(getChildSize).reduce((a, b) => a + b, 0);
    };

    const gridRef = useResetCache(itemCount);

    return (
        <StyledDiv ref={ref}>
            <OuterElementContext.Provider value={other}>
                <List
                    itemData={itemData}
                    height={getHeight() + 2 * LISTBOX_PADDING}
                    width="100%"
                    ref={gridRef}
                    outerElementType={OuterElementType}
                    innerElementType="ul"
                    itemSize={(index) => getChildSize(itemData[index])}
                    overscanCount={10}
                    itemCount={itemCount}
                    onItemsRendered={onItemsRendered}
                >
                    {(props) => renderOptionRow(props, optionLabel, getLabel)}
                </List>
            </OuterElementContext.Provider>
        </StyledDiv>
    );
});

export default function AsyncSelect({
    title,
    name,
    width,
    optionUrl,
    control,
    errors,
    handleChange,
    multiple = false,
    optionLabel = "label",
    getLabel = null,
    disabled = false,
    removeItems = [],
}) {
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [nextPage, setNextPage] = useState(undefined);
    const [pages, setPages] = useState(undefined);
    const [searchQuarry, setSearchQuarry] = useState(undefined);
    const loading = open && options.length === 0;
    const client = useClient();

    const fetchDataOptions = {
        page: nextPage ?? 1,
        limit: 10,
        name: searchQuarry,
    };

    const { isLoading, isRefetching, data, refetch } = useQuery(
        [`${title}-AsyncSelect`, fetchDataOptions],
        () =>
            client(
                `${optionUrl}?${queryString.stringify(fetchDataOptions)}`
            ).then((data) => {
                const resp = data?.pagination ?? data.data;
                if (data.pagination) {
                    setNextPage(resp?.page + 1);
                    setPages(resp?.pages);
                    setOptions([
                        ...options,
                        ...(resp?.items.length > 0
                            ? removeOptions(resp?.items)
                            : []),
                    ]);
                } else
                    setOptions([
                        ...(resp.length > 0 ? removeOptions(resp) : []),
                    ]);
                if (removeItems.length > 0) {
                }
            }),
        { refetchOnWindowFocus: false, enabled: false }
    );
    const removeOptions = (options) => {
        if (removeItems && removeItems?.length > 0) {
            let arrayOfItemsIds = removeItems.map((a) => a?.product?.id);
            let newOptions = options.filter((item) => {
                return !arrayOfItemsIds.includes(item.id);
            });
            return newOptions;
        } else return options;
    };

    useEffect(() => {
        const canFetch =
            open && ((nextPage && pages >= nextPage) || pages === void 0);
        if (canFetch) {
            refetch();
        }
    }, [open]);

    useEffect(() => {
        const isFetching = isLoading || isRefetching;
        const canFetch = (nextPage && pages >= nextPage) || pages === void 0;
        if (open && !isFetching && canFetch) {
            refetch();
        }
    }, [searchQuarry]);

    const resetPaginationData = () => {
        setNextPage(undefined);
        setPages(undefined);
        setOptions([]);
    };

    const inputRender = (params = {}) => {
        const onInputChange = (event) => {
            event.preventDefault();
            resetPaginationData();
            setSearchQuarry(event.target.value);
        };
        return (
            <TextField
                {...params}
                label={<FormattedMessage id={title} />}
                className={classes.input}
                error={Boolean(errors[name] && errors[name])}
                helperText={
                    errors[name] && (
                        <FormattedMessage id={errors[name].message} />
                    )
                }
                InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                        <React.Fragment>
                            {loading && isLoading ? (
                                <CircularProgress color="inherit" size={20} />
                            ) : loading && !isLoading ? (
                                <FormattedMessage id="no_options_found" />
                            ) : null}
                            {params.InputProps.endAdornment}
                        </React.Fragment>
                    ),
                }}
                onChange={onInputChange}
            />
        );
    };
    return (
        <Controller
            control={control}
            name={name}
            render={({ field: { onChange, value } }) => {
                return (
                    <Autocomplete
                        sx={{ flexBasis: !!width ? width : "100%" }}
                        multiple={multiple}
                        disabled={disabled}
                        open={open}
                        value={!!value ? value : ""}
                        defaultValue={[]}
                        loading={isLoading || isRefetching}
                        options={options}
                        onOpen={() => {
                            setOpen(true);
                        }}
                        onClose={() => {
                            setOpen(false);
                        }}
                        disableListWrap
                        isOptionEqualToValue={(option, value) => {
                            return getLabel
                                ? getLabel(option) === getLabel(value)
                                : option[optionLabel] === value[optionLabel];
                        }}
                        getOptionLabel={(option) => {
                            return getLabel
                                ? getLabel(option)
                                : option[optionLabel] ?? "";
                        }}
                        renderInput={(params) => inputRender(params, onChange)}
                        onChange={(event, values, reason) => {
                            handleChange
                                ? handleChange(event, values, reason)
                                : onChange(values);
                        }}
                        renderOption={(props, option) => [props, option]}
                        renderGroup={(params) => params}
                        ListboxComponent={ListBoxComponent}
                        ListboxProps={{
                            optionLabel: optionLabel,
                            getLabel: getLabel,
                            onItemsRendered: ({
                                visibleStopIndex,
                                overscanStopIndex,
                            }) => {
                                const isFetching = isLoading || isRefetching;
                                const canFetch =
                                    visibleStopIndex === overscanStopIndex &&
                                    pages >= nextPage;
                                if (canFetch && !isFetching) {
                                    refetch();
                                }
                            },
                        }}
                    />
                );
            }}
        />
    );
}
