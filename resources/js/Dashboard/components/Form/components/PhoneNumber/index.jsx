import * as React from 'react'
import TextField from '@mui/material/TextField'
import CustomInput from '../CustomInput'
import {FormattedMessage} from 'react-intl'
import {styled} from '@mui/material/styles'

const StyledDiv = styled('div')(() => ({
  display: 'flex',
  gap: '1rem',
}))

export default function CountrySelect({
  label,
  control,
  name,
  errors,
  dialcode,
}) {
  return (
    <StyledDiv>
      <TextField
        id="dialcode"
        disabled
        label={<FormattedMessage id="dialCode" />}
        value={dialcode}
        defaultValue={dialcode ?? '+'}
      />
      <CustomInput
        label={label}
        control={control}
        name={name}
        errors={errors}
        type="number"
      />
    </StyledDiv>
  )
}
