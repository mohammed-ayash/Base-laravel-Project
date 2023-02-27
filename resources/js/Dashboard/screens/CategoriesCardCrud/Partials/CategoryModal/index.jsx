import { useClient } from '@/context/auth-context'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import * as React from 'react'
import { useQuery } from 'react-query'
import TreeTable from '../Table'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',

  minWidth: 400,
  bgcolor: 'background.paper',
  p: 4,
  maxHeight: '80%',
  overflow: 'auto',
  '&::-webkit-scrollbar': {
    width: '8px',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: '#707070',
    borderRadius: '6px',
    padding: '2px',
    visibility: 'hidden',
  },
  '&:hover': {
    '&::-webkit-scrollbar-thumb': {
      visibility: 'visible',
    },
  },
}

export default function CategoryModal({
  open,
  handleClose,
  setValue,
  trigger,
  getValues,
}) {
  let ExpandedRowIds = []
  let selectedCategories = getValues('categories')
  let set = new Set([])
  const client = useClient()

  const {data: categories, isLoading} = useQuery({
    queryKey: 'categories',
    queryFn: () => client('categories').then(data => data.data),
  })

  function getMyParent(childId) {
    let parentId = categories[childId]?.parent?.id ?? null
    if (parentId) {
      let called = categories.findIndex(category => category?.id === parentId)
      //Has Parent
      if (categories[called]?.parent?.id) {
        getMyParent(called)
      }
      set.add(called)
    }
  }

  let selectedArray = []
  if (!isLoading) {
    selectedArray =
      selectedCategories?.length > 0
        ? [
            ...selectedCategories.map(category =>
              categories.findIndex(cate => cate.id === category.id),
            ),
          ]
        : []
    selectedArray.map(category => {
      getMyParent(category)
    })
    ExpandedRowIds = [...set]
  }
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <TreeTable
          handleClose={handleClose}
          setValue={setValue}
          trigger={trigger}
          selectedArray={selectedArray}
          clear={true}
          ExpandedRowIds={ExpandedRowIds ?? []}
        />
      </Box>
    </Modal>
  )
}
