import React, {memo, useContext} from 'react'
import {css} from '@emotion/react'
import {useTheme, Box, Typography} from '@mui/material'
import ListFiles from './ListFiles'
import {StateContext} from './ChatUploadContext'

const Wrapper = () => {
  const state = useContext(StateContext)
  return <>
    <Typography>{state.listFiles.length}個のファイルが選択</Typography>
    <ListFiles/>
  </>
}

const DisplayPanel = () => {
  const theme = useTheme()
  return (
    <Box css={css`
      margin-top:${theme.spacing(6)}
    `}>
      <Wrapper/>
    </Box>
  )
}
export default memo(DisplayPanel)
