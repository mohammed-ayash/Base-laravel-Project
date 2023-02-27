import {getDateFromISO} from '@/utils/formatTime'
import React from 'react'
import ImageModal from './Partials/ImageModal'
import MoreMenu from './Partials/MoreMenu'
import SwitchAction from './Partials/SwitchAction'

export const tableHiddenColumns = ['id']
export const tableColumns = [
  {
    header: 'image',
    accessorKey: 'imageFileUrl',
    enableSorting: false,
    cell: ({row}) => <ImageModal row={row.original} />,
  },
  {
    header: 'published',
    accessorKey: 'publish',
    enableSorting: false,
    cell: ({row}) => (
      <SwitchAction key={row?.original?.id} row={row?.original} />
    ),
  },
  {
    header: 'created_at',
    accessorKey: 'createdAt',
    enableSorting: false,
    cell: ({row}) => {
      return <span>{getDateFromISO(row?.original?.createdAt)}</span>
    },
  },
  {
    header: 'actions',
    accessorKey: 'actions',
    enableSorting: false,
    cell: ({row}) => {
      return <MoreMenu id={row?.original?.id} row={row?.original} />
    },
  },
]
