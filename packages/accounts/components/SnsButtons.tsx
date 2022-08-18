// import GoogleIcon from 'components/icons/GoogleIcon'
import YahooIcon from 'components/icons/YahooIcon'
import FacebookRoundedIcon from '@mui/icons-material/FacebookRounded'
import TwitterIcon from 'components/icons/TwitterIcon'

import { Stack } from '@mui/material'
import GgjIconButton from 'components/GgjIconButton'

import { useTranslation } from 'next-i18next'
import { css } from '@emotion/react'
import React from 'react'
import { useAppSelector } from '../store/hooks'
import { ns } from '../store/authSlice'
import { useRouter } from 'next/router'

function SnsButtons(props: {register?: boolean}) {
  const {t} = useTranslation('common@thirdparty')
  const {query: {u}} = useRouter()
  const clientId = useAppSelector(state => state[ns].clientId)
  const qp = clientId ? `?clientId=${clientId}${u ? `&u=${u}` : ''}` : ''

  const prefix = props.register ? 'register' : 'login'

  // TODO: Hieu Nguyen add redirect url u
  const socialMediaList = [
    // {icon: <GoogleIcon />, content: t(`${prefix}-google`), path: '/sns/google' + qp},
    {icon: <YahooIcon />, content: t(`${prefix}-yahoo`), path: '/sns/yahooJP' + qp},
    {
      icon: <FacebookRoundedIcon css={css`color: #4267B2;`} />,
      content: t(`${prefix}-facebook`),
      path: '/sns/facebook' + qp,
    },
    {icon: <TwitterIcon />, content: t(`${prefix}-twitter`), path: '/sns/twitter' + qp},
  ]

  return (
    <Stack spacing={3}>
      {socialMediaList.map((item, idx) => (
        <GgjIconButton item={item} key={`social-btn-${idx}`} />
      ))}
    </Stack>
  )
}

export default React.memo(SnsButtons)
