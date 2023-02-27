import React, {useRef} from 'react'
import 'tui-image-editor/dist/tui-image-editor.css'
import 'tui-color-picker/dist/tui-color-picker.css'
import ImageEditor from '@toast-ui/react-image-editor'
import useStyles from './style'
import {Button, Dialog, DialogActions} from '@mui/material'

export default function IMGEditor({open, onClose, image, onSave}) {
  const classes = useStyles()
  const ref = useRef(null)
  const download = () => {
    const wrapper = ref.current.getInstance()
    onSave(wrapper.toDataURL('image/png'))
  }

  return (
    <Dialog open={open} onClose={onClose} className={classes.root}>
      <ImageEditor
        ref={ref}
        includeUI={{
          loadImage: {
            path: image,
            name: 'SampleImage',
          },
          uiSize: {
            width: '1000px',
            height: '700px',
          },
          menuBarPosition: 'bottom',
        }}
        cssMaxHeight={500}
        cssMaxWidth={700}
        selectionStyle={{
          cornerSize: 20,
          rotatingPointOffset: 70,
        }}
        usageStatistics={true}
      />
      <DialogActions>
        <Button onClick={() => onClose(false)} className={classes.canselBtn}>
          Cancel
        </Button>

        <Button onClick={download} className={classes.saveBtn}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}
