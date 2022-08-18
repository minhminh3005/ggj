import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'next-i18next'
import {css} from '@emotion/react'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import {dateFormat, dateFormatSlash, formatDate} from 'common/date'
import Button from '@mui/material/Button'
import DealChat from 'components/icons/DealChat'
import IconButton from '@mui/material/IconButton'
import {formatNumber} from 'common/number'
import {WithConditionalCSSProp} from '@emotion/react/types/jsx-namespace'
import TreasureHuntIllustration from 'components/pages/skill/treasure_hunt.png'
import Image from 'next/image'
import CircularProgress from '@mui/material/CircularProgress'
import {useCallback, useEffect, useMemo, useState, memo} from 'react'
import {useRouter} from 'next/router'
import Link from 'next/link'
import InfiniteScrollCommon from 'components/commons/GgjInfinite'
import {LIMIT} from 'store/mypage/display/skill/skillDetailSlice'
import {toastHandler} from 'contexts/ToastContext'
import LazyRenderComp from 'components/commons/GgjLazyRenderComp'
import useMediaQuery from '@mui/material/useMediaQuery'

const ns = 'mypage@skill-detail'
function getCurrentTabIndex(): number {
  return Array.from(document.getElementsByClassName('MuiButtonBase-root MuiTab-root'))
    .findIndex(el => (el.className.includes('Mui-selected')))
}
type TabPanelSkillServiceProps = {
  loadDataFn: (page: number) => Promise<TRowData[]>
  initData?: TRowData[]
  page: number
  emptyDescriptionText: string
  tabIdx: number
}
export function TabPanelSkillService(props: TabPanelSkillServiceProps) {
  const theme = useTheme()
  const { loadDataFn, initData, tabIdx } = props
  const [page, setPage] = useState(props.page || 0)
  const [list, setList] = useState(props.initData ?? [])
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const scrollableTarget = useMemo(() => isDesktop ? 'BodyWrapper' : '', [isDesktop])

  const next = () => {
    // validate is current tab
    if(getCurrentTabIndex() !== (tabIdx - 1)) return

    // is load from init data
    if(page === 0 && initData?.length) {
      setList(initData)
      setPage(page + 1)
      return
    }

    // start get data process
    setIsLoading(true)
    setPage(page + 1)
    loadDataFn(page + 1).then(data => {
      data && data.length && setList(prevList => (prevList || []).concat(data))
      data && data.length < LIMIT && setHasMore(false)
    }).catch(e => {
      console.error(e)
      toastHandler({ message:'Load data failed!', type: 'error' })
    }).finally(() => {
      setIsLoading(false)
    })
  }

  // init data in first time
  useEffect(next, [])

  return <InfiniteScrollCommon
    hasMore={hasMore}
    next={next}
    css={css`overflow: hidden!important;`}
    scrollableTarget={scrollableTarget}
    loader={<LoadingRow/>}
    dataLength={list.length}>
    <ItemsMemo list={list} tabIdx={tabIdx} emptyDescriptionText={props.emptyDescriptionText} isLoading={isLoading}/>
  </InfiniteScrollCommon>
}

const ItemsMemo = memo(function Items({
  list,
  tabIdx,
  emptyDescriptionText,
  isLoading
}: { list: TRowData[] | undefined, tabIdx: number, emptyDescriptionText: string, isLoading: boolean }) {
  return <>
    {
      list?.length
        ? (<>{list.map((sk) => (
          <LazyRenderComp
            minHeight={74}
            key={`LazyRenderComp-${sk.saleStatusId}-${sk.id}`}
            component={TabPanelRow}
            componentProps={{
              key: sk.saleStatusId,
              data: sk,
              tabIdx,
            }}
          />
        ))}</>)
        : <>{!isLoading && <EmptyTabContent descriptionText={emptyDescriptionText} key={'EmptyTabContent'}/>}</>
    }
  </>
})

