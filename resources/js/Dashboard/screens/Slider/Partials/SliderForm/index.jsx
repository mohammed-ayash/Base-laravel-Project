import CustomCheckbox from '@/components/Form/components/CustomCheckbox'
import DropzoneField from '@/components/Form/components/DropzoneField'
import {FullPageSpinner} from '@/components/lib'
import {useAuth, useClient} from '@/context/auth-context'
import {getErrorsFromResponse} from '@/utils/fromHelper'
import {successWithCustomMessage} from '@/utils/notifications'
import {getRouteWithLang} from '@/utils/routesHelpers'
import {yupResolver} from '@hookform/resolvers/yup'
import {LoadingButton} from '@mui/lab'
import {Alert, Stack} from '@mui/material'
import axios from 'axios'
import React, {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
import RichSection from '@/components/Form/components/RichText'

export default function SliderForm() {
  const {id} = useParams()
  const client = useClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const slidersRoute = getRouteWithLang('/sliders')
  const user = useAuth()

  const [backendErrors, setBackendErrors] = React.useState([])

  const SliderSchema = Yup.object().shape({
    publish: Yup.boolean().nullable(),
    description_en: Yup.string().nullable(),
    description_ar: Yup.string().nullable(),
    image: Yup.mixed().required('image_is_required'),
  })

  const {isLoading: fetchLoading, data: slider} = useQuery({
    queryKey: `slider_${id}`,
    queryFn: () => client(`sliders/${id}`).then(data => data.data),
    enabled: id !== undefined,
  })

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    setError,
    formState: {errors, isDirty},
  } = useForm({
    resolver: yupResolver(SliderSchema),
    defaultValues: {
      publish: false,
      description_en: '',
      description_ar: '',
      image: '',
    },
  })
  useEffect(() => {
    if (slider && id !== undefined) {
      reset({
        sortOrder: slider.sortOrder,
        description_en: slider.translations.en.description,
        description_ar: slider.translations.ar.description,
        image: slider.imageFileUrl,
        publish: slider.publish,
      })
    }
  }, [slider])
  const {mutate, isError, isLoading} = useMutation(
    data =>
      axios({
        url: id ? `/api/sliders/${id}` : `/api/sliders`,
        method: 'POST',
        data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: user?.user?.token
            ? `Bearer ${user?.user?.token}`
            : undefined,
        },
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sliders')
        navigate(`${slidersRoute}`)
        if (id) successWithCustomMessage('updated_success_msg')
        else successWithCustomMessage('added_success_msg')
        reset()
      },
      onError: error => {
        let errors = getErrorsFromResponse(error)
        setBackendErrors(errors)
      },
    },
  )

  const onSubmitForm = ({description_en, description_ar, image, publish}) => {
    const formData = new FormData()
    {
      typeof image === 'object' && formData.append('image', image)
    }
    formData.append('publish', publish)
    formData.append('translations[en][description]', description_en)
    formData.append('translations[ar][description]', description_ar)
    mutate(formData)
  }
  const onFileChange = async (name, files) => {
    setValue(name, files, {shouldDirty: true})
    if (files?.file) {
      await trigger(['image'])
    }
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
          <CustomCheckbox label="publish" name="publish" control={control} />

          <RichSection
            label="description_en"
            name="description_en"
            control={control}
            errors={errors}
          />
          <RichSection
            label="description_ar"
            name="description_ar"
            control={control}
            errors={errors}
          />

          <DropzoneField
            name="image"
            control={control}
            InputChange={(name, files) => onFileChange(name, files)}
            errors={errors}
            editValue={slider?.imageFileUrl}
            thumbActions={false}
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
              <FormattedMessage id="update_slider" />
            ) : (
              <FormattedMessage id="save" />
            )}
          </LoadingButton>
        </Stack>
      </form>
    </>
  )
}
