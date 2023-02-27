import * as React from "react";
import { useAuth } from "./context/auth-context";
// theme
import ThemeConfig from "./theme";
import GlobalStyles from "./theme/globalStyles";
// components
import { I18nProvider } from "./utils/i18n";
import { RecoilRoot } from "recoil";
import AuthenticatedApp from "./authenticated-app";
import UnauthenticatedApp from "./unauthenticated-app";

function App() {
    const { user } = useAuth();
    return (
        <RecoilRoot>
            <ThemeConfig>
                <I18nProvider>
                    <GlobalStyles />
                    {user ? <AuthenticatedApp /> : <UnauthenticatedApp />}
                </I18nProvider>
            </ThemeConfig>
        </RecoilRoot>
    );
}
export default App;
