import {css} from '@emotion/react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import PaymentsIcon from '@mui/icons-material/Payments'
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong'
import {Avatar, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {GgjContainButton} from 'components/commons/GgjButton/GgjContainButton'
import Link from 'next/link'
import {useTranslation} from 'next-i18next'
import {dateFormatSlash, formatDate} from 'common/date'
import {formatNumber} from 'common/number'
import {MARGIN_RIGHT_ICON} from 'components/commons/GgjButton'
import {IPaidOption, SKILL_SALES_STATUS, TransactionType, nsTransaction, IListOption} from './const'
import {ns, SkillInfo} from '../../../../store/transactionSlice'
import {useAppSelector} from '../../../../store/hooks'
import {Title} from './Title'
import TaskAltIcon from '@mui/icons-material/TaskAlt'

const NickName = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const id = useAppSelector((state) => state[ns]?.CHATINFO_info.skillInfo.saleId)
  return <Typography
    css={css`
      font-size: 14px;
      @media (min-width: ${theme.breakpoints.values.lg}px) {
        font-size: 8px;
      }
    `}
    variant="overline"
  >
    {t('39')}{id}
  </Typography>
}

const SkillTitle = () => {
  const theme = useTheme()
  const skillTitle = useAppSelector((state) => state[ns]?.DETAIL_skillTitle)
  return <Typography
    css={css`
      font-weight: bold;
      color: ${theme.palette.jade.dark};
      word-break: break-word;
    `}
    variant="subtitle1"
  >
    {skillTitle}
  </Typography>

}

const PaidOptions = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const paidOptions = useAppSelector((state) => state[ns]?.DETAIL_paidOptions) as IPaidOption
  if(!paidOptions) return null

  return (
    <div css={css`
      margin-top: ${theme.spacing(3)};
      padding-top: ${theme.spacing(3)};
      border-top: 1px solid ${theme.palette.smoke.light};
    `}>
      <Typography
        css={css`
          margin-bottom: 12px;
        `}
        variant="subtitle1"
      >
        {t('90')}
      </Typography>
      <Stack spacing={2}>
        {paidOptions.options.map((option: IListOption) =>
          <Stack direction='row' key={option.id} css={css`flex-wrap: wrap`}>
            <TaskAltIcon color='primary'/>
            <Typography className={'ggj-wt'}
              css={css`
                color: ${theme.palette.jade.light};
                margin: 2px 0 0 10px;
                flex: 1;
              `}
              variant="body2"
            >
              {option.title}
            </Typography>
            <Typography css={css`
              flex: 0 0 100%;
              text-align: right;
            `}>
              {t('price', {price: formatNumber(option.price)})}
            </Typography>
          </Stack>
        )}
      </Stack>
      <Stack direction="row" css={css`
          margin-top: ${theme.spacing(2)};
          padding-top: ${theme.spacing(3)};
          border-top: 1px solid ${theme.palette.smoke.light};
          justify-content: space-between;
        `}>
        <Typography>
          {t('91')}
        </Typography>
        <Typography>
          {t('price', {price: formatNumber(paidOptions.total)})}
        </Typography>
      </Stack>
    </div>
  )
}

const UserInfo = () => {
  const {t} = useTranslation(nsTransaction)
  const theme = useTheme()
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus)
  const nickName = useAppSelector(state => state[ns][mode == TransactionType.Buyer? 'DETAIL_sellerNickName' : 'DETAIL_buyerNickName'])
  const title = mode == TransactionType.Buyer? t('30')
    : (salesStatus == SKILL_SALES_STATUS.SELLER_CANCEL || salesStatus == SKILL_SALES_STATUS.BUYER_CANCEL)? t('42') : t('35')
  const userId = useAppSelector(state => state[ns]?.CHATINFO_info[mode == TransactionType.Buyer? 'sellerId' : 'buyerId'])
  return <div
    css={css`
      display: flex;
      align-items: center;
      margin-top: ${theme.spacing(3)};
    `}
  >
    <Avatar
      sx={{width: 40, height: 40, marginRight: theme.spacing(3)}}
      alt=""
      src={`/img/v3/skijan/users/avatar/${userId}?noDefaultImg=0`}
    />

    <div>
      <Typography variant="caption">
        {title}
      </Typography>
      <Link href={`/users/${userId}`} passHref>
        <Typography
          css={css`
        color: ${theme.palette.primary.main};
        word-break: break-word;
        font-weight: 600;
        text-decoration: underline;
        cursor: pointer;
        display: block;
      `}
          component="a"
          variant="subtitle1"
        >
          {nickName}
        </Typography>
      </Link>
    </div>
  </div>
}

