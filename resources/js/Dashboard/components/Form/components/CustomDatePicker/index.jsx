import {TextField} from '@mui/material'
import {DateTimePicker, DatePicker} from '@mui/x-date-pickers'
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider'
import React from 'react'
import {Controller} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
// import {LocalizationProvider, DateTimePicker} from '@mui/lab'
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'

const CustomDatePicker = ({name, label, control, time = true, errors}) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {time ? (
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          render={({
            field: {onChange, value},
            fieldState: {error, invalid},
          }) => (
            <DateTimePicker
              label={<FormattedMessage id={label} />}
              value={value}
              onChange={value => onChange(value)}
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={
                    invalid ? <FormattedMessage id={error.message} /> : null
                  }
                  error={invalid}
                  sx={{width: '100%'}}
                />
              )}
            />
          )}
        />
      ) : (
        <Controller
          name={name}
          control={control}
          defaultValue={null}
          render={({
            field: {onChange, value},
            fieldState: {error, invalid},
          }) => (
            <DatePicker
              label={<FormattedMessage id={label} />}
              value={value}
              onChange={value => onChange(value)}
              renderInput={params => (
                <TextField
                  {...params}
                  helperText={
                    invalid ? <FormattedMessage id={error.message} /> : null
                  }
                  error={invalid}
                  sx={{width: '100%'}}
                />
              )}
            />
          )}
        />
      )}
    </LocalizationProvider>
  )
}

export default CustomDatePicker
