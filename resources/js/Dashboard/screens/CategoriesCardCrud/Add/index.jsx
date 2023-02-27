import {Container, Stack, Typography} from '@mui/material'
import Page from '@/components/Page'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import SliderForm from '../Partials/CategoriesCrudForm'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function AddCategoriesCrud() {
  return (
    <Page title="category cards">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="create_new_category_card" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <SliderForm />
      </Container>
    </Page>
  )
}
