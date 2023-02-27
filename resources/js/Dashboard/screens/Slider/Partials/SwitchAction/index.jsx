import {Switch} from '@mui/material'
import ConfirmationModal from '@/components/ConfirmationModal'
import {useClient} from '@/context/auth-context'
import React, {useState} from 'react'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQueryClient} from 'react-query'
import {
  errorWithCustomMessage,
  successWithCustomMessage,
} from '@/utils/notifications'
import {useEffect} from 'react'

function SwitchAction({row}) {
  let {id, publish} = row
  const [checked, setChecked] = useState(publish)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()

  const handleConfirmation = () => {
    setOpenConfirmation(!openConfirmation)
  }

  const {mutate, isLoading} = useMutation(
    data =>
      client(`sliders/${id}`, {
        method: 'POST',
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('sliders')
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
    mutate({
      publish: !publish,
    })
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