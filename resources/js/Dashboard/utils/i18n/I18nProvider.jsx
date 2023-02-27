import React from "react";
import { IntlProvider } from "react-intl";

import enMessages from "./messages/en";
import arMessages from "./messages/ar";
import useLang from "@/hooks/useLang";

const allMessages = {
    en: enMessages,
    ar: arMessages,
};

export function I18nProvider({ children }) {
    const { lang } = useLang();
    const messages = allMessages[lang];

    return (
        <IntlProvider locale={lang} messages={messages}>
            {children}
        </IntlProvider>
    );
}
