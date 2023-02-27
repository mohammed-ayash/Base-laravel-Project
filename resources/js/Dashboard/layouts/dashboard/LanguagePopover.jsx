import * as React from "react";
import { useRef, useState } from "react";
// material
import { Box, IconButton, MenuItem, Stack } from "@mui/material";
import { alpha } from "@mui/material/styles";
// components
import MenuPopover from "../../components/MenuPopover";
import { useParams } from "react-router-dom";
import { defaultLang, supportedLanguages } from "../../constants";

// ----------------------------------------------------------------------

const LANGS = {
    en: {
        value: "en",
        label: "English",
        icon: "/static/icons/ic_flag_en.svg",
    },
    ar: {
        value: "ar",
        label: "Arabic",
        icon: "/static/icons/sa.svg",
    },
};

// ----------------------------------------------------------------------

export default function LanguagePopover() {
    const params = useParams();
    const isSupported = supportedLanguages.includes(params?.lang);
    const lang = isSupported ? params?.lang : defaultLang;
    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleChange = (changeLang) => {
        const currLangRout = "/" + lang + "/";
        const ReplacedRout = "/" + changeLang + "/";
        window.location.replace(
            window.location.pathname.replace(currLangRout, ReplacedRout)
        );
        setOpen(false);
    };

    return (
        <>
            <IconButton
                ref={anchorRef}
                onClick={handleOpen}
                sx={{
                    padding: 0,
                    width: 44,
                    height: 44,
                    ...(open && {
                        bgcolor: (theme) =>
                            alpha(
                                theme.palette.primary.main,
                                theme.palette.action.focusOpacity
                            ),
                    }),
                }}
            >
                <img
                    style={{ width: lang === "ar" ? "80%" : "" }}
                    src={LANGS[lang].icon}
                    alt={LANGS[lang].label}
                />
            </IconButton>

            <MenuPopover
                open={open}
                onClose={handleClose}
                anchorEl={anchorRef.current}
                sx={{
                    mt: 1.5,
                    marginLeft: lang === "en" ? "4px" : "0",
                    marginRight: lang === "ar" ? "72px" : "0",
                    width: 180,
                    "& .MuiMenuItem-root": {
                        px: 1,
                        typography: "body2",
                        borderRadius: 0.75,
                    },
                }}
            >
                <Stack spacing={0.75}>
                    {Object.keys(LANGS).map((key) => {
                        const option = LANGS[key];
                        return (
                            <MenuItem
                                key={option.value}
                                selected={option.value === lang}
                                onClick={() => handleChange(option.value)}
                            >
                                <Box
                                    component="img"
                                    alt={option.label}
                                    src={option.icon}
                                    sx={{ width: 28, mr: 2 }}
                                />

                                {option.label}
                            </MenuItem>
                        );
                    })}
                </Stack>
            </MenuPopover>
        </>
    );
}
