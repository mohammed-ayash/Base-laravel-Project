import React from "react";
import PropTypes from "prop-types";
import { useLayoutEffect, useMemo } from "react";
// material
import { CssBaseline } from "@mui/material";
import {
    ThemeProvider,
    createTheme,
    StyledEngineProvider,
} from "@mui/material/styles";
//
import palette from "./palette";
import { dark, light } from "./palette";
import typography from "./typography";
import componentsOverride from "./overrides";
import shadows, { customShadows } from "./shadows";

import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { prefixer } from "stylis";
import useDarkMode from "../hooks/useDarkMode";
import useLang from "../hooks/useLang";

const cacheLtr = createCache({
    key: "muiltr",
});

const cacheRtl = createCache({
    key: "muirtl",
    // prefixer is the only stylis plugin by default, so when
    // overriding the plugins you need to include it explicitly
    // if you want to retain the auto-prefixing behavior.
    stylisPlugins: [prefixer, rtlPlugin],
});
// ----------------------------------------------------------------------

ThemeConfig.propTypes = {
    children: PropTypes.node,
};

export default function ThemeConfig({ children }) {
    const { theme: themeInfo } = useDarkMode();
    const { lang } = useLang();

    useLayoutEffect(() => {
        document.body.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    }, []);

    const themeOptions = useMemo(
        () => ({
            direction: lang === "ar" ? "rtl" : "ltr",
            palette: themeInfo === "dark" ? dark : light,
            shape: { borderRadius: 8 },
            typography,
            shadows: themeInfo === "dark" ? shadows.dark : shadows.light,
            customShadows:
                themeInfo === "dark" ? customShadows.dark : customShadows.light,
        }),
        [themeInfo, lang]
    );

    const theme = createTheme(themeOptions);
    theme.components = componentsOverride(theme);

    return (
        <StyledEngineProvider injectFirst>
            <CacheProvider value={lang === "ar" ? cacheRtl : cacheLtr}>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    {children}
                </ThemeProvider>
            </CacheProvider>
        </StyledEngineProvider>
    );
}
