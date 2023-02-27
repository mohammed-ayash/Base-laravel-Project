import {Chip, Stack} from '@mui/material'
import React from 'react'

const Chips = ({getValues, setValue}) => {
  let categories = getValues('categories')
  return (
    <Stack spacing={2} direction="row">
      {categories.map(({id, parent, name}) => {
        return (
          <>
            {parent !== null ? (
              <Chip
                key={id}
                label={`${parent.name} -> ${name}`}
                onDelete={() => {
                  setValue(
                    'categories',
                    categories.filter(subCate => subCate.id != id),
                  )
                }}
              />
            ) : (
              <Chip
                key={id}
                label={name}
                onDelete={() => {
                  setValue(
                    'categories',
                    categories.filter(subCate => subCate.id != id),
                  )
                }}
              />
            )}
          </>
        )
      })}
    </Stack>
  )
}

export default Chips
