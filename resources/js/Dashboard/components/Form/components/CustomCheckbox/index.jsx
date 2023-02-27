import {Checkbox, FormControlLabel} from '@mui/material'
import React from 'react'
import {Controller} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'

export default function CustomCheckbox({label, control, name}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({field}) => (
        <FormControlLabel
          control={
            <Checkbox
              onChange={e => field.onChange(e.target.checked)}
              checked={field.value}
            />
          }
          label={<FormattedMessage id={label} />}
        />
      )}
    />
  )
}
