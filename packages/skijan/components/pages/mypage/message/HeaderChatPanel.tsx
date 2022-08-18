import {css} from '@emotion/react'
import {Box, IconButton, Stack, Typography, useMediaQuery, useTheme} from '@mui/material'
import {useRouter} from 'next/router'
import {memo, useMemo} from 'react'

import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'

export const HeaderChatPanel = memo(function HeaderChatPanel() {
  const theme = useTheme()
  const router = useRouter()

  const onBack = () => {
    router.push('/mypage/message')
  }
  const breakPoint = useMediaQuery(`(max-width:${theme.breakpoints.values.lg - 1}px)`)
  const isMobileOrTablet = useMemo(() => breakPoint, [breakPoint])
  if (isMobileOrTablet) return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'flex-start'}
      css={css`
        width: 100%;
        min-height: 48px;
        background: #FFFFFF 0% 0% no-repeat padding-box;
        box-shadow: 0px 1px 12px #00000014;
        padding: 0 ${theme.spacing(2)};
        text-align: center;
      `}>
      <IconButton onClick={onBack} css={css`{
        color: ${theme.palette.primary.main}
      }`}>
        <ArrowBackIosNewIcon/>
      </IconButton>
      <Stack css={css`
        margin: 0 ${theme.spacing(2)};
        text-align: center;
        flex:1;
      `}>
        <Typography variant={'h6'} className={'ggj-wt '}>
          商品タイトル
        </Typography>
      </Stack>
    </Stack>
  )

  return <Box css={css`
    width: 100%;
    height: 56px;
    background-color: #FFFFFF;
    border-bottom: 1px solid ${theme.palette.smoke.light};
  `}/>
})
