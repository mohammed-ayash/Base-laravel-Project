import {styled} from '@mui/material/styles'
import JoditEditor from 'jodit-react'
import React, {useMemo, useRef} from 'react'
import {Controller} from 'react-hook-form'
import { Paper ,Typography,Box} from '@mui/material'
import { FormattedMessage } from 'react-intl'
import { useTheme} from '@mui/material'
import useLang from '../../../../hooks/useLang'
import { borderRadius } from '@mui/system'


const ErrorText = styled('div')(({theme}) => ({
  color: '#f44336',
  marginLeft: '14px',
  marginRight: '14px',
  margin: '0',
  fontSize: '0.75rem',
  marginTop: '3px',
  textAlign: theme.direction === 'ltr' ? 'left' : 'right',
  fontFamily: `"Roboto", "Helvetica", "Arial", sans-serif`,
  fontWeight: '400',
  lineHeight: '1.66',
  letterSpacing: '0.03333em',
}))

const RichText = ({
  editDisabled,
  errorText,
  InputChange,
  name,
  label,
  editValue,
  value,
}) => {
  const editor = useRef(null)
  const {lang} = useLang()
  let placeholder = lang === 'ar' ? 'الوصف':'Description'
  const theme = useTheme()
  const config = useMemo(
    () => ({
      readonly: editDisabled,
      // showPlaceholder: false,
      placeholder: placeholder,
      // uploader: {
      //   insertImageAsBase64URI: true, // set false if you want to load images via ajax
      //   // imagesExtensions: ['jpg', 'png', 'jpeg', 'gif'],
      //   // url: url,  // url to upload image
      //   // i18n: 'en',
      //   // withCredentials: false,
      //   // pathVariableName: 'path',
      //   // format: 'json',
      //   // method: 'POST',
      //   // headers: {
      //   //   Authorization: token, // set token in header
      //   // },
      //   // filesVariableName(i) {
      //   //   return `file`   // set name of file variable
      //   // },
      //   // isSuccess: function (resp) {
      //   //   return resp
      //   // },
      //   // process: function (resp) {
      //   //   return {
      //   //     files: resp.content,
      //   //     path: `${resp.images_prefix}${resp.content}`,
      //   //     baseurl: resp.images_prefix,
      //   //     error: resp.error_des,
      //   //     // message: resp.data.message
      //   //   }
      //   // },
      //   // defaultHandlerSuccess: function (data) {
      //   //   this.s.insertImage(data.path) // insert image to editor
      //   // },
      // },
      toolbarButtonSize: 'large',
      removeButtons: [
        'video',
        'table',
        'file',
        'source',
        'about',
        'fullsize',
        'hr',
        'link',
        // "selectall",
        'spellcheck',
        'copyformat',
        'spellcheck',
        'brush',
        'font',
        'classSpan',
        'image',
      ],
      showPlaceholder: true,
      statusbar: false,
      tabIndex: 0,
      color:'black',
      theme:theme.palette.mode,
      style: {
        width: '100%',
        backgroundColor:theme.palette.mode ==='dark' ? theme.palette.background.default : theme.palette.background.paper,
      },
    }),
    [editDisabled],
  )

  return (
    <div>
      <div
        style={{
          borderColor: errorText ? 'red' : '',
        }}
      >
        <Box 
        
        sx={{
          '& > div > div > div:nth-child(1)':{
            backgroundColor:`${theme.palette.background.default} !important`, 
          },
          '& > div > div:nth-child(1)':{
            backgroundColor:"transparent",
          },
          '& *::after':{
            display:theme.palette.mode === 'dark'? 'none' : '',
          },
          '& *':{
            border:'0px !important',
            'background-image':`repeating-linear-gradient(transparent 0,transparent 43px,transparent 44px) !important`
          },
          '& > div > div:nth-child(1) > div:nth-child(2)'
          :{
            border:`2px solid ${theme.palette.mode === 'dark' ? `${theme.palette.background.paper}`: `${theme.palette.background.default}`} !important`,
            borderTop:`4px solid ${theme.palette.mode === 'dark' ? `${theme.palette.background.paper}`: `${theme.palette.background.default}`} !important`,
            borderRadius:' 0px 0px 4px 4px'
          }
        }}
          
          
          >

        <JoditEditor
          ref={editor}
          value={value}
          config={config}
          onChange={newContent => InputChange(newContent)}
          
        />
        </Box>
      </div>
      <ErrorText>{!!errorText ? errorText : ''}</ErrorText>
    </div>
  )
}



const RichSection = ({control, errors, name, label}) => {
  return (
    <>
      <Paper
        sx={{
          padding: '0.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.8rem',
        }}
      >
        <Typography sx={{fontSize: '1.2rem'}}>
          <FormattedMessage id={label} />
        </Typography>
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value}}) => (<>
            <RichText
              label={label}
              errorText={errors[name] ? <FormattedMessage id={errors[name]?.message} /> : ''}
              width="100%"
              InputChange={values => onChange(values)}
              value={value}
              editValue={value}
              />
            
          </>
          )}

        />
      </Paper>
    </>
  )
}

export default RichSection
