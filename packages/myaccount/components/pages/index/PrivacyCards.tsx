import { css } from '@emotion/react'
import {
  Lock
} from '@mui/icons-material'
import {
  Box, Card,
  CardContent,
  Link as MuiLink, Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
// icon
import UserCheck from 'components/icons/UserCheck'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useAppSelector } from 'store/hooks'
import {IDENTITY, IDENTITY_TYPE, NDA} from 'components/pages/index/const'
import { nsIndex } from 'store/indexSlice'
import { useMemo } from 'react'
import { ns } from '../../../store/appSlice'

// Const
const nsTran = 'components@index'

// Interface
interface CardProps {
  data: {
    icon: JSX.Element;
    title: string;
    content: string;
    path: string;
    identity?: number;
  }
}



function PrivacyIcon({ isActive, privacyType }: { isActive: boolean, privacyType: 'identity' | 'NDA' }) {
  const theme = useTheme()
  const styleIcon = css`
    width: ${theme.spacing(6)};
    height: ${theme.spacing(6)};
    fill: ${isActive ? theme.palette.primary.main : theme.palette.divider};`

  if (privacyType === IDENTITY) {
    return <UserCheck css={styleIcon} />
  }
  return <Lock css={styleIcon} />
}

function PrivacyCardItem({ data }: CardProps) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { icon, title, content, path, identity } = data
  const isRedTextIdentity = identity === IDENTITY_TYPE.reUpload || identity === IDENTITY_TYPE.denied
  return (
    <Card css={css`
      height: 100%;
      border: 1px solid ${theme.palette.divider};
      background: ${theme.palette.grey[50]};
      box-shadow: none;
      &:hover {
        box-shadow: ${theme.shadows[1]}
      }
    `}>
      <CardContent css={css`
        display: flex;
        flex-direction: column;
        padding: ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(2)};
        height: 100%;
        &:last-child {padding-bottom: ${theme.spacing(3)};}
      `}>
        <Stack
          direction={{ xs: 'column', sm: 'row', md: 'row' }}
          spacing={{ xs: theme.spacing(2), sm: theme.spacing(5) }}
          alignItems="center"
          mb={theme.spacing(3)}
        >
          {icon}
          <Typography
            variant="body1"
            fontWeight="bold"
            css={css` ${isRedTextIdentity && `color: ${theme.palette.error.main};`}`}
          >
            {t(title)}
          </Typography>
        </Stack>
        <Typography css={css` flex-grow: 1;`} variant="subtitle2">{t(content)}</Typography>
        <Box css={css`
          display: flex;
          justify-content: flex-end;
        `}>
          <Link href={path} passHref>
            <MuiLink variant="subtitle2" css={css`
              color: ${theme.palette.primary.main};
              font-weight: bold;
            `}>
              {t('8')}
            </MuiLink>
          </Link>
        </Box>
      </CardContent>
    </Card>
  )
}

function PrivacyCardsContainer() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const isNda = useAppSelector(state => state[nsIndex].data?.isNda)
  const identity = useAppSelector(state => state[nsIndex].data?.identity)
  const isSkjDeveloper = useAppSelector(state => state[ns].auth?.isSkjDeveloper)
  const identityCardData = useMemo(() => {
    if(!isSkjDeveloper) return []
    return [
      {
        icon: <PrivacyIcon isActive={identity === 1} privacyType={IDENTITY} />,
        title: IDENTITY + identity,
        content: '6',
        path: '/member#identification',
        identity: identity || 0,
      }
    ]
  }, [identity, isSkjDeveloper])
  const privacyCardList = useMemo(() =>
    [
      ...identityCardData,
      {
        icon: <PrivacyIcon isActive={isNda} privacyType={NDA} />,
        title: isNda ? '26' : '5',
        content: '7',
        path: '/member#nda',
      },
    ]
  , [identityCardData, isNda])


  return (
    <Box css={css`
      margin-top: ${theme.spacing(4)};
      @media (min-width: ${theme.breakpoints.values.md}px) {
        margin-top: 40px;
      }
    `} >
      <Typography variant="h6" mb={theme.spacing(3)} fontWeight="bold">{t('3')}</Typography>
      <Stack
        direction="row"
        spacing={{ xs: theme.spacing(3), sm: theme.spacing(3), md: theme.spacing(4) }}
      >
        {privacyCardList.map((item, idx) =>
          <Box key={idx} css={css` flex: 0 1 ${!isSkjDeveloper ? 100 : 50}%;`}>
            <PrivacyCardItem data={item} />
          </Box>
        )}
      </Stack>
    </Box>
  )
}

export default PrivacyCardsContainer
