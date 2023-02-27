import React from 'react'
import {Modal, styled, Box} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import {ModalSpinner} from './lib'

const ModalWrapper = styled(Modal)(() => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 10,
}))

const StyledModal = styled('modal')(({theme}) => ({
  width: 450,
  height: 200,
  backgroundColor: 'transparent',
  padding: 10,
  borderWidth: 0,
  outline: 'none',
  borderRadius: 5,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
}))

const Loading = ({loading}) => {
  return (
    <>
      <ModalWrapper open={loading}>
        <StyledModal>
          <CircularProgress />
        </StyledModal>
      </ModalWrapper>
    </>
  )
}

export default Loading
