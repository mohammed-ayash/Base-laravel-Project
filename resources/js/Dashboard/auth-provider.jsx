const localStorageKey = "__auth_provider_token__";
import axios from "axios";

async function getToken() {
    return window.localStorage.getItem(localStorageKey);
}

function handleUserResponse(user) {
    window.localStorage.setItem(localStorageKey, user?.token);
    return {
        ...user?.admin,
        token: user.token,
    };
}

function login({ email, password }) {
    return client("admin/login", { email, password }).then(handleUserResponse);
}

function register(user) {
    return client("register", {
        ...user,
    }).then(handleUserResponse);
}

async function logout() {
    window.localStorage.removeItem(localStorageKey);
}

const authURL = `${window.location.origin}/api`;

async function client(endpoint, data) {
    const config = {
        url: `${authURL}/${endpoint}`,
        method: "POST",
        data: data,
        headers: {
            "Content-Type": "application/json",
        },
    };

    return axios(config).then(async (response) => {
        if (response.status === 200) {
            return response?.data?.content;
        } else {
            return Promise.reject(data);
        }
    });
}

export { getToken, login, register, logout, localStorageKey };
