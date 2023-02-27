import { useRecoilState } from "recoil";
import { atomLang } from "../config";
import { supportedLanguages, defaultLang } from "../constants";

export default () => {
    const langFromPath = window.location.pathname.split("/")[2];
    const isSupported = supportedLanguages.includes(langFromPath);
    const [lang, setLang] = useRecoilState(atomLang);

    const saveLang = (chosenLang) => {
        window.location.reload();
        // setLang(chosenLang)
        window.localStorage.setItem("lang", chosenLang);
    };

    return { lang: isSupported ? langFromPath : defaultLang, saveLang };
};
