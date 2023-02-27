import AsyncSelect from '@/components/Form/components/AsyncSelect'
import Dropdown from '@/components/Form/components/Dropdown'
import Iconify from '@/components/Iconify'
import useQueryParams from '@/hooks/useQueryParams'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {IconButton, Stack, Tooltip, Typography} from '@mui/material'
import queryString from 'query-string'
import React from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import * as Yup from 'yup'
import {useGenderHelper} from '@/utils/genderHelper'

// ----------------------------------------------------------------------

export default function FiltersForm() {
  const {
    setQueryParams,
    removeArrayOfQueryParams,
    getQueryParams,
    removeQueryParams,
  } = useQueryParams()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(!open)

  const Schema = Yup.object().shape({})

  const {booleanArray, getTranslationValue, getTranslation} = useGenderHelper()

  const {
    control,
    handleSubmit,
    reset,
    getValues,
    setValue,
    formState: {errors},
  } = useForm({
    resolver: yupResolver(Schema),
    defaultValues: {
      read: '',
      notificationTemplate: '',
      user: '',
    },
  })
  React.useEffect(() => {
    if (
      getQueryParams('read') ||
      getQueryParams('notificationTemplate') ||
      getQueryParams('user')
    ) {
      reset({
        read: getTranslation(getQueryParams('read')),
        user: queryString.parse(getQueryParams('user')).name,
        notificationTemplate: queryString.parse(
          getQueryParams('notificationTemplate'),
        ),
      })
      handleOpen()
    }
  }, [])

  const onSubmitForm = ({read, user, notificationTemplate}) => {
    if (getValues('read')) {
      setQueryParams('read', getTranslationValue(read))
    } else {
      removeQueryParams('read')
    }

    if (getValues('user') && Object.keys(getValues('user')).length > 0) {
      setQueryParams(
        'user',
        queryString.stringify({id: user.id, name: user.username}),
      )
    } else {
      removeQueryParams('user')
    }

    if (
      getValues('notificationTemplate') &&
      Object.keys(getValues('notificationTemplate')).length > 0
    ) {
      setQueryParams(
        'notificationTemplate',
        queryString.stringify({
          id: notificationTemplate.id,
          name: notificationTemplate.name,
        }),
      )
    } else {
      removeQueryParams('notificationTemplate')
    }
  }

  const clearFilter = () => {
    reset({
      read: [],
      notificationTemplate: undefined,
      user: undefined,
    })
    removeArrayOfQueryParams(['read', 'notificationTemplate', 'user'])
  }

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={4}
      >
        <Typography variant="h4">
          <FormattedMessage id="filters" />
        </Typography>
        <Tooltip title="Filter list">
          <IconButton onClick={handleOpen}>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      </Stack>
      {open && (
        <form
          autoComplete="off"
          noValidate
          onSubmit={handleSubmit(onSubmitForm)}
        >
          <Stack spacing={3}>
            <AsyncSelect
              name={'notificationTemplate'}
              title={'notification_template'}
              optionLabel={'name'}
              optionUrl={'notification-templates'}
              errors={errors}
              control={control}
            />
            <AsyncSelect
              name="user"
              title="user"
              optionLabel="username"
              optionUrl="users"
              errors={errors}
              control={control}
            />
            <Dropdown
              label="read"
              name="read"
              title="read"
              control={control}
              errors={errors}
              options={booleanArray}
              handleChange={value => {
                setValue('read', value)
              }}
            />
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{my: 2}}
          >
            <LoadingButton
              size="large"
              variant="outlined"
              onClick={clearFilter}
              sx={{mr: 2}}
            >
              <FormattedMessage id="clear" />
            </LoadingButton>
            <LoadingButton size="large" type="submit" variant="outlined">
              <FormattedMessage id="apply_filter" />
            </LoadingButton>
          </Stack>
        </form>
      )}
    </>
  )
}
