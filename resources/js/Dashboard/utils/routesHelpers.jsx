import {useParams} from 'react-router-dom'
import {defaultLang} from '../constants'

export const getRouteWithLang = (path = '') => {
  const prams = useParams()
  const lang = prams?.lang ?? defaultLang

  return `/${lang}` + path
}
