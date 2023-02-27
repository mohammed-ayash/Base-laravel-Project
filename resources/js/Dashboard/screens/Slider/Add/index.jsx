import Breadcrumbs from '@/components/Breadcrumbs'
import Page from '@/components/Page'
import {Container, Stack, Typography} from '@mui/material'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import SliderForm from '../Partials/SliderForm'

export default function AddSliders() {
  return (
    <Page title="sliders">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="create_new_slider" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <SliderForm />
      </Container>
    </Page>
  )
}
