import CustomInput from "../../../components/Form/components/CustomInput";
import InputPassword from "../../../components/Form/components/InputPassword";
import { useAsync } from "../../../utils/hooks";
import { yupResolver } from "@hookform/resolvers/yup"; // material
import { LoadingButton } from "@mui/lab";
import { Alert, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import * as Yup from "yup";
import axios from "axios";

// ----------------------------------------------------------------------

export default function LoginForm({ onSubmit }) {
    const { isLoading, isError, error, run, isSuccess } = useAsync();

    const LoginSchema = Yup.object().shape({
        email: Yup.string()
            .email("valid_email_address")
            .required("email_is_required"),
        password: Yup.string().required("password_is_required"),
    });

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmitForm = (data) => {
        const { email, password } = data;
        run(onSubmit({ email, password }));
    };

    return (
        <form
            autoComplete="off"
            noValidate
            onSubmit={handleSubmit(onSubmitForm)}
        >
            <Stack spacing={3}>
                {isError ? (
                    <Alert severity="error">{error.message}</Alert>
                ) : null}
                <CustomInput
                    label="email"
                    name="email"
                    control={control}
                    errors={errors}
                />
                <InputPassword
                    label="password"
                    name="password"
                    control={control}
                    errors={errors}
                />
            </Stack>
            <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{ my: 2 }}
            ></Stack>

            <LoadingButton
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                loading={isLoading}
            >
                <FormattedMessage id="login" />
            </LoadingButton>
        </form>
    );
}
