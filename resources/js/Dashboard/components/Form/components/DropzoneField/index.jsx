import { Box, IconButton, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Controller } from "react-hook-form";
import { FormattedMessage } from "react-intl";
import Iconify from "../../../Iconify";
import { styled } from "@mui/material/styles";
import IMGEditor from "./IMGEditor";

const StyledBox = styled(Box)(({ theme }) => ({
    border: `2px dashed ${theme.palette.primary.main}`,
    borderRadius: theme.shape.borderRadius,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: theme.palette.background.default,
    height: "8rem",
    outline: "none",
    justifyItems: "center",
    justifyContent: "center",
}));

const ThumbContainer = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 16,
}));

const Thumb = styled(Box)(({ theme }) => ({
    display: "inline-flex",
    borderRadius: 4,
    border: "1px solid grey",
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: "border-box",
}));

const ThumbInner = styled(Box)(({ theme }) => ({
    display: "flex",
    minWidth: 0,
    overflow: "hidden",
    position: "relative",
}));

const ThumbImg = styled(Box)(({ theme }) => ({
    display: "block",
    width: "auto",
    height: "100%",
}));

const ThumbDeleteButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    left: theme.direction === "ltr" ? 2.5 : "unset",
    right: theme.direction === "rtl" ? 2.5 : "unset",
    bottom: 2.5,
    background: theme.palette.primary.main,
    color: "#fff",
    border: 0,
    borderRadius: ".325em",
    cursor: "pointer",
    width: "1.6rem",
    height: "1.6rem",
    display: "flex",
}));

const ThumbEditButton = styled(IconButton)(({ theme }) => ({
    position: "absolute",
    right: theme.direction === "ltr" ? 2.5 : "unset",
    left: theme.direction === "rtl" ? 2.5 : "unset",
    bottom: 2.5,
    background: theme.palette.primary.main,
    color: "#fff",
    border: 0,
    borderRadius: ".325em",
    cursor: "pointer",
    width: "1.6rem",
    height: "1.6rem",
    display: "flex",
}));

const ErrorText = styled("div")(({ theme }) => ({
    color: "#f44336",
    marginLeft: "14px",
    marginRight: "14px",
    margin: "0",
    fontSize: "0.75rem",
    marginTop: "3px",
    fontWeight: "400",
    lineHeight: "1.66",
    letterSpacing: "0.03333em",
}));

const DropzoneField = ({
    name,
    control,
    InputChange,
    hidden = false,
    thumbActions = true,
    maxSize = 2097152,
    errors,
    editValue,
    onDropAccepted = () => {},
    accept,
    ...rest
}) => {
    const [file, setFile] = useState(null);

    return (
        <Controller
            render={({ field: { onChange }, fieldState: { error } }) => (
                <Dropzone
                    onChange={(e) => onChange(e.target.files[0])}
                    setFile={setFile}
                    file={file}
                    hidden={hidden}
                    thumbActions={thumbActions}
                    maxSize={maxSize}
                    errors={errors}
                    name={name}
                    editValue={editValue}
                    InputChange={InputChange}
                    error={error}
                    onDropAccepted={onDropAccepted}
                    accept={accept}
                    {...rest}
                />
            )}
            name={name}
            control={control}
        />
    );
};

const Dropzone = ({
    onChange,
    setFile,
    file,
    hidden,
    thumbActions,
    maxSize,
    errors,
    name,
    editValue,
    onDropAccepted,
    InputChange,
    error,
    accept,
    ...rest
}) => {
    const { getRootProps, getInputProps, fileRejections } = useDropzone({
        ...rest,
        onDrop: (acceptedFiles) => {
            setFile((prev) => ({ ...prev }));
            acceptedFiles.map((file) =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                })
            ),
                setFile(acceptedFiles[0]);
        },
        onDropAccepted: () => {
            onDropAccepted();
        },
        maxSize,
        validator: fileSizeValidator,
        onDropRejected: () => {
            setFile(null);
        },
        accept: accept
            ? accept
            : {
                  "image/*": [".jpeg", ".png"],
              },
    });
    const fileSizeValidator = (file) => {
        if (file.length > maxSize)
            return {
                code: "file-too-large",
                message: `Max file size is ${maxSize / 2048} MB`,
            };
    };

    const [cropper, setCropper] = useState(false);

    const dataURLtBlob = (dataurl) => {
        var byteString;
        if (dataurl.split(",")[0].indexOf("base64") >= 0)
            byteString = atob(dataurl.split(",")[1]);
        else byteString = unescape(dataurl.split(",")[1]);

        var mimeString = dataurl.split(",")[0].split(":")[1].split(";")[0];

        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        return new Blob([ia], { type: mimeString });
    };

    function toDataURL(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.responseType = "blob";
        xhr.send();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                xhr.response.preview = URL.createObjectURL(xhr.response);
                setFile(xhr.response);
            }
        };
    }

    const editImage = (image) => {
        const updatedFile = dataURLtBlob(image);
        updatedFile.preview = URL.createObjectURL(updatedFile);
        setFile(updatedFile);
        setCropper(false);
    };

    useEffect(() => {
        InputChange(name, file);
    }, [file]);

    useEffect(() => {
        if (editValue) {
            toDataURL(editValue);
        }
    }, [editValue]);
    return (
        <>
            <Box sx={{ display: hidden ? "none" : "block" }}>
                <StyledBox {...getRootProps()}>
                    <TextField
                        type="file"
                        {...getInputProps({ onChange })}
                        accept="image/*"
                        hidden={hidden}
                        sx={{ width: "100%", height: "100%" }}
                    />
                    <Typography sx={{ color: "grey", fontSize: "13px" }}>
                        <FormattedMessage id="drag_and_drop_some_files_here_or_click_here_to_select_files" />
                    </Typography>
                </StyledBox>
                {file !== null && (
                    <ThumbContainer>
                        <Thumb key={file && file.name}>
                            <ThumbInner>
                                <ThumbImg component="img" src={file?.preview} />
                                {thumbActions && (
                                    <>
                                        <ThumbEditButton
                                            onClick={() => setCropper(true)}
                                        >
                                            <Iconify
                                                width={"0.5 rem"}
                                                height={"0.5 rem"}
                                                icon="ci:edit"
                                            />
                                        </ThumbEditButton>
                                        <ThumbDeleteButton
                                            onClick={() => setFile(null)}
                                        >
                                            <Iconify
                                                width={"0.5 rem"}
                                                height={"0.5 rem"}
                                                icon="ic:twotone-delete-outline"
                                            />
                                        </ThumbDeleteButton>
                                    </>
                                )}
                            </ThumbInner>
                        </Thumb>
                    </ThumbContainer>
                )}
                <ErrorText>
                    {error && <FormattedMessage id={error?.message} />}
                    {fileRejections.length > 0 &&
                        `Max file size is ${(maxSize / 1048576).toFixed(2)} MB`}
                </ErrorText>
            </Box>
            <ErrorText
                sx={{ display: hidden ? "block" : "none", marginTop: "220px" }}
            >
                {fileRejections.length > 0 &&
                    `Max file size is ${(maxSize / 1048576).toFixed(2)} MB`}
            </ErrorText>
            <IMGEditor
                open={cropper}
                onClose={() => setCropper(false)}
                image={file?.preview}
                onSave={editImage}
            />
        </>
    );
};

export default DropzoneField;
