import React from 'react'
import {Controller} from 'react-hook-form'
import {TextField} from '@mui/material'
import {FormattedMessage} from 'react-intl'

const CustomTextarea = ({name, label, control, errors, placeholder}) => {
  return (
    <Controller
      render={({
        field: {onChange, onBlur, value, ref},
        fieldState: {invalid, isTouched, isDirty, error},
      }) => (
        <TextField
          multiline
          placeholder={placeholder ?? null}
          minRows={4}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          fullWidth
          autoComplete={name}
          type="textarea"
          label={<FormattedMessage id={label} />}
          error={Boolean(errors[name] && errors[name])}
          helperText={
            errors[name] && <FormattedMessage id={errors[name].message} />
          }
        />
      )}
      name={name}
      control={control}
    />
  )
}

export default CustomTextarea
