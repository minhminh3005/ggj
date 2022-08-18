import {css} from '@emotion/react'
import {Box, useTheme} from '@mui/material'
import {memo} from 'react'

export const HeaderChatPanelEmpty = memo(function HeaderChatPanelEmpty() {
  const theme = useTheme()
  return <Box css={css`
  width: 100%;
  height: 56px;
  background-color: ${theme.palette.common.white};
  border-bottom: 1px solid ${theme.palette.smoke.light};
`}/>
})
