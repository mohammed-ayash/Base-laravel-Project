import ConfirmationModal from "@/components/ConfirmationModal";
import Iconify from "@/components/Iconify";
import { useClient } from "@/context/auth-context";
import {
    errorWithCustomMessage,
    successWithCustomMessage,
} from "@/utils/notifications";
import {
    IconButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
} from "@mui/material";
import * as React from "react";
import { useRef, useState } from "react";
import { FormattedMessage } from "react-intl";
import { useMutation, useQueryClient } from "react-query";
import { Link as RouterLink } from "react-router-dom";
import { StyledMenuItem } from "@/components/StyledComponents";

// ----------------------------------------------------------------------

export default function MoreMenu({ id, row }) {
    const [openConfirmation, setOpenConfirmation] = React.useState(false);
    const ref = useRef(null);
    const [isOpen, setIsOpen] = useState(false);
    const client = useClient();
    const queryClient = useQueryClient();
    const { mutate: handleRemoveClick, isLoading } = useMutation(
        ({ id }) => client(`sliders/${id}`, { method: "DELETE" }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries("sliders");
                successWithCustomMessage("delete_success_msg");
                setIsOpen(false);
            },
            onError: (data) => {
                errorWithCustomMessage(data?.error);
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
                    message={<FormattedMessage id="delete_slider" />}
                    confirmation={openConfirmation}
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
