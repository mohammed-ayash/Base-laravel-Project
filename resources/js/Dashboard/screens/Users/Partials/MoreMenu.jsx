import ConfirmationModal from "@/components/ConfirmationModal";
import Iconify from "@/components/Iconify";
import { StyledMenuItem } from "@/components/StyledComponents";
import { useClient } from "@/context/auth-context";
import {
    errorWithCustomMessage,
    successWithCustomMessage,
} from "@/utils/notifications";
import { getRouteWithLang } from "@/utils/routesHelpers";
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import queryString from "query-string";
import * as React from "react";
import { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import EditPassword from "./EditPassword";
// ----------------------------------------------------------------------

export default function MoreMenu({ id, fullName }) {
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const [editPassword, setEditPassword] = React.useState(false);
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const client = useClient();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    let query =
        "user=" +
        queryString.stringify({
            id: id,
            fullName: fullName,
        });
    let route = getRouteWithLang("/sale-orders");
    const { mutate: handleRemoveClick, isLoading } = useMutation(
        ({ id }) => client(`users/${id}`, { method: "DELETE" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("users");
                setIsOpen(false);
                successWithCustomMessage("delete_success_msg");
            },
            onError: (data) => {
                if (!data.success) {
                    errorWithCustomMessage(data?.error);
                }
                setIsOpen(false);
            },
        }
    );

    return (
        <>
            {openConfirmation && (
                <ConfirmationModal
                    isLoading={isLoading}
                    onSave={() => {
                        handleRemoveClick({ id });
                        setOpenConfirmation(false);
                    }}
                    closeConfirmation={() => {
                        setOpenConfirmation(false);
                    }}
                    message={<FormattedMessage id="delete_user" />}
                    confirmation={openConfirmation}
                />
            )}
            {editPassword && (
                <EditPassword
                    id={id}
                    confirmation={editPassword}
                    closeConfirmation={() => setEditPassword(false)}
                />
            )}
            <IconButton ref={ref} onClick={() => setIsOpen(true)}>
                <Iconify icon="eva:more-vertical-fill" width={20} height={20} />
            </IconButton>

            <Menu
                open={isOpen}
                anchorEl={ref.current}
                onClose={() => setIsOpen(false)}
                PaperProps={{
                    sx: { width: 200, maxWidth: "100%" },
                }}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <MenuItem
                    component={RouterLink}
                    to={`${id}`}
                    sx={{ color: "text.secondary" }}
                >
                    <ListItemIcon>
                        <Iconify icon="mdi:show" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText
                        primary={<FormattedMessage id="show" />}
                        primaryTypographyProps={{ variant: "body2" }}
                    />
                </MenuItem>

                <MenuItem
                    component={RouterLink}
                    to={`${id}/edit`}
                    sx={{ color: "text.secondary" }}
                >
                    <ListItemIcon>
                        <Iconify icon="eva:edit-fill" width={24} height={24} />
                    </ListItemIcon>
                    <ListItemText
                        primary={<FormattedMessage id="edit" />}
                        primaryTypographyProps={{ variant: "body2" }}
                    />
                </MenuItem>

                <MenuItem
                    onClick={() => setEditPassword(true)}
                    sx={{ color: "text.secondary" }}
                >
                    <ListItemIcon>
                        <Iconify
                            icon="ph:user-circle-gear-fill"
                            width={24}
                            height={24}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={<FormattedMessage id="edit_password" />}
                        primaryTypographyProps={{ variant: "body2" }}
                    />
                </MenuItem>

                <MenuItem
                    onClick={() => {
                        navigate(`${route}?${query}`);
                    }}
                    sx={{ color: "text.secondary" }}
                >
                    <ListItemIcon>
                        <Iconify
                            icon="icon-park-outline:transaction-order"
                            width={24}
                            height={24}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={<FormattedMessage id="sale_orders" />}
                        primaryTypographyProps={{ variant: "body2" }}
                    />
                </MenuItem>

                <StyledMenuItem onClick={() => setOpenConfirmation(true)}>
                    <ListItemIcon>
                        <Iconify
                            icon="eva:trash-2-outline"
                            width={24}
                            height={24}
                        />
                    </ListItemIcon>
                    <ListItemText
                        primary={<FormattedMessage id="delete" />}
                        primaryTypographyProps={{ variant: "body2" }}
                    />
                </StyledMenuItem>
            </Menu>
        </>
    );
}
