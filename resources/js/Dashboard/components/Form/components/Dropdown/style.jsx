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
  },
}))

export default useStyles
