import React from 'react'
import {Controller} from 'react-hook-form'
import {TextField} from '@mui/material'
import {FormattedMessage} from 'react-intl'

const CustomInput = ({
  name,
  label,
  control,
  errors,
  type = 'text',
  ...rest
}) => {
  return (
    <Controller
      render={({
        field: {onChange, onBlur, value, ref},
        fieldState: {invalid, isTouched, isDirty, error},
      }) => (
        <TextField
          {...rest}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          inputRef={ref}
          fullWidth
          autoComplete={name}
          type={type}
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

export default CustomInput
