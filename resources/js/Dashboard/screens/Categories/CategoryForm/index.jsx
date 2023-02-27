import CustomInput from '@/components/Form/components/CustomInput'
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
import * as React from 'react'
import {useEffect} from 'react'
import {useForm} from 'react-hook-form'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQuery, useQueryClient} from 'react-query'
import {useLocation, useNavigate, useParams} from 'react-router-dom'
import * as Yup from 'yup'
// ----------------------------------------------------------------------

export default function CategoryForm({onSubmit}) {
  const {id} = useParams()
  const {state} = useLocation()
  const client = useClient()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const user = useAuth()
  const categoriesRoute = getRouteWithLang('/categories')
  const CategorySchema = Yup.object().shape({
    name_ar: Yup.string().required('name_ar_is_required'),
    name_en: Yup.string().required('name_en_is_required'),
    image: Yup.mixed().required('image_is_required'),
  })
  const [backendErrors, setBackendErrors] = React.useState([])
  const {
    control,
    handleSubmit,
    reset,
    setError,
    trigger,
    setValue,
    formState: {errors, isDirty},
  } = useForm({
    resolver: yupResolver(CategorySchema),
    defaultValues: {
      name_en: '',
      name_ar: '',
      image: '',
    },
  })

  const {isLoading: fetchLoading, data: category} = useQuery({
    queryKey: 'category',
    queryFn: () => client(`categories/${id}`).then(data => data.data),
    enabled: id !== undefined,
  })

  useEffect(() => {
    if (category && id !== undefined) {
      reset({
        name_en: category?.translations.en.name,
        name_ar: category?.translations.ar.name,
        image: category?.imageFileUrl,
      })
    }
  }, [category])

  const {mutate, isError, isLoading} = useMutation(
    data =>
      axios({
        url: id ? `/api/categories/${id}` : `/api/categories`,
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
        queryClient.invalidateQueries('categories')
        navigate(`${categoriesRoute}`)
        successWithCustomMessage('added_success_msg')
        reset()
      },
      onError: error => {
        let errors = getErrorsFromResponse(error)
        setBackendErrors(errors)
      },
    },
  )

  const onSubmitForm = ({name_en, name_ar, image}) => {
    const formData = new FormData()
    {
      typeof image === 'object' && formData.append('image', image)
    }
    formData.append('translations[en][name]', name_en)
    formData.append('translations[ar][name]', name_ar)
    formData.append('sortOrder', 1)

    if (state === null && !id) {
      //add parent
      formData.append('parent', null)
    } else if (state !== null && !id) {
      //add child
      formData.append('parent', state?.id)
    } else {
      //edit
      if (state.parent === null) {
        //edit parent
        formData.append('parent', null)
      } else {
        //edit child
        formData.append('parent', category?.parent?.id)
      }
    }
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
    <form noValidate onSubmit={handleSubmit(onSubmitForm)}>
      <Stack spacing={3}>
        {backendErrors.length !== 0 ? (
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
        <CustomInput
          autoFocus
          label="category_name_en"
          name="name_en"
          control={control}
          errors={errors}
        />
        <CustomInput
          label="category_name_ar"
          name="name_ar"
          control={control}
          errors={errors}
        />
        <DropzoneField
          name="image"
          control={control}
          InputChange={(name, files) => onFileChange(name, files)}
          errors={errors}
          editValue={category?.imageFileUrl}
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
          onClick={() => navigate(`${categoriesRoute}`)}
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
          loading={isLoading && !isError}
          disabled={!isDirty}
        >
          {id ? (
            <FormattedMessage id="update_category" />
          ) : (
            <FormattedMessage id="save" />
          )}
        </LoadingButton>
      </Stack>
    </form>
  )
}
