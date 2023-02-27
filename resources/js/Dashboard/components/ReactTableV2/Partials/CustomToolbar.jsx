import * as React from 'react'
import {IconButton, Toolbar, Tooltip, Typography} from '@mui/material'
// material
import {styled} from '@mui/material/styles'
import PropTypes from 'prop-types'
import {FormattedMessage} from 'react-intl'
// component
import Iconify from '../../Iconify'
import {GlobalFilter} from './ReactTableFilters'

// ----------------------------------------------------------------------

const RootStyle = styled(Toolbar)(({theme}) => ({
  height: 96,
  display: 'flex',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 3),
}))

// ----------------------------------------------------------------------

export default function CustomToolbar({
  selectedRows,
  onDelete,
  globalFilter,
  setGlobalFilter,
  searchBox = true,
  filtered = true,
}) {
  let numSelected = selectedRows?.length
  const handleDelete = () => {
    onDelete && onDelete(selectedRows)
  }
  return (
    <RootStyle
      sx={{
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} <FormattedMessage id="selected" />
        </Typography>
      ) : (
        <>
          {searchBox && (
            <GlobalFilter
              globalFilter={globalFilter}
              setGlobalFilter={setGlobalFilter}
            />
          )}
        </>
      )}

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton onClick={handleDelete}>
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      ) : (
        <>
          {filtered && (
            <Tooltip title="Filter list">
              <IconButton>
                <Iconify icon="ic:round-filter-list" />
              </IconButton>
            </Tooltip>
          )}
        </>
      )}
    </RootStyle>
  )
}
