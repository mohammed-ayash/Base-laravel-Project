import {
    styled,
    ClickAwayListener,
    Modal,
    MenuItem,
    ListItemButton,
    Typography,
    Avatar,
    Box,
    Stack,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";

export const ErrorText = styled("div")(({ theme }) => ({
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

export const ClickAwayModal = ({ handleClose, open, children }) => (
    <ClickAwayListener onClickAway={handleClose}>
        <Box>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        bgcolor: "transparent",

                        maxHeight: "80%",
                        overflow: "auto",
                        "&::-webkit-scrollbar": {
                            width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "#707070",
                            borderRadius: "6px",
                            padding: "2px",
                            visibility: "hidden",
                        },
                        "&:hover": {
                            "&::-webkit-scrollbar-thumb": {
                                visibility: "visible",
                            },
                        },
                    }}
                >
                    {children}
                </Box>
            </Modal>
        </Box>
    </ClickAwayListener>
);

export const ModalWrapper = styled(Modal)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
}));

export const StyledModal = styled("modal")(({ theme }) => ({
    width: 450,
    minHeight: 200,
    backgroundColor: theme.palette.background.paper,
    padding: 10,
    borderWidth: 0,
    outline: "none",
    borderRadius: 5,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "flex-start",
}));

export const StyledStack = styled(Stack)(() => ({
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "90%",
    height: "85%",
}));

export const FormBox = styled(Box)(() => ({
    width: "100%",
}));

export const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    color: theme.palette.error.main,
}));

export const StyledTypography = styled(Typography)({
    mt: 0.5,
    display: "flex",
    alignItems: "center",
    color: "text.disabled",
});

export const StyledListItemButton = styled(ListItemButton)({
    py: 1.5,
    px: 2.5,
    mt: "1px",
});

export const IconBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    mb: 0.5,
});

export const MessageBox = styled(Box)({
    color: "text.secondary",
    display: "block",
});

export const HasMoreLoadingButton = styled(LoadingButton)({
    width: "100%",
    textAlign: "center",
    mt: 2,
});

export const ContainerBox = styled(Box)(({ theme }) => ({
    display: "flex",
    gap: "24px",
    [theme.breakpoints.up("xs")]: {
        flexDirection: "column",
    },
    [theme.breakpoints.up("md")]: {
        flexDirection: "row",
    },
}));

export const AvatarBox = styled(Box)(({ theme }) => ({
    backgroundColor:
        theme?.palette?.mode === "dark"
            ? theme?.palette?.grey[500_12]
            : theme?.palette?.grey[100],
    borderRadius: "16px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "auto",
    maxHeight: "400px",
    padding: "80px 24px",
    width: "33.3333%",
    boxShadow:
        "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
    [theme.breakpoints.down("md")]: {
        width: "100%",
    },
}));

export const DetailsBox = styled(Box)(({ theme }) => ({
    backgroundColor:
        theme?.palette?.mode === "dark"
            ? theme?.palette?.grey[500_12]
            : theme?.palette?.grey[100],
    borderRadius: "16px",
    padding: "24px",
    height: "fit-content",
    boxShadow:
        "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
    [theme.breakpoints.up("xs")]: {
        width: "100%",
    },
    [theme.breakpoints.up("md")]: {
        width: "66.6666%",
    },
}));

export const Item = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
}));

export const Label = styled(Box)(({ theme }) => ({
    fontWeight: "bold",
}));

export const Value = styled(Box)(({ theme }) => ({
    color: theme.palette.grey[500],
}));

export const AvatarSection = styled(Box)({
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    "&:hover": {
        cursor: "pointer",
    },
    "&:hover .overlay": {
        display: "flex",
        transition: "display 500ms",
    },
});

export const OrdersSection = styled(Box)(({ theme }) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "33.3333%",
    marginTop: "24px",
    backgroundColor:
        theme?.palette?.mode === "dark"
            ? theme?.palette?.grey[500_12]
            : theme?.palette?.grey[100],
    borderRadius: "16px",
    padding: "24px",
    height: "fit-content",
    boxShadow:
        "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
    [theme.breakpoints.down("md")]: {
        width: "100%",
    },
}));

export const WalletSection = styled(Box)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    alignItems: "start",
    width: "28%",
    marginTop: "24px",
    height: "auto",
    backgroundColor:
        theme?.palette?.mode === "dark"
            ? theme?.palette?.grey[500_12]
            : theme?.palette?.grey[100],
    borderRadius: "16px",
    padding: "24px",
    boxShadow:
        "rgb(145 158 171 / 20%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px",
    [theme.breakpoints.down("md")]: {
        width: "100%",
    },
}));

export const StyledAvatar = styled(Avatar)({
    width: "180px",
    height: "180px",
    position: "absolute",
});

export const FlexBox = styled(Box)({
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
});
