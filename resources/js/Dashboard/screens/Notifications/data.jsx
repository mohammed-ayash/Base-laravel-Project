import React from 'react'
import Label from '@/components/Label'
import {Chip} from '@mui/material'
import {FormattedMessage} from 'react-intl'

export const tableColumns = [
  {
    header: 'notification_template',
    accessorKey: 'notificationTemplate.name',
    enableSorting: false,
  },
  {
    header: 'data',
    accessorKey: 'data',
    enableSorting: false,
    cell: ({row}) =>
      row.original.data ?? <Chip label={<FormattedMessage id="empty" />} />,
  },
  {
    header: 'read',
    accessorKey: 'read',
    cell: ({row}) => {
      let title = row.original.read === false ? 'no' : 'yes'
      return (
        <Label
          variant="ghost"
          color={title === 'yes' ? 'success' : 'error'}
          title={title}
        />
      )
    },
    enableSorting: false,
  },
]
