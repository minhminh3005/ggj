import {Typography} from '@mui/material'
import {ReactNode,memo} from 'react'

export const Title = memo(function Title({children}: { children: ReactNode }) {
  return <Typography variant={'h6'} className={'ggj-wt '}>
    {
      children
    }
  </Typography>
})
