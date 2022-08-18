import {css} from '@emotion/react'
import {Stack, Switch, Tooltip, Typography} from '@mui/material'
import {MypageDetailLayout, nsTranMypageDetailLayout} from 'components/layouts'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {useTheme} from '@mui/material/styles'
import {NextRequest} from 'next/server'
import {useTranslation} from 'next-i18next'
import {getAllMember, updateMember} from 'store/mypage/member/memberSlice'
import {differenceInCalendarYears, format, parse} from 'date-fns'
import getConfig from 'next/config'
import Link from 'next/link'
import {useCallback, useEffect, useMemo, useState} from 'react'
import {useLayoutContext} from '../../../contexts/LayoutContext'
import { useRouter } from 'next/router'
import { toastHandler } from 'contexts/ToastContext'
import { ggjDebounce } from 'common/utils'
import {dateFormatSlash, timeZone} from 'common/date'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'
import {getTimezoneOffset} from 'date-fns-tz'
import {useAppSelector} from '../../../store/hooks'
import {ns} from '../../../store/appSlice'
const { publicRuntimeConfig } = getConfig()
const {MYACCOUNT_HOST_URL} = publicRuntimeConfig
const nsTran = 'mypage@member'

interface ItemProps<T> {
  title: T
  content: any
  description?: any
  action?: T
  note?: {
    title: T
    status: boolean
  }
  isDev?: number
}
interface DataMemberInfoProps<T> {
  title: T
  action?: T
  list: ItemProps<T>[]
}
interface BankAccountsProps {
  accountHolder: string
  accountNumber: string
  accountType: number
  bankBranchName: string
  bankName: string
  bankType: number
  id: number
}
interface MemberInfoProps<T> {
  address1: T
  address2: T
  address3: T
  bankAccounts: BankAccountsProps[]
  birthday: T
  firstName: T
  firstNameKana: T
  id: number
  isCorporation: number
  isConclusion: number
  isDisplayAge: number
  isDisplayGender: number
  isDisplayResidential: number
  isTransaction: number
  lastName: T
  lastNameKana: T
  isDev: number
  mailAddress: T
  prefectureId: number
  prefectureName: T
  sexType: number
  state: T
  statusType: number
  zip: T
  error?: T
  tel: T
  nickName: T
  isUserRegisterBank: boolean
}
interface TypeProps<T> {
  age: T
  gender: T
  residential: T
}
const SwitchComponent = (props: {indexList: number, status: boolean}) => {
  const { t } = useTranslation(nsTran)
  const [statusTemp, setStatusTemp] = useState<boolean>(props.status)
  const typeCheck: TypeProps<number> = {
    age: 1,
    residential: 2,
    gender: 3,
  }
  const typeApi = {
    age: 'display-age',
    gender: 'display-gender',
    residential: 'display-residential'
  }
  const handleApiUpdateMember = async (status: boolean, type: string) => {
    try {
      const {error} = await updateMember(status, type)
      if (error) {
        toastHandler({message: t('35'), type: 'error'})
        return
      }
      setStatusTemp(!statusTemp)
    } catch (e) {
      toastHandler({type: 'error'})
    }
  }
  const handleOnchangeSwitch = useCallback(ggjDebounce(async(checked: boolean, indexList: number) => {
    switch(indexList) {
    case typeCheck.age: {
      handleApiUpdateMember(checked, typeApi.age)
      break
    }
    case typeCheck.residential: {
      handleApiUpdateMember(checked, typeApi.residential)
      break
    }
    default: {
      handleApiUpdateMember(checked, typeApi.gender)
    }
    }
  }, 500), [])
  return (
    <Switch onChange={(e) => handleOnchangeSwitch(e.target.checked, props.indexList)} defaultChecked={statusTemp} />
  )
}
const ItemComponent = ({valuesList, indexList}: {valuesList: ItemProps<string>, indexList: number}) => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const link = {
    email: t('20'),
    bank: t('23'),
    password: t('21'),
    tel: t('55'),
    nickName: t('56')
  }
  const cssCommon = useMemo(() => 'line-height:21px; width: 100%;', [])
  return (
    <Stack css={css`
    width:100%;
    border-bottom: 1px solid ${theme.palette.smoke.light};
    padding-bottom: ${valuesList?.note?.title ? '10px' : '17px'};
    margin-top: 16px`} justifyContent='flex-start' alignItems='center' direction='column'>
      <Stack css={css`width:100%;`} justifyContent='space-between' alignItems='center' direction='row'>
        <Typography variant='subtitle2' css={css`
        color:${theme.palette.jade.light};
        width:100%;
        margin-bottom:8px;`} >{valuesList?.title || '-'}</Typography>
        {valuesList?.action && <Link href={
          (() => {
            switch(valuesList.title) {
            case link.email:
              return `${MYACCOUNT_HOST_URL}/email`
            case link.bank:
              return `${MYACCOUNT_HOST_URL}/bank`
            case link.password:
              return `${MYACCOUNT_HOST_URL}/password`
            case link.tel:
            case link.nickName:
              return `${MYACCOUNT_HOST_URL}/member`
            default:
              return ''
            }
          })()
        } passHref >
          <a target='_self' css={css`text-decoration: none;`} rel="noreferrer" >
            <Typography css={css`
            color:${theme.palette.primary.main};
            cursor: pointer;
            width: 85px;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                width: 74px;
            }`} variant='subtitle1' >{valuesList?.action || '-'}</Typography>
          </a>
        </Link>}
      </Stack>
      <Typography css={css`
        color:${theme.palette.jade.dark};
        ${cssCommon}`} variant='subtitle1'>{valuesList?.content || '-'}</Typography>
      {valuesList?.description && <Typography css={css`
        ${cssCommon}
        color:${theme.palette.jade.dark};`} variant='subtitle1'>{valuesList.description}</Typography>}
      {valuesList?.note?.title && <Stack css={css`width:100%;`} justifyContent='space-between' alignItems='center' direction='row'>
        <Typography css={css`
        ${cssCommon}
        color:${theme.palette.jade.light};`} variant='subtitle2'>
          {valuesList.note.title}
        </Typography>
        <SwitchComponent status={valuesList?.note?.status || false} indexList={indexList} />
      </Stack>}
    </Stack>
  )
}
const ListComponent = (props: {data: MemberInfoProps<string>}) => {
  const router = useRouter()
  const {pathname} = router
  const {data} = props
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const isSkjDeveloper = useAppSelector(state => state[ns].auth?.isSkjDeveloper)
  const route = {
    memberInfo: '/mypage/member'
  }
  const display = {
    isDevShow: 1,
    ageOnProfile: {
      turnOn: true,
      turnOff: false,
    },
    prefecturesOnProfile: {
      turnOn: true,
      turnOff: false,
    },
    inProfile: {
      turnOn: true,
      turnOff: false,
    },
    username: {
      indivisual: t('47'),
      corporation: t('48')
    },
    gender: {
      notClear: t('44'),
      male: t('45'),
      female: t('46')
    },
    statusType: {
      hide: t('49'),
      display: t('50')
    },
    transactionAndConclusion: {
      none: t('51'),
      canBe: t('52')
    },
    bankAccount: {
      registered: t('57'),
      unregistered: t('42')
    },
  }
  if(!data) return null
  const calculateAgeByDecade = (dob: string): string => {
    const date = parse(dob, dateFormatSlash, new Date())
    const age = differenceInCalendarYears(new Date(), date)
    return age < 10 ? '0' : `${Math.floor(age / 10)}0`
  }
  const TypoCommon = (title: string | number, typeElement?: string | undefined) => {
    return <Tooltip placement="bottom-start" title={title}>
      {
        typeElement
          ? <span css={css`
            color:${theme.palette.jade.dark};
            cursor: pointer;
            margin-right: 0.5rem;
            width:100%;`}>{`${title}`}</span>
          :  <Typography className='ggj-wt' css={css`
            color:${theme.palette.jade.dark};
            cursor: pointer;
            width:100%;`} variant='subtitle1'>{title}</Typography>
      }
    </Tooltip>
  }
  const getFullYear = data?.birthday && format(new Date(data?.birthday + getTimezoneOffset(timeZone['ja'])), dateFormatSlash)
  const dataMemberInfo: DataMemberInfoProps<string>[] = [
    {
      title: t('1'),
      action: t('2'),
      list: [
        {
          title: t('3'),
          content: data?.lastName && data?.firstName ? `${data.lastName} ${data.firstName}` : '-',
          description: data?.lastNameKana && data?.firstNameKana && TypoCommon(`${data.lastNameKana} ${data.firstNameKana}`),
        },
        {
          title: t('28'),
          content: getFullYear ? `${getFullYear} ${calculateAgeByDecade(getFullYear)}${t('53')}` : '-',
          note: {
            title: t('54'),
            status: data?.isDisplayAge === 1 ? display.ageOnProfile.turnOn : display.ageOnProfile.turnOff
          },
        },
        {
          title: t('6'),
          content: data?.zip || '-',
          description: data?.prefectureName && data?.address1 && data?.address2 && <Stack justifyContent='flex-start' alignItems='center' direction='column' css={css`width:100%;line-height:21px; h6 {width:100%;}`}>
            <div css={css`width: 100%;`}>
              {TypoCommon(data.prefectureName, 'span')}
              {TypoCommon(data.address1, 'span')}
              {TypoCommon(data.address2, 'span')}
              {data?.address3 && TypoCommon(data.address3, 'span')}
              {data?.state ? TypoCommon(data.state, 'span') : '.'}
            </div>
          </Stack>,
          note: {
            title: t('30'),
            status: data?.isDisplayResidential === 1  ? display.prefecturesOnProfile.turnOn : display.prefecturesOnProfile.turnOff
          },
        },
        {
          title: t('8'),
          content: data?.sexType === 0 ? display.gender.notClear
            : data?.sexType === 1 ? display.gender.male
              : data?.sexType === 2 ? display.gender.female
                : '-',
          note: {
            title: t('31'),
            status: data?.isDisplayGender === 1  ? display.inProfile.turnOn : display.inProfile.turnOff
          },
        },
        {
          title: t('10'),
          content: data?.isCorporation === 0 ? display.username.indivisual
            : data?.isCorporation === 1 ? display.username.corporation
              : '-',
        },
        {
          title: t('12'),
          content: data?.statusType === 0 ? display.statusType.hide
            : data?.statusType === 1 ? display.statusType.display
              : '-',
        },
        {
          title: t('14'),
          content: data?.isConclusion === 0 ? display.transactionAndConclusion.none
            : data?.isConclusion === 1 ? display.transactionAndConclusion.canBe
              : '-',
          isDev: data?.isDev || 0
        },
        {
          title: t('16'),
          content: data?.isTransaction === 0 ? display.transactionAndConclusion.none
            : data?.isTransaction === 1 ? display.transactionAndConclusion.canBe
              : '-',
        },
      ]
    },
    {
      title: t('18'),
      list: [
        {
          title: t('19'),
          content: data?.id || 0,
        },
        {
          title: t('56'),
          content: data?.nickName || '-',
          action: t('2'),
        },
        {
          title: t('20'),
          content: data?.mailAddress || '-',
          action: t('2'),
        },
        {
          title: t('21'),
          content: Object.keys(data).length > 0 ? '**********' : '-',
          action: t('2'),
        },
        {
          title: t('55'),
          content: data?.tel ?? '-',
          action: t('2'),
        },
      ]
    }
  ]
  const dataMemberInfoArr: DataMemberInfoProps<string>[] =isSkjDeveloper ? dataMemberInfo.concat([{
    title: t('22'),
    list: [
      {
        title: t('23'),
        content: data?.isUserRegisterBank ? display.bankAccount.registered :display.bankAccount.unregistered,
        action: t('2'),
      },
      /* {
        title: t('25'),
        content: t('26'),
        action: t('2'),
      }, */
    ]
  }]) : dataMemberInfo
  return (
    <>
      {
        dataMemberInfoArr?.length > 0 && dataMemberInfoArr.map((valuesMemberInfo, indexMemberInfo) => {
          return (
            <Stack key={indexMemberInfo} justifyContent='flex-start' alignItems='center' direction='column' css={css`width:100%;`} >
              <Stack css={css`width:100%;margin: ${indexMemberInfo === 0
                ? pathname === route.memberInfo ? '26' : '52'
                : '48'}px 0 16px 0;`} justifyContent='space-between' alignItems='center' direction='row' >
                <Typography css={css`color:${theme.palette.jade.dark};`} variant='h6' >{valuesMemberInfo?.title || '-'}</Typography>
                {valuesMemberInfo?.action && <Link href={`${MYACCOUNT_HOST_URL}/member`} passHref >
                  <a target='_blank' rel="noreferrer" css={css`text-decoration: none;`}>
                    <Typography css={css`
                    color:${theme.palette.primary.main};
                    cursor: pointer;
                    width: 71px;`} variant='subtitle1'>{valuesMemberInfo?.action || '-'}</Typography>
                  </a>
                </Link>}
              </Stack>
              {
                valuesMemberInfo?.list?.length > 0 && valuesMemberInfo.list.map((valuesList, indexList) => {
                  switch(valuesList?.isDev) {
                  case display.isDevShow:
                  case undefined:
                    return <ItemComponent key={indexList} valuesList={valuesList} indexList={indexList} />
                  default:
                    return ''
                  }
                })
              }
            </Stack>
          )
        })
      }
    </>
  )
}
const MemberInfo = (props: {data: MemberInfoProps<string>}) => {
  const theme = useTheme()
  const {data} = props
  const { t } = useTranslation(nsTran)
  const {updateLayoutSetting} = useLayoutContext()
  const headData = useMemo(() => ({
    title: t('32'),
    description: t('34'),
    keywords: t('33'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: t('27'),
      isShowTitleOnHeaderMobile: true,
    })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData}/>
      <section css={css`width: 100%;`} >
        <Stack justifyContent="flex-start" alignItems="center" direction="column" css={css`
          width: 100%;
          margin: 0 auto;
          max-width: 328px;
          padding: 0 16px 52px 16px;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            padding-bottom: 52px;
            max-width: 668px;
          }
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: 680px;
          }`}
        >
          <ListComponent data={data}/>
        </Stack>
      </section>
    </>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data = await getAllMember(req)
  return {
    props: {
      data: data.data,
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran], nsTranMypageDetailLayout),
    },
  }
}
export default MemberInfo
MemberInfo.Layout = MypageDetailLayout
