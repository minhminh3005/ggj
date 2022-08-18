import { useTheme } from '@mui/material/styles'
import {GgjMobileHeader} from '../../../commons/GgjHeader'
import {useMemo} from 'react'
import {Header} from './Header'
import {useMediaQuery} from '@mui/material'

export function HeaderDetail() {
  const theme = useTheme()
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  return <>
    {isDesktop? <Header/> : <GgjMobileHeader/>}
  </>
}
