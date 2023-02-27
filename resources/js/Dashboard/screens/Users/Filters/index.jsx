import AsyncSelect from '@/components/Form/components/AsyncSelect'
import Dropdown from '@/components/Form/components/Dropdown'
import useQueryParams from '@/hooks/useQueryParams'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Grid, IconButton, Stack, Tooltip, Typography} from '@mui/material'
import queryString from 'query-string'
import React from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import * as Yup from 'yup'
import CustomInput from '@/components/Form/components/CustomInput'
import Iconify from '@/components/Iconify'
import {useGenderHelper} from '@/utils/genderHelper'

// ----------------------------------------------------------------------

export default function FiltersForm() {
  const {
    setQueryParams,
    removeArrayOfQueryParams,
    getQueryParams,
    removeQueryParams,
  } = useQueryParams()

  const {genderArray, booleanArray, getTranslationValue, getTranslation} =
    useGenderHelper()

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(!open)

  const Schema = Yup.object().shape({})

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
      search: '',
      gender: '',
      blocked: '',
      country: [],
      userGroup: [],
      verified: '',
      email: '',
      phoneNumber: '',
      roleGroup: [],
      trusted: '',
    },
  })
  React.useEffect(() => {
    if (
      getQueryParams('search') ||
      getQueryParams('userGroup') ||
      getQueryParams('country') ||
      getQueryParams('gender') ||
      getQueryParams('blocked') ||
      getQueryParams('email') ||
      getQueryParams('phoneNumber') ||
      getQueryParams('verified') ||
      getQueryParams('roleGroup') ||
      getQueryParams('trusted')
    ) {
      reset({
        search: getQueryParams('search'),
        userGroup: queryString.parse(getQueryParams('userGroup')),
        country: queryString.parse(getQueryParams('country')),
        gender: getTranslation(getQueryParams('gender')),
        blocked: getTranslation(getQueryParams('blocked')),
        verified: getTranslation(getQueryParams('verified')),
        trusted: getTranslation(getQueryParams('trusted')),
        email: getQueryParams('email'),
        phoneNumber: getQueryParams('phoneNumber'),
        roleGroup: getQueryParams('roleGroup'),
      })
      handleOpen()
    }
  }, [])
  const onSubmitForm = ({
    search,
    userGroup,
    country,
    gender,
    blocked,
    verified,
    phoneNumber,
    email,
    roleGroup,
    trusted,
  }) => {
    if (getValues('search')) {
      setQueryParams('search', search)
    } else {
      removeQueryParams('search')
    }

    if (getValues('blocked')) {
      setQueryParams('blocked', getTranslationValue(blocked))
    } else {
      removeQueryParams('blocked')
    }

    if (getValues('gender')) {
      setQueryParams('gender', getTranslationValue(gender))
    } else {
      removeQueryParams('gender')
    }
    if (
      getValues('userGroup') &&
      Object.keys(getValues('userGroup')).length > 0
    ) {
      setQueryParams(
        'userGroup',
        queryString.stringify({id: userGroup.id, name: userGroup.name}),
      )
    } else {
      removeQueryParams('userGroup')
    }
    if (getValues('country') && Object.keys(getValues('country')).length > 0) {
      setQueryParams(
        'country',
        queryString.stringify({id: country.id, name: country.name}),
      )
    } else {
      removeQueryParams('country')
    }
    if (getValues('verified')) {
      setQueryParams('verified', getTranslationValue(verified))
    } else {
      removeQueryParams('verified')
    }
    if (getValues('trusted')) {
      setQueryParams('trusted', getTranslationValue(trusted))
    } else {
      removeQueryParams('trusted')
    }
    if (getValues('email')) {
      setQueryParams('email', email)
    } else {
      removeQueryParams('email')
    }

    if (getValues('phoneNumber')) {
      setQueryParams('phoneNumber', phoneNumber)
    } else {
      removeQueryParams('phoneNumber')
    }

    if (
      getValues('roleGroup') &&
      Object.keys(getValues('roleGroup')).length > 0
    ) {
      setQueryParams(
        'roleGroup',
        queryString.stringify({id: roleGroup.id, name: roleGroup.name}),
      )
    } else {
      removeQueryParams('roleGroup')
    }
  }

  const clearFilter = () => {
    reset({
      search: '',
      userGroup: [],
      country: [],
      gender: '',
      blocked: '',
      phoneNumber: '',
      verified: '',
      roleGroup: [],
      trusted: '',
    })
    removeArrayOfQueryParams([
      'search',
      'userGroup',
      'country',
      'gender',
      'blocked',
      'blocked',
      'phoneNumber',
      'verified',
      'roleGroup',
      'trusted',
    ])
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
          <Grid container rowSpacing={3} columnSpacing={2}>
            <Grid item xs={6}>
              <CustomInput
                label="name"
                name="search"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                label="email"
                name="email"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={6}>
              <AsyncSelect
                name={'country'}
                title={'country'}
                optionLabel={'name'}
                optionUrl={'countries'}
                errors={errors}
                control={control}
              />
            </Grid>
            <Grid item xs={6}>
              <CustomInput
                label="phone_number"
                name="phoneNumber"
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={6}>
              <AsyncSelect
                title="roles_group"
                name="roleGroup"
                optionLabel={'name'}
                optionUrl={'roles-groups'}
                control={control}
                errors={errors}
              />
            </Grid>
            <Grid item xs={6}>
              <AsyncSelect
                name={'userGroup'}
                title={'usergroups'}
                optionLabel={'name'}
                optionUrl={'user-groups'}
                errors={errors}
                control={control}
              />
            </Grid>

            <Grid item xs={6}>
              <Dropdown
                label="blocked"
                name="blocked"
                title="blocked"
                options={booleanArray}
                control={control}
                errors={errors}
                handleChange={value => {
                  setValue('blocked', value)
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Dropdown
                label="verified"
                name="verified"
                title="verified"
                options={booleanArray}
                control={control}
                errors={errors}
                handleChange={value => {
                  setValue('verified', value)
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Dropdown
                label="gender"
                name="gender"
                title="gender"
                options={genderArray}
                control={control}
                errors={errors}
                handleChange={value => {
                  setValue('gender', value)
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <Dropdown
                label="trusted"
                name="trusted"
                title="trusted"
                options={booleanArray}
                control={control}
                errors={errors}
                handleChange={value => {
                  setValue('trusted', value)
                }}
              />
            </Grid>
          </Grid>
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
