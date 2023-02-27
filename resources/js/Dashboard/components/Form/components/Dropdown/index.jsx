import {
  Autocomplete,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material'
import React, {useState, useEffect} from 'react'
import {Controller} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import useStyles from './style'

export default function Dropdown({
  title,
  setValue,
  editValue,
  name,
  width,
  optionUrl,
  control,
  optionLabel,
  errors,
  multiple = false,
  options,
  handleChange,
}) {
  const classes = useStyles()
  const [open, setOpen] = useState(false)
  return (
    <Controller
      control={control}
      name={name}
      render={props => {
        let {onChange, value} = props.field
        return (
          <Autocomplete
            multiple={multiple}
            sx={{flexBasis: !!width ? width : '100%'}}
            open={open}
            onOpen={() => {
              setOpen(true)
            }}
            onClose={() => {
              setOpen(false)
            }}
            options={options}
            isOptionEqualToValue={(option, value) => {
              return optionLabel
                ? option[optionLabel] === value[optionLabel]
                : option === value
            }}
            getOptionLabel={option => {
              return optionLabel ? option[optionLabel] : option
            }}
            renderOption={dataSet => {
              return (
                <Typography
                  component="li"
                  {...dataSet}
                  key={`${dataSet?.key}`}
                  noWrap
                >
                  <FormattedMessage id={`${dataSet?.key}`} />
                </Typography>
              )
            }}
            renderInput={params => {
              return (
                <TextField
                  {...params}
                  label={<FormattedMessage id={title} />}
                  className={classes.input}
                  error={Boolean(errors[name] && errors[name])}
                  helperText={
                    errors[name] && (
                      <FormattedMessage id={errors[name]?.message} />
                    )
                  }
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                  onChange={onChange}
                />
              )
            }}
            onChange={(event, values, reason) => handleChange(values)}
            value={value}
          />
        )
      }}
    />
  )
}
