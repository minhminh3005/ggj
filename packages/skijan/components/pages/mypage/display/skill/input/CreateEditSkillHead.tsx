import Head from 'next/head'
import {Typography} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {nsTran} from 'components/pages/mypage/display/skill/input/const'
import {useAppSelector} from '../../../../../../store/hooks'
import {ns} from '../../../../../../store/mypage/display/skill/skillInputSlice'
import { css } from '@emotion/react'
import {useTheme} from '@mui/material/styles'

const CreateEditSkillHead = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const skillId = useAppSelector(state => state[ns].product.id)
  return (
    <>
      <Head>
        <title>{t('meta-title')}</title>
        <meta name="description" content={t('meta-description')}/>
        <meta name="keywords" content={t('meta-kw')}/>
        <meta property="og:title" content={t('meta-title')} key="title" />
      </Head>
      <Typography
        variant="h5"
        mb={5}
        ml={6}
        css={css`
          display: none;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            display: block;
          }
      `}>
        {t(`${skillId ? 'edit' : 'input'}-title-header`)}
      </Typography>
    </>
  )
}

export default CreateEditSkillHead
