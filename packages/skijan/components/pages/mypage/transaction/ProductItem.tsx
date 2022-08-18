import {css} from '@emotion/react'
import {rgba} from 'emotion-rgba'
import {useTheme} from '@mui/material/styles'
import {Avatar, Box, Stack, Typography} from '@mui/material'
import {memo, ReactNode, useMemo, MouseEvent} from 'react'
import Link, {LinkProps,} from 'next/link'
import {UrlObject} from 'url'
import {IChatroom, nsTransaction} from './const'
import {dateFormatSlash, formatDate} from '../../../../common/date'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {actions, ns} from '../../../../store/transactionSlice'
import {BeforeTrading} from 'components/pages/mypage/transaction/const'
import {useTranslation} from 'next-i18next'


interface NextLinkWrapperProps extends Omit<LinkProps, 'href'>{
  href?: UrlObject | string | null
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void
  children: ReactNode
}

export const ProductItem = memo(function ProductItem(props: IChatroom) {
  const theme = useTheme()
  const {
    transactionId,
    skillTitle,
    nickName,
    time,
    isNewMessage,
    imageUrl
  } = props
  const dispatch = useAppDispatch()
  const currentSalesStatus = useAppSelector(state => state[ns].MENU_currentTab)
  const chatId = useAppSelector(state => state[ns].CHATINFO_info?.id)
  const isOpenPopupLeftMenu = useAppSelector(state => state[ns].isOpenPopupLeftMenu)
  const isActive = useMemo(() => chatId === transactionId, [chatId, transactionId])
  const isBeforeTradingTab = useMemo(() => currentSalesStatus === BeforeTrading, [currentSalesStatus])
  const LinkStyle = useMemo(() => css`
    cursor: pointer;
    &:hover {
      background: ${theme.palette.smoke.light};
    }
  `, [theme])
  const handleClickSkillItem = (e: MouseEvent<HTMLAnchorElement>) => {
    if(isActive) e.preventDefault()
    if(isOpenPopupLeftMenu && !isBeforeTradingTab) dispatch(actions.setIsOpenPopupLeftMenu(false))
  }

  return (
    <NextLinkWrapper
      href={isBeforeTradingTab ? null : `/mypage/transaction/${transactionId}`}
      onClick={handleClickSkillItem}
    >
      <Stack
        className="skill-item"
        px={3} py={2}
        direction="row"
        spacing={3}
        css={css`
          ${!isBeforeTradingTab && LinkStyle}
          background-color: ${isActive ? rgba(theme.palette.primary.light, 0.2) : 'unset'};
          position: relative;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            width: 100%;
          }
        `}
      >
        <Box position="relative">
          {!!isNewMessage && <RedNotificationDot/>}
          <Avatar
            variant="rounded"
            alt={skillTitle}
            src={imageUrl}
            css={css`
                width: 56px;
                height: 56px;
                border-radius: 10px;
              `}
          />
          {isBeforeTradingTab && <UnsettledBadge/>}
        </Box>
        <Stack
          justifyContent="center"
          flexGrow={1}
          gap={1}
        >
          <Stack direction="row" justifyContent="space-between">
            <Title01 variant="body1" className="ggj-wt">{skillTitle}</Title01>
            <Title01 variant="caption">{time ? formatDate(time, dateFormatSlash) : ''}</Title01>
          </Stack>
          <Title01 variant="caption" className="ggj-wt">{nickName}</Title01>
        </Stack>
      </Stack>
    </NextLinkWrapper>
  )
})


const RedNotificationDot = memo(function RedNotificationDot() {
  const theme = useTheme()
  return (
    <span css={css`
      position: absolute;
      display: block;
      left: -12px;
      top: 50%;
      transform: translateY(-50%);
      width: ${theme.spacing(2)};
      height: ${theme.spacing(2)};
      border-radius: ${theme.spacing(2)};
      background: ${theme.palette.ruby.main};
    `}/>
  )
})

const UnsettledBadge = memo(function UnsettledBadge() {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  return (
    <span
      css={css`
        font-size: 10px;
        color: ${theme.palette.common.white};
        position: absolute;
        height: 25px;
        width: 52px;
        text-align: center;
        line-height: 17px;
        bottom: -${theme.spacing(2)};
        right: -10px;
        padding: ${theme.spacing(1)} ${theme.spacing(2)};
        border-radius: 22px;
        background: ${theme.palette.secondary.main};
        opacity: 0.8;
      `}
    >
      {t('73')}
    </span>
  )
})

const Title01 = memo(function Title01(props: {
  children: ReactNode,
  variant: 'body1' | 'caption',
  className?: string
}) {
  const {children, variant, className} = props
  return (
    <Typography
      variant={variant || 'caption'}
      className={className}
    >{children}
    </Typography>
  )
})

const NextLinkWrapper = (props: NextLinkWrapperProps) => {
  const {href, children, onClick, ...rest} = props

  if(href) {
    return (
      <Link href={href} passHref {...rest}>
        <a onClick={onClick} css={css` text-decoration: none; color: unset;`}>
          {children}
        </a>
      </Link>
    )
  }
  return <>{children}</>
}
