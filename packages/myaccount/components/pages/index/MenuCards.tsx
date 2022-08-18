import { css } from '@emotion/react'
import {
  AccountBalanceOutlined, ChevronRight, MailOutline, Password, PendingOutlined,
  PersonOutlined
} from '@mui/icons-material'
import {
  Box, Card,
  CardContent, Divider, Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import { useAppSelector } from 'store/hooks'
import { nsIndex } from 'store/indexSlice'
import { ns } from '../../../store/appSlice'

// Const
const nsTran = 'components@index'

// Interface
interface MenuItemProps {
  data: {
    icon: JSX.Element;
    title: string;
    path: string;
  };
  index?: number
}

function MenuItem({ data, index }: MenuItemProps) {
  const theme = useTheme()
  const {icon, path, title} = data
  return (
    <Link href={path} passHref>
      <Box component="a" css={css` text-decoration: none; color: ${theme.palette.text.primary};`}>
        {!!index && <Divider variant="middle" />}
        <Stack
          direction="row"
          p={theme.spacing(3)}
          css={css`
          cursor: pointer;
          justify-content: space-between;
          transition: 0.3s ease;
          &:hover {
            background: ${theme.palette.grey[100]};
            transform: scale(1.02, 1.04);
            box-shadow: ${theme.shadows[1]}
          }
          `}>
          <Stack direction="row" spacing={theme.spacing(3)}>
            {icon}
            <Typography variant="body1">{title}</Typography>
          </Stack>
          <ChevronRight />
        </Stack>
      </Box>
    </Link>

  )
}

function MenuCards({ list }: { list: MenuItemProps['data'][] }) {
  const theme = useTheme()
  return (
    <Card css={css`
      border: 1px solid ${theme.palette.divider};
      background: ${theme.palette.grey[50]};
      box-shadow: none;
      overflow: visible;
    `}>
      <CardContent css={css`
        padding: 0;
        &:last-child {padding-bottom: 0;}
      `}>
        {list.map((item, idx) => <MenuItem key={idx} index={idx} data={item}/>)}
      </CardContent>
    </Card>
  )
}

function MenuCardsBox() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const isAllowChangeMail = useAppSelector(state => state[nsIndex].data?.isAllowChangeMail)
  const isSkjDeveloper = useAppSelector(state => state[ns].auth?.isSkjDeveloper)

  let menuList = [
    { icon: <MailOutline />, path: '/email', title: t('10') },
    { icon: <Password />, path: '/password', title: t('11') },
    { icon: <PersonOutlined />, path: '/member', title: t('12') },
    { icon: <PendingOutlined />, path: '/others', title: t('13') },
  ]

  if(!isAllowChangeMail) {
    menuList = menuList.slice(1, 4)
  }

  return (
    <>
      <Box mt={theme.spacing(5)}>
        <Typography variant="h6" fontWeight="bold" mb={theme.spacing(3)} >{t('9')}</Typography>
        <MenuCards list={menuList} />
      </Box>
      {isSkjDeveloper &&
        <Box mt={theme.spacing(5)}>
          <Typography variant="h6" fontWeight="bold" mb={theme.spacing(3)} >{t('14')}</Typography>
          <MenuCards list={[{ icon: <AccountBalanceOutlined />, title: t('15'), path: '/bank' }]} />
        </Box>
      }
    </>
  )
}

export default MenuCardsBox