const ButtonReceipt = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const chatId = useAppSelector((state) => state[ns]?.CHATINFO_info.id)
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus)

  if (mode == TransactionType.Seller ||
    !salesStatus ||
    salesStatus == SKILL_SALES_STATUS.SELLER_CANCEL ||
    salesStatus == SKILL_SALES_STATUS.BUYER_CANCEL
  ) return null

  const isAble = Boolean(salesStatus == SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS)

  return <div css={css`
      margin-top: ${theme.spacing(3)};
      padding-top: ${theme.spacing(3)};
      border-top: 1px solid ${theme.palette.smoke.light};
    `}
  >
    <Link href={`/api/skijan/v1/mypage/transaction/${chatId}/download`} passHref={isAble}>
      <a css={css`
        text-decoration: none;
        cursor: ${isAble? 'pointer' : 'unset'};
      `} target="_blank">
        <GgjContainButton
          disabled={!isAble}
          css={css`width: 100%;`}>
          <ReceiptLongIcon css={css`margin-right: ${MARGIN_RIGHT_ICON};`}/>
          {t('18')}
        </GgjContainButton>
      </a>
    </Link>
  </div>
}

export const ProductInfoBox = () => {
  const {t} = useTranslation(nsTransaction)
  const theme = useTheme()
  const chatInfo = useAppSelector((state) => state[ns]?.CHATINFO_info)
  const skillInfo: SkillInfo = chatInfo?.skillInfo
  const data = {
    transactionThumbnail: skillInfo?.imageUrl,
    skillId: skillInfo?.skillId || -1,
    price: skillInfo?.price || 0,
    time: skillInfo?.developerTimeLimit || 0,
  }
  return (
    <div>
      <div css={css`margin-bottom: ${theme.spacing(3)}`}><Title >取引サービス</Title></div>
      <div
        css={css`
          border: 1px solid ${theme.palette.smoke.light};
          padding: ${theme.spacing(4)};
          border-radius: 10px;
          background-color: ${theme.palette.canvas.light};
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: 288px;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            border-bottom: 1px solid ${theme.palette.smoke.light};
            padding-bottom: ${theme.spacing(3)};
          `}
        >
          <Avatar
            sx={{
              width: 96,
              height: 96,
              marginRight: theme.spacing(3),
              borderRadius: '10px',
            }}
            src={data?.transactionThumbnail}
            variant="rounded"
          />

          <div
            css={css`
              flex: 1;
            `}
          >
            <NickName/>
            <SkillTitle/>

            <Link href={`/skill/${data?.skillId}`} passHref>
              <Typography
                css={css`
                  color: ${theme.palette.primary.main};
                  text-align: right;
                  font-weight: 600;
                  cursor: pointer;
                  display: block;
                `}
                variant="subtitle2"
                component={'a'}
              >
                {t('41')}
              </Typography>
            </Link>
          </div>
        </div>

        <UserInfo/>

        <div
          css={css`
            display: flex;
            align-items: center;
            margin-top: ${theme.spacing(3)};
          `}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            css={css`
              background-color: #496cdc29;
              height: 40px;
              width: 40px;
              border-radius: 50%;
              margin-right: ${theme.spacing(3)};
              color: ${theme.palette.primary.main};
            `}
          >
            <PaymentsIcon/>
          </Stack>

          <div>
            <Typography variant="caption">{t('72')}</Typography>

            <Typography
              css={css`
                text-align: right;
                font-weight: 600;
              `}
              variant="subtitle1"
            >
              {t('price', {price: formatNumber(data?.price)})}
            </Typography>
          </div>
        </div>

        <div
          css={css`
            display: flex;
            align-items: center;
            margin-top: ${theme.spacing(3)};
          `}
        >
          <Stack
            direction={'row'}
            alignItems={'center'}
            justifyContent={'center'}
            css={css`
              background-color: #496cdc29;
              height: 40px;
              width: 40px;
              border-radius: 50%;
              margin-right: ${theme.spacing(3)};
              color: ${theme.palette.primary.main};
            `}
          >
            <AccessTimeIcon/>
          </Stack>

          <div>
            <Typography
              css={css`
                color: ${theme.palette.jade.dark};
              `}
              variant="caption"
            >
              {t('40')}
            </Typography>

            <Typography
              css={css`
                color: ${theme.palette.jade.light};
                text-align: right;
                font-weight: 600;
              `}
              variant="subtitle1"
            >
              {formatDate(data.time, dateFormatSlash)}
            </Typography>
          </div>
        </div>

        <PaidOptions/>

        <ButtonReceipt/>
      </div>
    </div>

  )
}
