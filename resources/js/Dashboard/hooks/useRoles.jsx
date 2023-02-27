import { useAuth } from "../context/auth-context";
import React from "react";

export default function useRoles() {
    const { user } = useAuth();

    const checkIfRolesInUserRoles = (roles) => {
        if (user?.roles && roles?.length > 0) {
            return roles?.some((role) => user?.roles?.includes(role));
        }
        return false;
    };

    return { checkIfRolesInUserRoles };
}
