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
import {FullPageSpinner} from '@/components/lib'
import {useClient} from '@/context/auth-context'
import {LoadingButton} from '@mui/lab'
import {Stack} from '@mui/material'
import {FormattedMessage} from 'react-intl'
import {useQuery} from 'react-query'

let disableCategoriesArray = []

const getChildRows = (row, rootRows) => {
  const childRows = rootRows.filter(
    r => r?.parent?.id === (row?.id ?? undefined),
  )
  if (childRows.length === 0 && row) {
    disableCategoriesArray.push(row.id)
  }
  return childRows.length > 0 ? childRows : null
}

export default function TreeTable({
  handleClose,
  setValue,
  trigger,
  selectedArray,
  clear = false,
  ExpandedRowIds = [0],
}) {
  const [selection, setSelection] = useState(selectedArray)

  const TreeCell = props => {
    const {children, ...restProps} = props
    const newChildren = React.Children.map(children, (child, index) => {
      if (index !== 2) return child
      return React.cloneElement(child, {
        ...child.props,
      })
    })

    return (
      <TableTreeColumn.Cell {...restProps}>{newChildren}</TableTreeColumn.Cell>
    )
  }
  const [columns] = useState([
    {
      name: 'name',
      title: 'Name',
      getCellValue: row => row?.name ?? undefined,
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

  const [defaultExpandedRowIds] = useState(ExpandedRowIds)
  const [tableColumnExtensions] = useState([
    {columnName: 'description', align: 'right'},
  ])

  const onSelectionChange = selection => {
    setSelection(selection)
  }
  const save = async () => {
    let values = selection.map(id => rows[id])
    if (values) {
      setValue('categories', values)
      await trigger(['categories'])
      handleClose()
    }
  }

  if (isLoading) {
    return <FullPageSpinner />
  }

  return (
    <Stack>
      <Paper>
        <Grid rows={rows} columns={columns}>
          <SelectionState
            selection={selection}
            onSelectionChange={onSelectionChange}
          />
          <TreeDataState defaultExpandedRowIds={defaultExpandedRowIds} />
          <CustomTreeData getChildRows={getChildRows} />
          <IntegratedSelection />
          <Table columnExtensions={tableColumnExtensions} />
          <TableHeaderRow />
          <TableTreeColumn
            for="name"
            showSelectionControls
            cellComponent={TreeCell}
          />
        </Grid>
      </Paper>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="end"
        sx={{gap: 2, mt: 2}}
      >
        {clear && (
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            onClick={() => {
              setSelection([])
            }}
            disabled={selection.length !== 0 ? false : true}
          >
            <FormattedMessage id="clear" />
          </LoadingButton>
        )}
        <LoadingButton
          size="large"
          type="submit"
          variant="contained"
          onClick={save}
          disabled={selection.length !== 0 ? false : true}
        >
          <FormattedMessage id="save" />
        </LoadingButton>
      </Stack>
    </Stack>
  )
}
