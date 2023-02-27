import {
  CustomTreeData,
  IntegratedSelection,
  SelectionState,
  TreeDataState,
} from '@devexpress/dx-react-grid'
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
} from '@devexpress/dx-react-grid-material-ui'
import Paper from '@mui/material/Paper'
import React, {useState} from 'react'
import CategoryActions from '../Actions/CategoryActions'

import {FullPageSpinner} from '@/components/lib'
import {useClient} from '@/context/auth-context'
import {Avatar, Stack, Typography} from '@mui/material'
import {FormattedMessage} from 'react-intl'
import {useQuery} from 'react-query'
import SwitchAction from '../SwitchAction/index'

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(
    r => r?.parent?.id === (row?.id ?? undefined),
  )
  return childRows.length > 0 ? childRows : null
}

export default () => {
  const [columns] = useState([
    {
      name: 'name',
      title: <FormattedMessage id="name" />,
      getCellValue: row => {
        return (
          <Stack key={row?.id} direction="row" alignItems="center" spacing={2}>
            <Avatar
              variant="rounded"
              style={{width: 50}}
              alt={row?.name}
              src={row?.imageFileUrl}
            />
            <Typography variant="subtitle2" noWrap>
              {row?.name}
            </Typography>
          </Stack>
        )
      },
    },
    {
      name: 'publish',
      title: <FormattedMessage id="publish" />,
      getCellValue: row => <SwitchAction key={row?.id} row={row} />,
    },
    {
      name: 'actions',
      title: <FormattedMessage id="actions" />,
      getCellValue: row => <CategoryActions key={row?.id} row={row} />,
    },
  ])
  const client = useClient()

  const {
    isLoading,
    error,
    data: rows,
  } = useQuery({
    queryKey: 'categories',
    queryFn: () => client('categories').then(data => data.data),
  })

  const [defaultExpandedRowIds] = useState([0])
  if (isLoading) {
    return <FullPageSpinner />
  }

  return (
    <Paper>
      <Grid rows={rows} columns={columns}>
        <SelectionState />
        <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds} />
        <CustomTreeData getChildRows={getChildRows} />
        <IntegratedSelection />
        <Table />
        <TableHeaderRow />
        <TableTreeColumn for="name" showSelectionControls showSelectAll />
      </Grid>
    </Paper>
  )
}
