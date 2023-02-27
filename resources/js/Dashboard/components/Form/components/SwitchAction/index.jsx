import { Switch } from "@mui/material";
import ConfirmationModal from "../../../ConfirmationModal";
import { useClient } from "../../../../context/auth-context";
import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { useMutation, useQueryClient } from "react-query";

//TODO Mutate Object + cleaning
function SwitchAction({ value, row, method, endPoint, queryName, btnName }) {
    const [checked, setChecked] = useState(value === 2 ? true : false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const client = useClient();
    const queryClient = useQueryClient();

    const handleConfirmation = () => {
        setOpenConfirmation(!openConfirmation);
    };

    const { mutate, isError, error, isLoading } = useMutation(
        (data) =>
            client(endPoint, {
                method,
                data: data,
            }),
        {
            onSuccess: (data) => {
                queryClient.invalidateQueries(queryName);
                setChecked(!checked);
                handleConfirmation();
            },
        }
    );
    const bulkAction = () => {
        mutate({
            publish: !row?.original?.publish,
        });
        handleConfirmation();
    };

    return (
        <>
            <Switch checked={checked} onChange={handleConfirmation} />
            {openConfirmation && (
                <ConfirmationModal
                    isLoading={isLoading}
                    onSave={bulkAction}
                    closeConfirmation={handleConfirmation}
                    message={<FormattedMessage id={btnName} />}
                    confirmation={openConfirmation}
                />
            )}
        </>
    );
}

export default SwitchAction;
