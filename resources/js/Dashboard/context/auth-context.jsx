import * as React from "react";
import { QueryClient } from "react-query";
import * as auth from "../auth-provider";
import { client } from "../utils/api-client";
import { useAsync } from "@/utils/hooks";
import { FullPageSpinner, FullPageErrorFallback } from "../components/lib";
import useLang from "../hooks/useLang";

async function bootstrapAppData() {
    const queryCache = new QueryClient();
    let user = null;

    const token = await auth?.getToken();
    if (token) {
        const data = await client(`users/profile`, { token });
        queryCache.setQueryData("user", data?.data?.user, {
            staleTime: 5000,
        });
        user = {
            ...data?.data?.user,
            token,
        };
    }
    return user;
}

const AuthContext = React.createContext();
AuthContext.displayName = "AuthContext";

function AuthProvider(props) {
    const {
        data: user,
        status,
        error,
        isLoading,
        isIdle,
        isError,
        isSuccess,
        run,
        setData,
    } = useAsync();
    const queryCache = new QueryClient();

    React.useEffect(() => {
        const appDataPromise = bootstrapAppData();
        run(appDataPromise);
    }, [run]);

    const refreshUser = () => {
        const appDataPromise = bootstrapAppData();
        run(appDataPromise);
    };
    const login = React.useCallback(
        (form) =>
            auth.login(form).then((user) => {
                setData({ ...user });
            }),
        [setData]
    );
    const register = React.useCallback(
        (form) => auth.register(form).then((user) => setData({ ...user })),
        [setData]
    );
    const logout = React.useCallback(() => {
        auth.logout();
        queryCache.clear();
        setData(null);
    }, [setData]);

    const value = React.useMemo(
        () => ({ user, login, logout, register, refreshUser }),
        [login, logout, register, user, refreshUser]
    );

    if (isLoading || isIdle) {
        return <FullPageSpinner />;
    }

    if (isError) {
        return <FullPageErrorFallback error={error} />;
    }

    if (isSuccess) {
        return <AuthContext.Provider value={value} {...props} />;
    }

    throw new Error(`Unhandled status: ${status}`);
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === undefined) {
        throw new Error(`useAuth must be used within a AuthProvider`);
    }
    return context;
}

function useClient() {
    const { user } = useAuth();
    const token = user?.token;
    const { lang } = useLang();
    const headers = {
        "x-locale": lang,
    };
    return React.useCallback(
        (endpoint, config) => client(endpoint, { ...config, headers, token }),
        [token, lang]
    );
}

export { AuthProvider, useAuth, useClient };
