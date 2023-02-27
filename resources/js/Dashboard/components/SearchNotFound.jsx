import * as React from 'react'
import PropTypes from 'prop-types'
// material
import {Paper, Typography} from '@mui/material'
import {FormattedMessage} from 'react-intl'

// ----------------------------------------------------------------------

SearchNotFound.propTypes = {
  searchQuery: PropTypes.string,
}

export default function SearchNotFound({
  searchQuery = '',
  isSearchQuery = true,
  ...other
}) {
  return (
    <Paper sx={{width: '100%'}} {...other}>
      <Typography gutterBottom align="center" variant="subtitle1">
        <FormattedMessage id="not_found" />
      </Typography>
      {searchQuery && (
        <Typography variant="body2" align="center">
          <FormattedMessage id="no_results_found_for" /> &nbsp;
          <strong>&quot;{}&quot;</strong>.{' '}
          <FormattedMessage id="try_checking_for_typos_or_using_complete_words" />
        </Typography>
      )}
    </Paper>
  )
}
