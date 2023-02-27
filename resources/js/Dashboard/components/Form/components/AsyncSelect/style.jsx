import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(theme => ({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  input: {
    width: '100%',
    // marginTop: '10px',
    // '& .MuiFormHelperText-root': {
    //   color: 'red',
    // },
    // '& .MuiInput-underline:hover:not(.Mui-disabled):before': {
    //   borderBottom: '2px solid rgb(6 126 122)',
    // },
    // '& .MuiInput-underline:before': {
    //   borderBottom: '1px solid rgb(6 126 122)',
    // },
  },
}))

export default useStyles
