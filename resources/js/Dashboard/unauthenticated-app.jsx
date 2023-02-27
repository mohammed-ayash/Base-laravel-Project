import { useAuth } from "./context/auth-context";
import * as React from "react";
// material
import { Box, Card, Container, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
// layouts
// components
import Page from "./components/Page";
import { LoginForm } from "./sections/auth/login";
import { FormattedMessage } from "react-intl";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
    [theme.breakpoints.up("md")]: {
        display: "flex",
    },
}));

const SectionStyle = styled(Card)(({ theme }) => ({
    width: "100%",
    maxWidth: 464,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
    maxWidth: 480,
    margin: "auto",
    display: "flex",
    minHeight: "100vh",
    flexDirection: "column",
    justifyContent: "center",
    padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

function UnauthenticatedApp() {
    const { login } = useAuth();
    return (
        <RootStyle title="Login">
            <SectionStyle sx={{ display: { xs: "none", md: "flex" } }}>
                <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
                    <FormattedMessage id="welecome_back" />
                </Typography>
                <Box
                    component="img"
                    src="/static/dashboard.svg"
                    sx={{ width: "85%", height: "85%", margin: "auto" }}
                />
            </SectionStyle>

            <Container maxWidth="sm">
                <ContentStyle>
                    <Stack sx={{ mb: 5 }}>
                        <Typography variant="h4" gutterBottom>
                            <FormattedMessage id="sign_in_to_continue" />
                        </Typography>
                        <Typography sx={{ color: "text.secondary" }}>
                            <FormattedMessage id="enter_your_details_below" />
                        </Typography>
                    </Stack>
                    {/* <AuthSocial /> */}
                    <LoginForm onSubmit={login} />
                </ContentStyle>
            </Container>
        </RootStyle>
    );
}

export default UnauthenticatedApp;
