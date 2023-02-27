import React from 'react'
import {Avatar, ClickAwayListener, Modal, Box} from '@mui/material'
const ImageModal = ({row}) => {
  let {id, imageFileUrl} = row
  const [preview, setPreview] = React.useState(false)

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'transparent',

    maxHeight: '80%',
    overflow: 'auto',
    '&::-webkit-scrollbar': {
      width: '8px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#707070',
      borderRadius: '6px',
      padding: '2px',
      visibility: 'hidden',
    },
    '&:hover': {
      '&::-webkit-scrollbar-thumb': {
        visibility: 'visible',
      },
    },
  }

  const handleClose = () => {
    setPreview(false)
  }

  return (
    <>
      <Avatar
        onClick={() => setPreview(!preview)}
        variant="rounded"
        style={{width: 50, cursor: 'pointer'}}
        alt={`photo-${id}`}
        src={imageFileUrl}
      />
      {preview && (
        <ClickAwayListener onClickAway={handleClose}>
          <Box>
            <Modal
              open={preview}
              onClose={handleClose}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <img src={imageFileUrl} />
              </Box>
            </Modal>
          </Box>
        </ClickAwayListener>
      )}
    </>
  )
}

export default ImageModal
