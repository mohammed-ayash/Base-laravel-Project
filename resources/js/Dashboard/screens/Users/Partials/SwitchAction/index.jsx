import ConfirmationModal from '@/components/ConfirmationModal'
import {useClient} from '@/context/auth-context'
import {
  errorWithCustomMessage,
  successWithCustomMessage,
} from '@/utils/notifications'
import {Switch} from '@mui/material'
import React, {useEffect, useState} from 'react'
import {FormattedMessage} from 'react-intl'
import {useMutation, useQueryClient} from 'react-query'

function SwitchAction({row}) {
  let {id, blocked} = row
  const [checked, setChecked] = useState(blocked)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const client = useClient()
  const queryClient = useQueryClient()

  const handleConfirmation = () => {
    setOpenConfirmation(!openConfirmation)
  }

  const {mutate, isLoading} = useMutation(
    data =>
      client(`users/${id}`, {
        method: 'POST',
        data: data,
      }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users')
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
      blocked: !blocked,
    })
    handleConfirmation()
  }

  useEffect(() => {
    setChecked(blocked)
  }, [blocked])

  return (
    <>
      <Switch checked={checked} onChange={handleConfirmation} />
      {openConfirmation && (
        <ConfirmationModal
          isLoading={isLoading}
          onSave={bulkAction}
          closeConfirmation={handleConfirmation}
          message={
            blocked ? (
              <FormattedMessage id={'un_block_him'} />
            ) : (
              <FormattedMessage id={'block_him'} />
            )
          }
          confirmation={openConfirmation}
        />
      )}
    </>
  )
}

export default SwitchAction
