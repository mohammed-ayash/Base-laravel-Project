import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(heme => ({
  root: {
    maxWidth: '100%',
    '& .MuiPaper-rounded': {
      borderRadius: 'unset',
    },
    '& .MuiDialogActions-root': {
      backgroundColor: '#151515',
    },
    '& .MuiButton-root:hover': {
      color: '#fff',
    },
    '& .MuiDialog-paperWidthSm': {
      maxWidth: '100%',
    },
    '& .tui-image-editor-header-logo': {
      display: 'none',
    },
    '& .tui-image-editor-help-menu': {
      left: '49%',
    },
  },
  saveBtn: {
    backgroundColor: '#fdba3b',
    color: '#FFF',
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: '12px',
    width: '7rem',
    borderRadius: '20px',
  },
  canselBtn: {
    backgroundColor: '#fff',
    color: '#222',
    fontFamily: "'Noto Sans', sans-serif",
    fontSize: '12px',
    width: '7rem',
    borderRadius: '20px',
  },
}))

export default useStyles
