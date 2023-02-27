import ReactDOM from "react-dom/client";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { AppProviders } from "./context";
import App from "./app";

ReactDOM.createRoot(document.getElementById("root")).render(
    <HelmetProvider>
        <AppProviders>
            <App />
        </AppProviders>
    </HelmetProvider>
);