export type TRowData = {
  nickName: string
  startTime: number
  price: number
  finishTime: number
  isUnread?: boolean
  chatRoomId: number
  buyerId: number
  id: string
  saleStatusId: number
  imageUrl: string
}
function LoadingRow() {
  return <div css={css`height: 75px;display: flex; align-items: center;justify-content: center`}>
    <Typography><CircularProgress color="inherit" size={18}/></Typography>
  </div>
}
export function TabPanelRow(props: { data: TRowData, tabIdx: number }) {
  const theme = useTheme()
  const router = useRouter()
  const { t } = useTranslation(ns)
  const { data } = props

  const navigateToChat = useCallback(() => {
    router.push('/mypage/transaction/' + data.chatRoomId).then()
  }, [data.chatRoomId, router])

  const dateInfo = useMemo(() => {
    return props.tabIdx === 1 ? data.startTime : data.finishTime
  }, [props.tabIdx, data.startTime, data.finishTime])

  return (
    <div
      css={css`
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 72px;
        padding-left: ${theme.spacing(3)};
      `}>
      <Link href={`/users/${data.buyerId}`}>
        <a css={css`color: inherit;cursor: pointer;&:hover{opacity: .8;}`}>
          <Avatar  alt="user avatar" src={data.imageUrl}/>
        </a>
      </Link>
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          flex-grow: 1;
          align-items: center;
          margin-left: 16px;
          border-bottom: 1px solid #E1E1E1;
          padding-right: ${theme.spacing(3)};
          padding-top: 16px;
          padding-bottom: 16px;
        `}
      >
        <Stack>
          <Link href={`/users/${data.buyerId}`}>
            <a css={css`color: inherit;cursor: pointer;&:hover{opacity: .8;}`}>
              <Typography>{data.nickName}</Typography>
            </a>
          </Link>
          {Boolean(dateInfo) && <Typography variant="caption">{t(`TabPanelRow-${props.tabIdx}`, {date: formatDate(dateInfo, dateFormat)})}</Typography>}
        </Stack>
        <Stack css={css`flex-grow: 1;`} direction="row" justifyContent="flex-end" spacing={4}>
          {data.price && <Typography
            component="div"
            css={css`
              align-items: center;
              display: none;
              font-weight: 500;
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                display: flex;
              }
            `}
          >￥{formatNumber(data.price)}</Typography>}
          {
            // only display in 取引中tab
            props.tabIdx === 1 && (
              <Typography
                component="div"
                css={css`
                  align-items: center;
                  display: none;
                  font-weight: 500;
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    display: flex;
                  }
                `}
              ><FinishTextMemo finishTime={data.finishTime}/></Typography>
            )
          }
          <Button
            onClick={navigateToChat}
            startIcon={<DealChat/>}
            css={css`
              border-radius: 20px;
              background: #496CDC14;
              padding: 5px 10px;
              display: none;

              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                display: flex;
              }
            `}
          >
            {Boolean(data.isUnread) && <RedDot/>}
            <Typography>{t('3')}</Typography>
          </Button>
          <IconButton
            color="primary"
            size="small"
            css={css`
              padding: 0;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                display: none;
              }
            `}
            onClick={navigateToChat}
          >
            {Boolean(data.isUnread) && <RedDot css={css`right: 0;top: 0;`}/>}
            <DealChat css={css`font-size: 22px`}/>
          </IconButton>
        </Stack>
      </div>
    </div>
  )
}

const FinishTextMemo = memo(function FinishText({finishTime}: {finishTime: number}) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const finishTimeDateFormat = useMemo(() => isDesktop ? dateFormat : dateFormatSlash, [isDesktop])
  const { t } = useTranslation(ns)
  return <>{finishTime && t('2', {date: formatDate(finishTime, finishTimeDateFormat)})}</>
})

function RedDot(props: WithConditionalCSSProp<'div'>) {
  const theme = useTheme()
  return <div
    {...props}
    css={css`
      height: 9px;
      width: 9px;
      position: absolute;
      right: 0;
      top: 4px;
      border-radius: 100px;
      background: ${theme.palette.error.main}
    ;`}
  />
}

function EmptyTabContent(props: { descriptionText?: string }) {
  const theme = useTheme()
  return <div css={css`
    padding: 0 ${theme.spacing(3)};
    margin-top: 64px;
    max-width: 328px;
    margin-left: auto;
    margin-right: auto;
    @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
      max-width: 420px;
    }
  `}>
    <Image
      src={TreasureHuntIllustration}
      alt=""
      width={1437}
      height={895}
      layout="intrinsic"
    />
    {
      props.descriptionText &&
      <Typography
        color="inherit"
        css={css`
          color: ${theme.palette.smoke.dark};
          text-align: center;
          margin-top: ${theme.spacing(3)};
        `}
      >{props.descriptionText}</Typography>
    }
  </div>
}
