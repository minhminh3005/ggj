
import { css } from '@emotion/react'
import {
  Box, Card,
  CardContent, Grid, Link as MuiLink, Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import GogojungleIcon from 'components/icons/GogojungleIcon'
import NaviIcon from 'components/icons/NaviIcon'
import RealtradeIcon from 'components/icons/RealtradeIcon'
import SkijanIcon from 'components/icons/SkijanIcon'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import getConfig from 'next/config'

// Const
const nsTran = 'components@index'
const { publicRuntimeConfig: { REALTRADE_HOST_URL, SKJ_HOST_URL, GOGO_URL} } = getConfig()

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


function ReferenceCardItem({ data }: CardProps) {
  const theme = useTheme()
  const {icon, title, content, path} = data
  return (
    <Link href={path} passHref>
      <MuiLink css={css` text-decoration: none;`}>
        <Card css={css`
          height: 100%;
          border: 1px solid ${theme.palette.divider};
          background: ${theme.palette.grey[50]};
          box-shadow: none;
          cursor: pointer;
          &:hover {
            background: ${theme.palette.grey[100]};
            box-shadow: ${theme.shadows[1]}
          }
        `}>
          <CardContent css={css`
          display: flex;
          flex-direction: column;
          padding: ${theme.spacing(3)} ${theme.spacing(3)} ${theme.spacing(2)};
          height: 100%;
          `}>
            <Stack
              direction="column"
              spacing={theme.spacing(2)}
              alignItems="center"
              mb={theme.spacing(3)}
            >
              {icon}
              <Typography variant="body1" fontWeight="bold">{title}</Typography>
            </Stack>
            <Typography css={css` flex-grow: 1;`} variant="body2">{content}</Typography>
          </CardContent>
        </Card>
      </MuiLink>
    </Link>
  )
}
function IconWrapper ({children} : {children: JSX.Element}) {
  const theme = useTheme()
  return (
    <Box css={css`
      width: 48px;
      height: 48px;
      border: 1px solid ${theme.palette.divider};
      border-radius: 50%;
      overflow: hidden;
      transition: box-shadow ${theme.transitions.duration.standard};
      box-shadow: ${theme.shadows[0]};
      svg {
        height: 100%;
        width: 100%;
      }
      &:hover {
        box-shadow: ${theme.shadows[1]};
      }
      &:active {
        box-shadow: ${theme.shadows[0]};
      }
    `}>
      {children}
    </Box>
  )
}

function ReferenceCardsBox() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const referenceCardList = [
    {
      icon: <IconWrapper><GogojungleIcon /></IconWrapper>,
      title: 'GogoJungle',
      content: t('gogo-cap'),
      path: GOGO_URL,
    },
    {
      icon: <IconWrapper><SkijanIcon/></IconWrapper>,
      title: t('18'),
      content: t('skijan-cap'),
      path: SKJ_HOST_URL,
    },
    {
      icon: <IconWrapper><NaviIcon/></IconWrapper>,
      title: t('19'),
      content: t('navi-cap'),
      path: `${GOGO_URL}/finance/navi`,
    },
    {
      icon: <IconWrapper><RealtradeIcon/></IconWrapper>,
      title: t('20'),
      content: t('realtrade-cap'),
      path: REALTRADE_HOST_URL,
    },
  ]
  return (
    <Box mt={theme.spacing(5)} mb={theme.spacing(6)}>
      <Typography variant="h6" fontWeight="bold" mb={theme.spacing(3)} >{t('16')}</Typography>
      <Grid container spacing={theme.spacing(3)}>
        {referenceCardList.map((item, idx) =>
          <Grid key={idx} item md={3} xs={6}>
            <ReferenceCardItem data={item} />
          </Grid>
        )}
      </Grid>
    </Box>
  )
}

export default ReferenceCardsBox
