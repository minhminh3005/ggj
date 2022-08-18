import watchPresentIllustration from 'components/pages/mypage/transaction/Images/watchPresentIllustration.png'
import {memo} from 'react'
import Image from 'next/image'
import {css} from '@emotion/react'
import {Box, Stack, Typography} from '@mui/material'
import {nsTransaction} from './const'
import {useTranslation} from 'next-i18next'

export const EmptyLeftMenu = memo(function EmptyLeftMenu() {
  const {t} = useTranslation(nsTransaction)
  return (
    <Box px={3} py={4}>
      <Box css={css`
        max-width: 200px;
        max-height: 200px;
        margin: auto;
      `}>
        <Image
          layout="responsive"
          priority={true}
          src={watchPresentIllustration}
          alt="Empty Left Menu Image"
        />
      </Box>
      <Stack alignItems="center">
        <Typography
          mt={3}
          mb={4}
          textAlign="center"
          variant="subtitle1"
        >
          {t('55')}
        </Typography>

        {/*<Link href="#">*/}
        {/*  <GgjContainButton>スキルを出品する</GgjContainButton>*/}
        {/*</Link>*/}
      </Stack>
    </Box>
  )
})
