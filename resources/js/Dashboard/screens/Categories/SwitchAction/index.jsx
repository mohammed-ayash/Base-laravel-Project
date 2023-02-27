import ConfirmationModal from '@/components/ConfirmationModal'
import {useAuth, useClient} from '@/context/auth-context'
import {
  errorWithCustomMessage,
  successWithCustomMessage,
} from '@/utils/notifications'
import {Switch} from '@mui/material'
import axios from 'axios'
import React, {useEffect, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQueryClient} from 'react-query'

function SwitchAction({row}) {
  let {id, publish} = row
  const [checked, setChecked] = useState(publish)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()
  const user = useAuth()

  const handleConfirmation = () => {
    setOpenConfirmation(!openConfirmation)
  }

  const {mutate, isLoading} = useMutation(
    data =>
      axios({
        url: `/api/categories/${id}`,
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
        setChecked(!checked)
        successWithCustomMessage('updated_success_msg')
        handleConfirmation()
      },
      onError: data => {
        errorWithCustomMessage(data?.error)
      },
    },
  )
  const bulkAction = () => {
    const formData = new FormData()
    formData.append('publish', !publish)
    mutate(formData)
    handleConfirmation()
  }

  useEffect(() => {
    setChecked(publish)
  }, [publish])

  return (
    <>
      <Switch checked={checked} onChange={handleConfirmation} />
      {openConfirmation && (
        <ConfirmationModal
          isLoading={isLoading}
          onSave={bulkAction}
          closeConfirmation={handleConfirmation}
          message={
            publish ? (
              <FormattedMessage id={'un_publish'} />
            ) : (
              <FormattedMessage id={'publish'} />
            )
          }
          confirmation={openConfirmation}
        />
      )}
    </>
  )
}

export default SwitchAction
