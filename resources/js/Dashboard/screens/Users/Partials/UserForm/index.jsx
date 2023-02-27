import AsyncSelect from '@/components/Form/components/AsyncSelect'
import CustomDatePicker from '@/components/Form/components/CustomDatePicker'
import CustomInput from '@/components/Form/components/CustomInput'
import Dropdown from '@/components/Form/components/Dropdown'
import DropzoneField from '@/components/Form/components/DropzoneField'
import InputPassword from '@/components/Form/components/InputPassword'
import PhoneNumber from '@/components/Form/components/PhoneNumber'
import {FullPageSpinner} from '@/components/lib'
import {useAuth, useClient} from '@/context/auth-context'
import {getErrorsFromResponse} from '@/utils/fromHelper'
import {useGenderHelper} from '@/utils/genderHelper'
import {successWithCustomMessage} from '@/utils/notifications'
import {getRouteWithLang} from '@/utils/routesHelpers'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Alert, Stack} from '@mui/material'
import axios from 'axios'
import {format} from 'date-fns'
import React, {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import CustomCheckbox from '@/components/Form/components/CustomCheckbox'

export default function UserForm() {
  const {id} = useParams()
  const client = useClient()
  const {user: userAuth} = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const usersRoute = getRouteWithLang('/users')
  const [backendErrors, setBackendErrors] = React.useState([])

  const {genderArray, getTranslationValue, getTranslation} = useGenderHelper()

  const UserSchema = Yup.object().shape({
    username: Yup.string().required('username_is_required'),
    email: Yup.string()
      .email('valid_email_address')
      .required('email_is_required'),
    fullName: Yup.string().required('name_is_required'),
    password: id
      ? ''
      : Yup.string()
          .typeError('password_is_required')
          .required()
          .matches(
            /^(?=.*[A-Z])(?=.*[a-z])?(?=.*\d)(?=.*[~@$!%*#?&()\-_=+\[\]{};:'"\\/<>|`,.])?[A-Za-z\d~@$!%*#?&()\-_=+\[\]{};:'"\\/<>|`,.]{8,}$/,
            'password_must_contain_8_Characters_one_capital_character_and_one_number_at_least',
          ),
    phoneNumber: Yup.string()
      .min(4, 'phone_number_must_be_at_least_4_characters')
      .max(12, 'phone_number_must_be_at_most_12_characters')
      .required('phone_number_is_required'),
    country: Yup.object()
      .shape({
        id: Yup.number().required(),
      })
      .typeError('country_is_required')
      .required(),
    userGroup: Yup.object()
      .shape({
        id: Yup.number().required(),
      })
      .typeError('usergroup_is_required')
      .required(),
    rolesGroups: Yup.object()
      .shape({
        id: Yup.number().required(),
      })
      .typeError('roles_groups_is_required')
      .required(),
    dateOfBirth: Yup.date()
      .required('date_is_required')
      .typeError('enter_valid_date'),
    gender: Yup.string().required('gender_is_required'),
    avatar: Yup.mixed(),
    trusted: Yup.boolean().nullable(),
  })

  const {isLoading: fetchLoading, data: user} = useQuery({
    queryKey: `user_${id}`,
    queryFn: () => client(`users/${id}`).then(data => data),
    enabled: id !== undefined,
  })

  const {
    control,
    handleSubmit,
    reset,
    trigger,
    watch,
    setValue,
    formState: {errors, isDirty},
  } = useForm({
    resolver: yupResolver(UserSchema),
    defaultValues: {
      trusted: null,
      username: '',
      phoneNumber: '',
      password: '',
      email: '',
      fullName: '',
      country: [],
      userGroup: [],
      rolesGroups: [],
      gender: '',
      avatar: '',
      dateOfBirth: '',
    },
  })

  const onFileChange = async (name, files) => {
    setValue(name, files, {shouldDirty: true})
    if (files?.file) {
      await trigger(['avatar'])
    }
  }

  useEffect(() => {
    if (user && id !== undefined) {
      reset({
        ...user,
        username: user?.data?.username,
        email: user?.data?.email,
        fullName: user?.data?.fullName,
        trusted: user?.data?.trusted,
        country: user?.data?.country,
        userGroup: user?.data?.userGroup,
        rolesGroups: user?.data?.rolesGroups[0],
        phoneNumber: user?.data?.phoneNumber,
        password: user?.data?.password,
        dateOfBirth: user?.data?.dateOfBirth,
        gender: getTranslation(user?.data?.gender) || '',
        avatar: user?.data?.avatarFileUrl,
      })
    }
  }, [user])

  const {mutate, isError, error, isLoading} = useMutation(
    data =>
      axios({
        url: id ? `/api/users/${id}` : `/api/users`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: userAuth?.token
            ? `Bearer ${userAuth?.token}`
            : undefined,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
        navigate(`${usersRoute}`)
        reset()
        if (id) successWithCustomMessage('updated_success_msg')
        else successWithCustomMessage('added_success_msg')
      },
      onError: error => {
        let errors = getErrorsFromResponse(error)
        setBackendErrors(errors)
      },
    },
  )

  const onSubmitForm = ({
    username,
    email,
    fullName,
    country,
    userGroup,
    rolesGroups,
    phoneNumber,
    password,
    dateOfBirth,
    gender,
    avatar,
    trusted,
  }) => {
    const formData = new FormData()
    formData.append('username', username)
    formData.append('phoneNumber', phoneNumber)
    formData.append('email', email)
    formData.append('fullName', fullName)
    formData.append('trusted', trusted)
    formData.append('country', country?.id)
    formData.append('userGroup', userGroup?.id)
    formData.append('rolesGroups[]', rolesGroups?.id)
    formData.append('dateOfBirth', format(dateOfBirth, 'dd/MM/yyyy'))
    formData.append('gender', getTranslationValue(gender))
    !avatar
      ? formData.append('avatar', null)
      : formData.append('avatar', avatar)
    password != null && formData.append('password', password)
    mutate(formData)
  }

  if (fetchLoading) {
    return <FullPageSpinner />
  }

  return (
    <>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmitForm)}>
        <Stack spacing={3}>
          {isError ? (
            <Alert severity="error">
              {backendErrors.map(({filedName, errorMessage}) => {
                return (
                  <div>
                    <FormattedMessage id={filedName} />
                    <p>{errorMessage}</p>
                  </div>
                )
              })}
            </Alert>
          ) : null}
          <CustomCheckbox label="trusted" name="trusted" control={control} />

          <AsyncSelect
            name={'rolesGroups'}
            title={'roles_group'}
            optionLabel={'name'}
            optionUrl={'roles-groups'}
            errors={errors}
            control={control}
          />
          <AsyncSelect
            name={'userGroup'}
            title={'user_group'}
            optionLabel={'name'}
            optionUrl={'user-groups'}
            errors={errors}
            control={control}
          />

          <CustomInput
            label="fullName"
            name="fullName"
            control={control}
            errors={errors}
          />

          <CustomInput
            label="email"
            name="email"
            control={control}
            errors={errors}
          />
          <CustomInput
            label="username"
            name="username"
            control={control}
            errors={errors}
          />

          <AsyncSelect
            name={'country'}
            title={'country'}
            optionLabel={'name'}
            optionUrl={'countries'}
            errors={errors}
            control={control}
          />

          <PhoneNumber
            label="phone_number"
            name="phoneNumber"
            control={control}
            errors={errors}
            dialcode={watch('country')?.dialCode}
          />
          {!id && (
            <InputPassword
              label="password"
              name="password"
              control={control}
              errors={errors}
            />
          )}
          <Dropdown
            label="gender"
            name="gender"
            title="gender"
            options={genderArray}
            control={control}
            errors={errors}
            handleChange={value => {
              setValue('gender', value, {shouldDirty: true})
            }}
          />

          <CustomDatePicker
            label="dateOfBirth"
            name="dateOfBirth"
            control={control}
            errors={errors}
            time={false}
          />
          <DropzoneField
            name="avatar"
            control={control}
            InputChange={(name, files) => onFileChange(name, files)}
            errors={errors}
            editValue={user?.data?.avatarFileUrl}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="flex-end"
          sx={{my: 2}}
        >
          <LoadingButton
            onClick={() => navigate(-1)}
            size="large"
            variant="contained"
            sx={{mr: 2}}
          >
            <FormattedMessage id="cancel" />
          </LoadingButton>
          <LoadingButton
            size="large"
            type="submit"
            variant="contained"
            loading={isLoading}
            disabled={!isDirty}
          >
            {id !== undefined ? (
              <FormattedMessage id="update_user" />
            ) : (
              <FormattedMessage id="save" />
            )}
          </LoadingButton>
        </Stack>
      </form>
    </>
  )
}
