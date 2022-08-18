import React, {ReactNode, useCallback, useEffect, useMemo} from 'react'
import {Stack, Switch, Typography} from '@mui/material'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {toastHandler} from 'contexts/ToastContext'
import { ggjDebounce } from 'common/utils'
// import {ggjServerSideTranslations} from 'common/i18nUtils'
import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined'
import {useTheme} from '@mui/material/styles'
// import {NextRequest} from 'next/server'
import {MypageDetailLayout/*, nsTranMypageDetailLayout*/} from 'components/layouts'
import {/*getAllEmail, */settingNotify} from 'store/mypage/email/emailSlice'
// import {AppError} from 'app.d'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import { useRouter } from 'next/router'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'

const nsTran = 'mypage@email'

interface TypeComponentProps {
  title: string
}

interface ItemComponentProps {
  text: string
  defaultChecked: boolean
  categoryId: number
  settingType: string
}
interface EmailAPIProps<T> {
  mailCategoryId: T
  isDelivery: T
}
interface NoticeAPIProps<T> {
  noticeCategoryId: T
  isDelivery: T
}
interface DataAPIProps {
  email: EmailAPIProps<number>[]
  notice: NoticeAPIProps<number>[]
  error?: string
}
enum SettingType {
  EMAIL = 'email',
  NOTICE = 'notice',
}
enum CommonConstants {
  TRANSACTION = 0,
  NEWS = 1,
  REVIEW = 2,
}
const TypeComponent: React.FC<TypeComponentProps> = ({ title }) => {
  return (
    <Typography
      variant="subtitle1"
      css={css`
        max-width: 328px;
        width: 100%;
        margin-bottom: 26.84px;`}>
      {title}
    </Typography>
  )
}
const HeaderTitle = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  return (
    <Stack
      css={css`
        width: 100%;
        height: 48px;
        position: relative;
      `}
      justifyContent="center"
      alignItems="center"
      direction="row">
      <NotificationsActiveOutlinedIcon
        css={css`
          color: ${theme.typography.subtitle1.color};
          width: 24px;
          height: 24px;`}/>
      <Typography
        variant="h6"
        css={css`margin-left: 6.03px;`}>
        {t('2')}
      </Typography>
    </Stack>
  )
}

const ItemComponent = ({children}: { children: ReactNode }) => {
  const theme = useTheme()
  return (
    <Stack
      css={css`
        max-width: 340px;
        width: 100%;
        margin-left: 16px;
        margin-bottom: 12px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-left: 28px;
        }
      `}
      direction="row"
      alignItems="center"
      justifyContent="space-between">{children}</Stack>
  )
}
const MenuComponent: React.FC<ItemComponentProps> = (props) => {
  const { text, defaultChecked,categoryId,settingType} = props
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const handleOnChangeSwtich = useCallback(ggjDebounce(async (checked: boolean) => {
    try {
      const {error} = await settingNotify({isDelivery: checked, categoryId: categoryId, settingType: settingType})
      if (error) {
        toastHandler({message: t('15'), type: 'error'})
        return
      }
    } catch (e) {
      toastHandler({type: 'error'})
    }
  }, 500), [])
  return (
    categoryId === CommonConstants.NEWS ? (
      <ItemComponent>
        <Typography variant="subtitle2">{t('4')}</Typography>
        <Typography
          css={css`
          color: #496cdc;
          margin-right: 0.65rem;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {

        }`} variant="subtitle2">
          {t('5')}
        </Typography>
      </ItemComponent>) : (
      <ItemComponent>
        <Typography variant="subtitle2">{text}</Typography>
        <Switch
          onChange={(e) => handleOnChangeSwtich(e.target.checked)}
          defaultChecked={defaultChecked}
        />
      </ItemComponent>)
  )
}
const ListEmailComponent = ({children}: {children: ReactNode}) => {
  return (
    <Stack
      css={css`
      margin-top: 59px;
      width: 100%;
      height: 100%;
      max-height: 166px;`}
      direction="column"
      alignItems="center"
      justifyContent="flex-start">
      {children}
    </Stack>
  )
}
const Email = ({data}: {data: DataAPIProps}) => {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const router = useRouter()
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('11'),
    description: t('13'),
    keywords: t('12'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: <HeaderTitle/>,
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/mypage')
    })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <section
        css={css`
          width: 100%;
          max-width: 1080px;
          margin: 0 auto 50px auto;`}>
        <Stack
          css={css`
            margin: 0 auto;
            width: 100%;
            max-width: ${theme.breakpoints.values.lg}px;`}
          justifyContent="center"
          alignItems="center"
          direction="column">
          <Stack
            css={css`
              width: 100%;
              height: 48px;
              position: relative;
              display: none;
              background-color: ${theme.palette.canvas.light};
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                display: flex;
              }
            `}
            justifyContent="center"
            alignItems="center"
            direction="row">
            <NotificationsActiveOutlinedIcon
              css={css`
                color: ${theme.typography.subtitle1.color};
                width: 24px;
                height: 24px;`}/>
            <Typography
              variant="h6"
              css={css`margin-left: 6.03px;`}>
              {t('2')}
            </Typography>
          </Stack>
          <ListEmailComponent>
            {data?.notice?.length > 0 && <TypeComponent title={t('3')}/>}
            {
              data?.notice?.length > 0 && data.notice.map((valuesNotice, index) => {
                return (
                  <MenuComponent
                    key={index}
                    categoryId={valuesNotice?.noticeCategoryId || -1}
                    text={valuesNotice?.noticeCategoryId === CommonConstants.REVIEW ? t('6') : t('7')}
                    defaultChecked={valuesNotice?.isDelivery === CommonConstants.TRANSACTION ? false : true}
                    settingType={SettingType.NOTICE}
                  />
                )
              })
            }
          </ListEmailComponent>
          <ListEmailComponent>
            {data?.email?.length > 0 && <TypeComponent title={t('8')} />}
            {
              data?.email?.length > 0 && data?.email.map((valuesEmail, index) => {
                return (
                  <MenuComponent
                    key={index}
                    categoryId={valuesEmail?.mailCategoryId || -1}
                    text={valuesEmail?.mailCategoryId === CommonConstants.REVIEW ? t('6') : t('7')}
                    defaultChecked={valuesEmail?.isDelivery === CommonConstants.TRANSACTION ? false : true}
                    settingType={SettingType.EMAIL}
                  />
                )
              })
            }
          </ListEmailComponent>
        </Stack>
      </section>
    </>
  )
}
export async function getServerSideProps(/*{ req }: { req: NextRequest }*/) {
  return { // disable for first release
    notFound: true,
  }
  // const data = await getAllEmail(req)
  // if (!data || data?.error === AppError.ECB404) {
  //   return {
  //     notFound: true,
  //   }
  // }
  // return {
  //   props: {
  //     data: data.data,
  //     ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranMypageDetailLayout),
  //   },
  // }
}
export default Email
Email.Layout = MypageDetailLayout
