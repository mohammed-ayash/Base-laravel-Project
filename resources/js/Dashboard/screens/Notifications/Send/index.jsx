import {Container, Stack, Typography} from '@mui/material'
import Page from '@/components/Page'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import NotificationsForm from '../Partials/NotificationsForm'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function SendNotification() {
  return (
    <Page title="Notifications">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="send_notification" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <NotificationsForm />
      </Container>
    </Page>
  )
}
