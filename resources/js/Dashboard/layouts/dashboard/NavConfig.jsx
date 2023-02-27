// component
import Iconify from "../../components/Iconify";
import * as React from "react";

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const navConfig = [
    {
        title: "dashboard",
        path: "/app",
        icon: getIcon("eva:pie-chart-2-fill"),
    },
    {
        title: "users",
        path: "/users",
        icon: getIcon("eva:people-fill"),
    },
    // {
    //     title: "products",
    //     path: "/products",
    //     icon: getIcon("eva:shopping-bag-fill"),
    // },
    // {
    //     title: "categories",
    //     path: "/categories",
    //     icon: getIcon("carbon:categories"),
    // },
];

export default navConfig;
