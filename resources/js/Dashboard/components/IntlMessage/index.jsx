import React, {Fragment} from 'react'
import {useIntl} from 'react-intl'

export const IntlMessage = ({descriptor, values}) => {
  const intl = useIntl()
  return <Fragment>{intl.formatMessage(descriptor, values)}</Fragment>
}
