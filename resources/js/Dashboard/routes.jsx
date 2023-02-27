import * as React from "react";
import { Link, Navigate, createBrowserRouter } from "react-router-dom";
import { FullPageErrorFallback } from "@/components/lib";

// layouts
import LogoOnlyLayout from "./layouts/LogoOnlyLayout";
import DashboardLayout from "./layouts/dashboard";
import NotFound from "./screens/Page404";

// Categories
import Categories from "./screens/Categories";
import AddCategory from "./screens/Categories/Add";
import EditCategory from "./screens/Categories/EditCategory";

// Users
import Users from "./screens/Users";
import AddUsers from "./screens/Users/Add";
import EditUser from "./screens/Users/EditUser";
import ShowUser from "./screens/Users/ShowUser";

import { defaultLang, supportedLanguages } from "./constants";

// ----------------------------------------------------------------------
const checkLangBeforeLoading = ({ params }) => {
    const lang = params?.lang ?? defaultLang;
    const isSupported = supportedLanguages.includes(lang);
    if (!isSupported) {
        const currLangRout = `/${lang}`;
        const ReplacedRout = `/${defaultLang}`;
        window.location.replace(
            window.location.pathname.replace(currLangRout, ReplacedRout)
        );
    }
    return isSupported;
};
const useRouter = () => {
    return createBrowserRouter([
        {
            path: "/:lang",
            element: <DashboardLayout />,
            errorElement: <FullPageErrorFallback />,
            loader: checkLangBeforeLoading,
            handle: {
                crumb: () => <Link to="/">dashboard</Link>,
            },
            children: [
                // {
                //     path: "categories",
                //     handle: {
                //         crumb: () => <Link to="/categories">categories</Link>,
                //     },
                //     children: [
                //         {
                //             index: true,
                //             element: <Categories />,
                //         },
                //         {
                //             path: "add",
                //             element: <AddCategory />,
                //             handle: {
                //                 crumb: () => (
                //                     <Link to="/add">create_category</Link>
                //                 ),
                //             },
                //         },
                //         {
                //             path: ":id/edit",
                //             element: <EditCategory />,
                //             handle: {
                //                 crumb: () => (
                //                     <Link to="/:id/edit">update_category</Link>
                //                 ),
                //             },
                //         },
                //     ],
                // },

                // {
                //     path: "products",
                //     handle: {
                //         crumb: () => <Link to="/products">products</Link>,
                //     },
                //     children: [
                //         {
                //             element: <></>,
                //             index: true,
                //         },
                //         {
                //             path: "add",
                //             element: <></>,
                //             handle: {
                //                 crumb: () => <Link to="/add">new_product</Link>,
                //             },
                //         },
                //         {
                //             path: ":id/edit",
                //             element: <></>,
                //             handle: {
                //                 crumb: () => (
                //                     <Link to="/:id/edit">edit_product</Link>
                //                 ),
                //             },
                //         },
                //     ],
                // },

                {
                    path: "users",
                    handle: {
                        crumb: () => <Link to="/users">users</Link>,
                    },
                    children: [
                        { index: true, element: <Users /> },
                        {
                            path: "add",
                            element: <AddUsers />,
                            handle: {
                                crumb: () => <Link to="/add">new_user</Link>,
                            },
                        },
                        {
                            path: ":id/edit",
                            element: <EditUser />,
                            handle: {
                                crumb: () => (
                                    <Link to="/:id/edit">edit_user</Link>
                                ),
                            },
                        },
                        {
                            path: ":id",
                            element: <ShowUser />,
                            handle: {
                                crumb: () => <Link to="/:id">show_user</Link>,
                            },
                        },
                    ],
                },
                {
                    path: "app",
                    element: <>app</>,
                    handle: {
                        crumb: () => <Link to="/app">app</Link>,
                    },
                },
            ],
        },
        {
            path: "/",
            element: <LogoOnlyLayout />,
            children: [
                { path: "404", element: <NotFound /> },
                {
                    path: "/",
                    element: <Navigate to={`/${defaultLang}/app`} replace />,
                },
                {
                    path: "*",
                    element: <Navigate to="/404" replace />,
                },
            ],
        },
    ]);
};

export default useRouter;
