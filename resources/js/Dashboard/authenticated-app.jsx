import React from "react";
import { ToastContainer, toast } from "react-toastify";
import useLang from "./hooks/useLang";
import { useTheme } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import useRouter from "./routes";

function AuthenticatedApp() {
    const { lang } = useLang();
    const { palette } = useTheme();
    const Router = useRouter();
    return (
        <>
            <RouterProvider router={Router} />
            <ToastContainer
                position={
                    lang === "ar"
                        ? toast.POSITION.BOTTOM_LEFT
                        : toast.POSITION.BOTTOM_RIGHT
                }
                theme={palette?.mode}
            />
        </>
    );
}

export default AuthenticatedApp;
