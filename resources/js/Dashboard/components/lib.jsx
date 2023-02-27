import { FormattedMessage } from "react-intl";
import { useRouteError } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

import * as colors from "../styles/colors";

const Spinner = () => (
    <Box sx={{ display: "flex" }}>
        <CircularProgress />
    </Box>
);

function FullPageSpinner() {
    return (
        <div
            css={{
                fontSize: "4em",
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#1890FF",
            }}
        >
            <Spinner />
        </div>
    );
}

function ModalSpinner() {
    return (
        <div
            css={{
                fontSize: "4em",
                display: "flex",
                height: "30vh",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                color: "#1890FF",
            }}
        >
            <Spinner />
        </div>
    );
}

function FullPageErrorFallback() {
    // const error = useRouteError();
    return (
        <div
            role="alert"
            css={{
                color: colors.danger,
                height: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            <p>
                ERROR
                {/* <FormattedMessage id="full_page_error" /> */}
            </p>
            {/* <pre>{error?.message}</pre> */}
        </div>
    );
}

export { FullPageErrorFallback, FullPageSpinner, ModalSpinner };
