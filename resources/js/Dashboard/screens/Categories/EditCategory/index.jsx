import Breadcrumbs from '@/components/Breadcrumbs'
import Page from '@/components/Page'
import {Container, Stack, Typography} from '@mui/material'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import CategoryForm from '../CategoryForm'

export default function EditCategory() {
  return (
    <Page title="Category">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="update_category" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <CategoryForm />
      </Container>
    </Page>
  )
}
