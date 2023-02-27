import { atom } from "recoil";
import { supportedLanguages } from "./constants";

let defaultTheme = "light";
if (typeof window !== "undefined") {
    const savedTheme = window.localStorage.getItem("THEME"); // save the users prefered mode
    if (savedTheme) {
        defaultTheme = savedTheme;
    } else {
        const isDarkMode =
            window.matchMedia &&
            window.matchMedia("(prefers-color-scheme: dark)").matches; //get the default prefered mode
        defaultTheme = isDarkMode ? "dark" : "light";
    }
}

export const atomTheme = atom({
    key: "theme",
    default: defaultTheme,
});
let defaultLang = "en";
if (typeof window !== "undefined") {
    const savedLang = window.location.pathname.split("/")[2]; // save the users prefered mode
    if (savedLang && supportedLanguages.includes(savedLang)) {
        defaultLang = savedLang;
    } else {
        defaultLang = "en";
    }
}

export const atomLang = atom({
    key: "lang",
    default: defaultLang,
});
