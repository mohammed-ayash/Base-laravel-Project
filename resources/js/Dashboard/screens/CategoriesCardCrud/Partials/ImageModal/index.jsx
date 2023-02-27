import { Avatar, Box, ClickAwayListener, Modal } from "@mui/material";
import React from "react";
import { ClickAwayModal } from "@/components/StyledComponents";
const ImageModal = ({ row }) => {
    let { id, imageFileUrl } = row;
    const [preview, setPreview] = React.useState(false);

    const handleClose = () => {
        setPreview(false);
    };

    return (
        <>
            <Avatar
                onClick={() => setPreview(!preview)}
                variant="rounded"
                style={{ width: 50, cursor: "pointer" }}
                alt={`photo-${id}`}
                src={imageFileUrl}
            />
            {preview && (
                <ClickAwayModal handleClose={handleClose} open={preview}>
                    <Box sx={style}>
                        <img src={imageFileUrl} />
                    </Box>
                </ClickAwayModal>
            )}
        </>
    );
};

export default ImageModal;
