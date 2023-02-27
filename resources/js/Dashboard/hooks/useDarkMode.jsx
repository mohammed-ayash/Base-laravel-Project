import { useRecoilState } from "recoil";
import { atomTheme } from "../config";

export default () => {
    const [theme, setTheme] = useRecoilState(atomTheme);

    const saveTheme = (chosenTheme) => {
        setTheme(chosenTheme);
        window.localStorage.setItem("THEME", chosenTheme);
    };

    const toggleTheme = () => {
        saveTheme(theme === "light" ? "dark" : "light");
    };

    return { theme, toggleTheme };
};
