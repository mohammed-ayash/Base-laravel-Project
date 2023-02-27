import {Container, Stack, Typography} from '@mui/material'
import Page from '@/components/Page'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import CategoryForm from '../CategoryForm'
import Breadcrumbs from '@/components/Breadcrumbs'

export default function AddCategory() {
  return (
    <Page title="Category">
      <Container>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h4" gutterBottom>
            <FormattedMessage id="create_new_category" />
          </Typography>
        </Stack>
        <Breadcrumbs />
        <CategoryForm />
      </Container>
    </Page>
  )
}
