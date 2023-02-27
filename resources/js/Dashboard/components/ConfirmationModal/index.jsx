import {LoadingButton} from '@mui/lab'
import {Modal, Stack} from '@mui/material'
import React from 'react'
import {FormattedMessage} from 'react-intl'
import {styled} from '@mui/material/styles'

const ModalWrapper = styled(Modal)(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
}))

const StyledModal = styled('modal')(({theme}) => ({
  width: 450,
  height: 200,
  backgroundColor: theme.palette.background.paper,
  padding: 10,
  borderWidth: 0,
  outline: 'none',
  borderRadius: 5,
  boxShadow: '0 2.5px 10px 0 rgba(0, 0, 0, 0.16)',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
}))

const StyledStack = styled(Stack)(({theme}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  width: '90%',
  height: '85%',
}))

const Header = styled('header')(({theme}) => ({
  fontSize: '20px',
  textAlign: theme.direction === 'ltr' ? 'left' : 'right',
  padding: 20,
}))

//---------------------------------------------------------------

const ConfirmationModal = ({
  confirmation,
  closeConfirmation,
  onSave,
  message,
  isLoading,
}) => {
  return (
    <>
      <ModalWrapper open={confirmation}>
        <StyledModal>
          <Header>
            <FormattedMessage id="are_you_sure_you_want_to" /> {message}
          </Header>
          <StyledStack
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
            sx={{my: 2}}
          >
            <LoadingButton
              onClick={closeConfirmation}
              size="large"
              type="submit"
              variant="contained"
              sx={{mr: 2}}
            >
              <FormattedMessage id="cancel" />
            </LoadingButton>
            <LoadingButton
              size="large"
              variant="contained"
              onClick={onSave}
              loading={isLoading}
            >
              <FormattedMessage id="confirm" />
            </LoadingButton>
          </StyledStack>
        </StyledModal>
      </ModalWrapper>
    </>
  )
}
export default ConfirmationModal
