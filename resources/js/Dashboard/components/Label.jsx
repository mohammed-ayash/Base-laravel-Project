import * as React from 'react'
import PropTypes from 'prop-types'
// @mui
import {alpha, styled} from '@mui/material/styles'
import {Box} from '@mui/material'
import {FormattedMessage} from 'react-intl'

// ----------------------------------------------------------------------

const RootStyle = styled('span')(({theme, ownerState}) => {
  const isLight = theme.palette.mode === 'light'
  const {color, variant} = ownerState

  const colorObj = color => {
    return theme.palette[color] ?? theme.palette.success
  }

  const styleFilled = color => ({
    color: colorObj(color).contrastText,
    backgroundColor: colorObj(color).main,
  })

  const styleOutlined = color => ({
    color: colorObj(color).main,
    backgroundColor: 'transparent',
    border: `1px solid ${colorObj(color).main}`,
  })

  const styleGhost = color => ({
    color: colorObj(color)[isLight ? 'dark' : 'light'],
    backgroundColor: alpha(colorObj(color).main, 0.16),
  })

  return {
    height: 22,
    minWidth: 22,
    lineHeight: 0,
    borderRadius: 6,
    cursor: 'default',
    alignItems: 'center',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    justifyContent: 'center',
    padding: theme.spacing(0, 1),
    color: theme.palette.grey[800],
    fontSize: theme.typography.pxToRem(12),
    fontFamily: theme.typography.fontFamily,
    backgroundColor: theme.palette.grey[300],
    fontWeight: theme.typography.fontWeightBold,

    ...(color !== 'default'
      ? {
          ...(variant === 'filled' && {...styleFilled(color)}),
          ...(variant === 'outlined' && {...styleOutlined(color)}),
          ...(variant === 'ghost' && {...styleGhost(color)}),
        }
      : {
          ...(variant === 'outlined' && {
            backgroundColor: 'transparent',
            color: theme.palette.text.primary,
            border: `1px solid ${theme.palette.grey[500_32]}`,
          }),
          ...(variant === 'ghost' && {
            color: isLight
              ? theme.palette.text.secondary
              : theme.palette.common.white,
            backgroundColor: theme.palette.grey[500_16],
          }),
        }),
  }
})

// ----------------------------------------------------------------------

Label.propTypes = {
  children: PropTypes.node,
  startIcon: PropTypes.node,
  endIcon: PropTypes.node,
  color: PropTypes.oneOf([
    'default',
    'primary',
    'secondary',
    'info',
    'success',
    'warning',
    'error',
  ]),
  variant: PropTypes.oneOf(['filled', 'outlined', 'ghost']),
  sx: PropTypes.object,
}

export default function Label({
  children,
  color = 'default',
  variant = 'ghost',
  startIcon,
  endIcon,
  sx,
  title,
}) {
  const style = {
    width: 16,
    height: 16,
    '& svg, img': {width: 1, height: 1, objectFit: 'cover'},
  }

  return (
    <RootStyle
      ownerState={{color, variant}}
      sx={{
        ...(startIcon && {pl: 0.75}),
        ...(endIcon && {pr: 0.75}),
        ...sx,
      }}
    >
      {startIcon && <Box sx={{mr: 0.75, ...style}}>{startIcon}</Box>}

      {children}
      {title && <FormattedMessage id={title} />}
      {endIcon && <Box sx={{ml: 0.75, ...style}}>{endIcon}</Box>}
    </RootStyle>
  )
}
