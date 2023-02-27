import AsyncSelect from '@/components/Form/components/AsyncSelect'
import {FullPageSpinner} from '@/components/lib'
import {useClient} from '@/context/auth-context'
import {getErrorsFromResponse} from '@/utils/fromHelper'
import {successWithCustomMessage} from '@/utils/notifications'
import {getRouteWithLang} from '@/utils/routesHelpers'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Alert, Stack} from '@mui/material'
import React from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'

export default function NotificationsForm() {
  const {id} = useParams()
  const client = useClient()
  const notificationsRoute = getRouteWithLang('/notifications')
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [backendErrors, setBackendErrors] = React.useState([])

  const NotificationsSchema = Yup.object().shape({
    notificationTemplate: Yup.object()
      .typeError('notification_template_is_required')
      .required(),
    users: Yup.array()
      .min(1, 'item_moreThan_1')
      .typeError('users_is_required')
      .required(),
  })

  const {isLoading: fetchLoading} = useQuery({
    queryKey: `notifications_${id}`,
    queryFn: () => client(`notifications/${id}`).then(data => data.data),
    enabled: id !== undefined,
  })

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: {errors, isDirty},
  } = useForm({
    resolver: yupResolver(NotificationsSchema),
    defaultValues: {
      notificationTemplate: '',
      users: [],
    },
  })

  const {mutate, isError, isLoading} = useMutation(
    data =>
      client(`notifications/${data?.notificationTemplate?.id}/send`, {
        method: 'POST',
        data: {users: data.users},
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('notifications')
        navigate(`${notificationsRoute}`)
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
  const onSubmitForm = ({notificationTemplate, users}) => {
    mutate({
      notificationTemplate: notificationTemplate,
      users: users.map(user => user.id),
    })
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

          <AsyncSelect
            name={'notificationTemplate'}
            title={'notification_template'}
            optionLabel={'name'}
            optionUrl={'notification-templates'}
            errors={errors}
            control={control}
          />

          <AsyncSelect
            name={'users'}
            title={'users'}
            optionLabel={'username'}
            optionUrl={'users'}
            errors={errors}
            control={control}
            multiple={true}
            handleChange={(event, values, reason) => {
              setValue('users', values)
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
              <FormattedMessage id="update_notification" />
            ) : (
              <FormattedMessage id="send" />
            )}
          </LoadingButton>
        </Stack>
      </form>
    </>
  )
}
