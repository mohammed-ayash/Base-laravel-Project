import CustomCheckbox from "@/components/Form/components/CustomCheckbox";
import DropzoneField from "@/components/Form/components/DropzoneField";
import { FullPageSpinner } from "@/components/lib";
import { useAuth, useClient } from "@/context/auth-context";
import { getErrorsFromResponse } from "@/utils/fromHelper";
import { successWithCustomMessage } from "@/utils/notifications";
import { getRouteWithLang } from "@/utils/routesHelpers";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Stack, styled } from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
import * as Yup from "yup";
import CategoryModal from "../CategoryModal";
import Chips from "../Chips";
import { ErrorText } from "@/components/StyledComponents";

export default function CategoriesCrud() {
    const { id } = useParams();
    const client = useClient();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const categoryCardsRoute = getRouteWithLang("/category-cards");
    const user = useAuth();

    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);

    const [backendErrors, setBackendErrors] = React.useState([]);

    const CategoryCardSchema = Yup.object().shape({
        publish: Yup.boolean().nullable(),
        image: Yup.mixed().required("image_is_required"),
        categories: Yup.array().typeError("categories_is_required").required(),
    });

    const { isLoading: fetchLoading, data: categoryCard } = useQuery({
        queryKey: `category-cards_${id}`,
        queryFn: () => client(`category-cards/${id}`).then((data) => data.data),
        enabled: id !== undefined,
    });

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        setError,
        getValues,
        watch,
        trigger,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(CategoryCardSchema),
        defaultValues: {
            publish: false,
            image: "",
            categories: null,
        },
    });

    const onFileChange = async (name, files) => {
        setValue(name, files, { shouldDirty: true });
        if (files?.file) {
            await trigger(["image"]);
        }
    };
    useEffect(() => {
        if (categoryCard && id !== undefined) {
            reset({
                publish: categoryCard.publish,
                image: categoryCard.imageFileUrl,
                categories: categoryCard.categories,
            });
        }
    }, [categoryCard]);
    const { mutate, isError, isLoading } = useMutation(
        (data) =>
            axios({
                url: id ? `/api/category-cards/${id}` : `/api/category-cards`,
                method: "POST",
                data,
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: user?.user?.token
                        ? `Bearer ${user?.user?.token}`
                        : undefined,
                },
            }),
        {
            onSuccess: () => {
                queryClient.invalidateQueries("category-cards");
                navigate(`${categoryCardsRoute}`);
                if (id) successWithCustomMessage("updated_success_msg");
                else successWithCustomMessage("added_success_msg");
                reset();
            },
            onError: (error) => {
                let errors = getErrorsFromResponse(error);
                setBackendErrors(errors);
            },
        }
    );
    const onSubmitForm = ({ categories, image, publish }) => {
        const formData = new FormData();

        categories?.map(({ id }) => {
            formData.append("categories[]", id);
        });
        formData.append("image", image);
        formData.append("publish", publish);
        mutate(formData);
    };

    if (fetchLoading) {
        return <FullPageSpinner />;
    }
    return (
        <>
            <form
                autoComplete="off"
                noValidate
                onSubmit={handleSubmit(onSubmitForm)}
            >
                <Stack spacing={3}>
                    {isError ? (
                        <Alert severity="error">
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

                    <CustomCheckbox
                        label="publish"
                        name="publish"
                        control={control}
                    />

                    {watch("categories") && (
                        <Chips getValues={getValues} setValue={setValue} />
                    )}
                    <LoadingButton
                        onClick={handleOpen}
                        size="large"
                        variant="contained"
                    >
                        <FormattedMessage id="select_category" />
                    </LoadingButton>

                    {errors && errors.categories && (
                        <ErrorText>
                            <FormattedMessage
                                id={errors?.categories?.message}
                            />
                        </ErrorText>
                    )}

                    <DropzoneField
                        name="image"
                        control={control}
                        InputChange={(name, files) => onFileChange(name, files)}
                        errors={errors}
                        editValue={categoryCard?.imageFileUrl}
                        thumbActions={false}
                    />
                </Stack>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="flex-end"
                    sx={{ my: 2 }}
                >
                    <LoadingButton
                        onClick={() => navigate(-1)}
                        size="large"
                        variant="contained"
                        sx={{ mr: 2 }}
                    >
                        <FormattedMessage id="cancel" />
                    </LoadingButton>
                    <LoadingButton
                        size="large"
                        type="submit"
                        variant="contained"
                        loading={isLoading}
                    >
                        {id !== undefined ? (
                            <FormattedMessage id="update_category_card" />
                        ) : (
                            <FormattedMessage id="save" />
                        )}
                    </LoadingButton>
                </Stack>
            </form>
            <CategoryModal
                setValue={setValue}
                open={open}
                handleClose={handleClose}
                trigger={trigger}
                getValues={getValues}
            />
        </>
    );
}
