import InputPassword from "@/components/Form/components/InputPassword";
import {
    FormBox,
    ModalWrapper,
    StyledModal,
    StyledStack,
} from "@/components/StyledComponents";
import { useClient } from "@/context/auth-context";
import { getErrorsFromResponse } from "@/utils/fromHelper";
import { successWithCustomMessage } from "@/utils/notifications";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, ClickAwayListener } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useMutation } from "react-query";
import * as Yup from "yup";

const EditPassword = ({ id, confirmation, closeConfirmation }) => {
    const client = useClient();
    const [backendErrors, setBackendErrors] = React.useState([]);

    const UserSchema = Yup.object().shape({
        password: Yup.string().required("password_is_required"),
    });

    const { mutate, isError, isLoading } = useMutation(
        (data) =>
            client(`users/${id}`, {
                method: "POST",
                data: data,
            }),
        {
            onSuccess: () => {
                successWithCustomMessage("updated_success_msg");
                closeConfirmation();
            },
            onError: (error) => {
                let errors = getErrorsFromResponse(error);
                setBackendErrors(errors);
            },
        }
    );

    const {
        control,
        handleSubmit,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues: {
            password: "",
        },
    });

    const onSubmitForm = ({ password }) =>
        mutate({
            password,
        });

    return (
        <ClickAwayListener onClickAway={closeConfirmation}>
            <ModalWrapper open={confirmation}>
                <StyledModal>
                    {isError ? (
                        <Alert sx={{ width: "100%", mb: 2 }} severity="error">
                            {backendErrors.map(
                                ({ filedName, errorMessage }) => {
                                    return (
                                        <div>
                                            <FormattedMessage id={filedName} />
                                            <p>{errorMessage}</p>
                                        </div>
                                    );
                                }
                            )}
                        </Alert>
                    ) : null}
                    <FormBox
                        autoComplete="off"
                        noValidate
                        onSubmit={handleSubmit(onSubmitForm)}
                    >
                        <InputPassword
                            label="password"
                            name="password"
                            control={control}
                            errors={errors}
                        />
                        <StyledStack
                            direction="row"
                            alignItems="center"
                            justifyContent="flex-end"
                            sx={{ my: 2 }}
                        >
                            <LoadingButton
                                onClick={closeConfirmation}
                                size="large"
                                variant="contained"
                                sx={{ mr: 2 }}
                            >
                                <FormattedMessage id="cancel" />
                            </LoadingButton>
                            <LoadingButton
                                size="large"
                                variant="contained"
                                onClick={handleSubmit(onSubmitForm)}
                                loading={isLoading}
                                disabled={!isDirty}
                            >
                                <FormattedMessage id="confirm" />
                            </LoadingButton>
                        </StyledStack>
                    </FormBox>
                </StyledModal>
            </ModalWrapper>
        </ClickAwayListener>
    );
};

export default EditPassword;
