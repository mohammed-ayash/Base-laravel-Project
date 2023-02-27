import * as React from "react";
import Iconify from "@/components/Iconify";
import { useClient } from "@/context/auth-context";
import { IconButton } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import ConfirmationModal from "@/components/ConfirmationModal";
import { error as errorTost } from "@/utils/notifications";
import { successWithCustomMessage } from "@/utils/notifications";

// ----------------------------------------------------------------------

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.error.main,
}));

// ----------------------------------------------------------------------

export default function CategoryActions({ row }) {
    const navigate = useNavigate();
    let { id } = row;
    const client = useClient();
    const queryClient = useQueryClient();
    const [openConfirmation, setOpenConfirmation] = React.useState(false);

    const { mutate: handleRemoveClick, isLoading } = useMutation(
        ({ id }) => client(`categories/${id}`, { method: "DELETE" }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("categories");
                successWithCustomMessage("delete_success_msg");
            },
            onError: (data) => {
                const error = data?.error ?? "";
                errorTost(error);
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
                    message={<FormattedMessage id="delete_category" />}
                    confirmation={openConfirmation}
                />
            )}
            <StyledDiv>
                <IconButton
                    onClick={() => navigate(`${id}/edit`, { state: row })}
                >
                    <Iconify icon="eva:edit-fill" width={24} height={24} />
                </IconButton>
                <IconButton onClick={() => navigate(`add`, { state: row })}>
                    <Iconify icon="eva:plus-fill" width={24} height={24} />
                </IconButton>
                <StyledIconButton onClick={() => setOpenConfirmation(true)}>
                    <Iconify
                        icon="ic:twotone-delete-outline"
                        width={24}
                        height={24}
                    />
                </StyledIconButton>
            </StyledDiv>
        </>
    );
}

const StyledDiv = styled("div")(() => ({
    display: "flex",
}));
