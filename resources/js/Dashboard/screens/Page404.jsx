import React from 'react'
import {NavLink as RouterLink} from 'react-router-dom'
// @mui
import {styled} from '@mui/material/styles'
import {Button, Typography, Container, Box} from '@mui/material'
// components
import Page from '../components/Page'
import {FormattedMessage} from 'react-intl'
import {getRouteWithLang} from '../utils/routesHelpers'

// ----------------------------------------------------------------------

const ContentStyle = styled('div')(({theme}) => ({
  maxWidth: 480,
  margin: 'auto',
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  padding: theme.spacing(12, 0),
}))

// ----------------------------------------------------------------------

export default function Page404() {
  return (
    <Page title="404 Page Not Found">
      <Container>
        <ContentStyle sx={{textAlign: 'center', alignItems: 'center'}}>
          <Typography variant="h3" paragraph>
            <FormattedMessage id="error404_head" />
          </Typography>

          <Typography sx={{color: 'text.secondary'}}>
            <FormattedMessage id="error404_body" />
          </Typography>

          <Box
            component="img"
            src="/static/illustrations/illustration_404.svg"
            sx={{height: 260, mx: 'auto', my: {xs: 5, sm: 10}}}
          />
          <Button
            size="large"
            variant="contained"
            to={getRouteWithLang()}
            component={RouterLink}
          >
            <FormattedMessage id="go_to_home" />
          </Button>
        </ContentStyle>
      </Container>
    </Page>
  )
}
