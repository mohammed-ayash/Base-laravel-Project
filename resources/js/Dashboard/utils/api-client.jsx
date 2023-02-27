import { QueryCache } from "react-query";
import * as auth from "../auth-provider";
const apiURL = `${window.location.origin}/api`;
import axios from "axios";

async function client(
    endpoint,
    { data, token, headers: customHeaders, ...customConfig } = {}
) {
    const queryCache = new QueryCache();
    const config = {
        url: `${apiURL}/${endpoint}`,
        method: data ? "POST" : "GET",
        data: data ? data : undefined,
        headers: {
            Authorization: token ? `Bearer ${token}` : undefined,
            "Content-Type": data ? "application/json" : undefined,
            ...customHeaders,
        },
        ...customConfig,
    };

    return axios(config).then(async (response) => {
        if (response.status === 401) {
            queryCache.clear();
            await auth.logout();
            // refresh the page for them
            window.location.assign(window.location);
            return Promise.reject({ message: "Please re-authenticate." });
        }
        const data = await response;
        if (response.status === 200) {
            return data;
        } else {
            return Promise.reject(data);
        }
    });
}

export { client };
