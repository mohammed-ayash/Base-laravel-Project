import {Avatar, Chip, Stack, Typography} from '@mui/material'
import React from 'react'
import MoreMenu from './Partials/MoreMenu'
import {getDateFromISO} from '@/utils/formatTime'
import SwtichAction from './Partials/SwitchAction'
import {useAuth} from '@/context/auth-context'
import Label from '@/components/Label'

export const tableColumns = [
  {
    header: 'username',
    accessorKey: 'username',
    style: {
      padding: '0',
    },
    cell: ({row}) => (
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar alt={row.original.username} src={row.original.avatarFileUrl} />
        <Typography variant="subtitle2" noWrap>
          {row.original.username}
        </Typography>
      </Stack>
    ),
  },
  {
    header: 'email',
    accessorKey: 'email',
    enableSorting: false,
  },
  {
    header: 'blocked',
    accessorKey: 'blocked',
    enableSorting: false,
    cell: ({row}) => {
      const {user: userAuth} = useAuth()
      if (row.original.id !== userAuth.id)
        return <SwtichAction row={row.original} key={row.original.id} />
      return <></>
    },
  },
  {
    header: 'country',
    accessorKey: 'country.name',
    enableSorting: false,
  },
  {
    header: 'trusted',
    accessorKey: 'trusted',
    cell: ({row}) => {
      let label = row?.original?.trusted ? 'true' : 'false'
      return (
        <Label
          variant="ghost"
          color={label === 'true' ? 'success' : 'error'}
          title={label}
        />
      )
    },
  },
  {
    header: 'user_group',
    accessorKey: 'userGroup.name',
    enableSorting: false,
    cell: ({row}) => <Chip label={row?.original?.userGroup?.name} />,
  },
  {
    header: 'verified',
    accessorKey: 'verifiedAt',
    cell: ({row}) => {
      let label = row?.original?.verifiedAt ? 'true' : 'false'
      return (
        <Label
          variant="ghost"
          color={label === 'true' ? 'success' : 'error'}
          title={label}
        />
      )
    },
  },
  {
    header: 'created_at',
    accessorKey: 'createdAt',
    cell: ({row}) => <span>{getDateFromISO(row?.original?.createdAt)}</span>,
  },
  {
    header: 'actions',
    accessorKey: 'actions',
    cell: ({row}) => {
      const {user: userAuth} = useAuth()
      if (row.original.id !== userAuth.id)
        return (
          <MoreMenu id={row.original.id} fullName={row?.original?.fullName} />
        )
      return <></>
    },
    style: {
      textAlign: 'right',
    },
    enableSorting: false,
  },
]
