import {Container, Stack, Typography} from '@mui/material'
import Page from '@/components/Page'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import CategoriesCrudForm from '../Partials/CategoriesCrudForm'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function EditCategoriesCrud() {
  return (
    <Page title="category cards">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="edit_category_card" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <CategoriesCrudForm />
      </Container>
    </Page>
  )
}
