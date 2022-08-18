import { css } from '@emotion/react'
import { Stack, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { NextRequest } from 'next/server'
import { toastHandler } from 'contexts/ToastContext'
import { MypageDetailLayout, nsTranMypageDetailLayout } from 'components/layouts'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { useTranslation } from 'next-i18next'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import useMediaQuery from '@mui/material/useMediaQuery'
import TreaSureHunt from 'components/pages/skill/treasure_hunt.png'
import AddIcon from '@mui/icons-material/Add'
import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { ActionComponentHOC } from 'components/pages/mypage/display/skill/Skill'
import Image from 'next/image'
import { getAllSkillServiceList } from 'store/mypage/display/skill/skillSlice'
import { GgjContainButton } from 'components/commons/GgjButton'
import InfiniteScrollCommon from 'components/commons/GgjInfinite'
import { IPaging } from 'app.d'
import { ChangeStatusBtn } from 'components/pages/mypage/display/skill/ChangeStatusBtn'
import ModalConfirmChangeStatus, {
  ModalConfirmChangeStatusNS,
  useModalConfirmChangeStatus,
} from 'components/pages/mypage/display/skill/ChangeStatusBtn/ModalConfirmChangeStatus'
import Button, { ButtonProps } from '@mui/material/Button'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import {
  SaleStatusType,
  STATUS_MAP,
  STATUS_MAP_REVERSE,
} from 'components/pages/mypage/display/skill/skill-common-types'
import { skjMiddleware } from '../../../../common/middleware/SkjMiddleware'
import { nsDisplaySkill } from 'components/pages/mypage/display/skill/constants'
import {useLayoutContext} from '../../../../contexts/LayoutContext'
import { dateFormatSlash, formatDate } from 'common/date'
import GgjCommonHead from '../../../../components/commons/GgjCommonHead'
interface ThemeCssProps<T> {
  color: { white: T; grey: T; blue: T; black: T },
  pagination: {
    page: number;
    limit: number;
  }
}
interface MenuProps {
  title: string
  id: number
  tab: number
}
interface ItemProps<T> {
  createdAt: T | null
  finishedAt: T | null
  id: T;
  limit: T | null;
  priority: T;
  noOfInprogress: T;
  statusType: T;
  title: string;
  imageUrl: string;
}
interface DataCommonProps {
  pagination: IPaging | Record<string, never>;
  indexTab: number;
  list: ItemProps<number>[]
}
export const themeCss: ThemeCssProps<string> = {
  color: {
    white: '#FFFFFF',
    grey: '#f1f3fc',
    blue: '#4a6cdc',
    black: '#496cdc14',
  },
  pagination: {
    page: 1,
    limit: 10,
  }
}
const ItemComponent = (props: {list: ItemProps<number>[], indexTab: number, handleSelectItem: (saleValue: ItemProps<number>, newStatusType: SaleStatusType) => void}) => {
  const {list, handleSelectItem, indexTab} = props
  const theme = useTheme()
  const { t } = useTranslation(nsDisplaySkill)
  return (
    <>
      {
        list?.length > 0 && list.map((valuesSale) => {
          return (
            <Stack
              key={valuesSale.id}
              css={css`
                padding: 18px 12px;
                width: 100%;
                @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                  padding: 20px 0;
                }
              `}
              justifyContent="flex-start"
              alignItems="flex-start"
              direction="row">
              <div
                css={css`
                  border-radius:0.75rem;
                  object-fit:contain;
                  height: 56px;
                  margin: 0 16px 0 0;
                  width: 56px;
                  flex: 0 0 56px;
                  background: ${theme.palette.grey.A200};
                  img {
                    max-width: 100%;
                    max-height: 100%;
                    object-fit: cover;
                    border-radius: 10px;
                  }
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    margin: 0 16px 0 0;
                  }
                `}
              >
                {
                  <img
                    src={valuesSale?.imageUrl || ''}
                    alt=""
                    width="56"
                    height="56"
                  />
                }
              </div>
              <Stack
                css={css`
                  width: 100%;
                  max-width: 800px;
                  padding-bottom: 16.5px;
                  border-bottom: 1px solid ${theme.palette.smoke.light};
                `}
                justifyContent="space-between"
                alignItems="flex-start"
                direction="row"
              >
                <Stack
                  css={css`
                  width: 100%;
                  max-width: 520px;
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    margin-right: 16px;}`}
                  justifyContent="flex-start"
                  direction="column">
                  <div>
                    <Link href={`/mypage/display/skill/${valuesSale.id}`} passHref>
                      <Tooltip placement="bottom-start" title={valuesSale?.title || ''}>
                        <a css={css`text-decoration: none; color: inherit;&:hover{opacity: .8}`}>
                          <Typography className='ggj-wt' css={css`width: 100%;cursor: pointer;`} variant="subtitle1">
                            {valuesSale?.title || ''}
                          </Typography>
                        </a>
                      </Tooltip>
                    </Link>
                  </div>
                  <Typography
                    css={css`width: 100%;`} variant="caption">
                    {(() => {
                      switch(indexTab) {
                      case STATUS_MAP.close:
                        return `${formatDate(valuesSale?.finishedAt || 0, dateFormatSlash)}${t('31')}`
                      case STATUS_MAP.draft:
                        return `${formatDate(valuesSale?.createdAt || 0, dateFormatSlash)}${t('30')}`
                      default:
                        return `${valuesSale?.noOfInprogress || '0'}/${valuesSale?.limit || 0}${t('9')}`
                      }
                    })()}
                  </Typography>
                </Stack>
                <Stack
                  css={css`
                  margin-right: 0;
                  width: unset;
                  max-width: unset;
                  justify-content: flex-start;
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    width: 100%;
                    max-width: 200px;
                    margin-right: 4px;
                    justify-content: flex-end;
                  }
                  #basic-button:hover {
                    background-color: ${themeCss.color.black};
                  }`}
                  alignItems="center"
                  direction="row">
                  <ChangeStatusBtn
                    statusTypeInitValue={valuesSale.statusType}
                    handleSelectItem={(val) => handleSelectItem(valuesSale, val)}
                    Button={CustomButton}
                    ButtonProps={{
                      css: css`
                        white-space: nowrap;
                        color: ${theme.palette.jade.light};
                        cursor: ${valuesSale.statusType !== STATUS_MAP.close ? 'pointer' : ''};
                      `,
                      startIcon: <DesktopIcon isActive={valuesSale.statusType === 1}/>,
                      variant: 'outlined',
                      color: 'inherit',
                    }}
                  />
                  <ActionComponentHOC saleId={valuesSale.id} statusType={valuesSale.statusType}/>
                </Stack>
              </Stack>
            </Stack>
          )
        })
      }
    </>
  )
}

function DesktopIcon(props: { isActive?: boolean }) {
  const {isActive} = props
  const theme = useTheme()
  return <div css={css`
    position: relative;
    height: 24px;
    width: 24px;
  `}>
    <div
      css={css`
        position: absolute;
        background: ${isActive ? theme.palette.primary.main : 'gray'};
        height: 8px;
        width: 8px;
        bottom: -1px;
        right: 1px;
        border: 1px solid #fff;
        border-radius: 100px;
      `}
      color="inherit"
    />
    <DesktopWindowsIcon/>
  </div>
}
function CustomButton(props: ButtonProps) {
  const theme = useTheme()
  return <Button
    {...props}
    css={css`
      width: 100%;
      max-width: 144px;
      height: 44px;
      border: 1px solid ${theme.palette.smoke.light};
      border-radius: 0.65rem;
      display: none;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        display: flex;}
    `}
  >
    {props.children}
  </Button>
}

export const ItemComponentMemo = memo(ItemComponent)
const SaleList = ({handleOnChangeTab, listSkill}: {listSkill: ItemProps<number>[], handleOnChangeTab: (index: number ) => void}) => {
  const { t } = useTranslation(nsDisplaySkill)
  const theme = useTheme()
  const router = useRouter()
  const {t: skillStatusType}: any = router.query
  const paramsTab: number = parseInt(STATUS_MAP[skillStatusType] as unknown as string)
  const [active, setActive] = useState<number>(isNaN(paramsTab) ? STATUS_MAP.sale : paramsTab)
  const checkBreakpointTypo = useMediaQuery(`(max-width:${theme.breakpoints.values.md}px)`)
  const dataTab: MenuProps[] = [
    { title: t('4'), tab: STATUS_MAP.sale, id: 1},
    { title: t('5'), tab: STATUS_MAP.pause, id: 2},
    { title: t('6'), tab: STATUS_MAP.draft, id: 0},
    { title: t('7'), tab: STATUS_MAP.close, id: 3}]
  const handleChangeTab = (index: number ): void => {
    setActive(index)
    if(active !== index) {
      router.replace(
        {query: Object.assign({}, router.query, {t: STATUS_MAP_REVERSE[index]})},
        undefined,
        {shallow: true}
      )
      handleOnChangeTab(index)
    }
  }
  return (
    <>
      <Stack
        justifyContent="flex-start"
        alignItems="center"
        direction="row"
        css={css`
          width: 100%;
          margin-bottom: 0;
          margin-right: ${active !== STATUS_MAP.sale ? '2rem' : ''};
          padding: 0 0 12px 14px;
          overflow-x: auto;
          flex-wrap: nowrap;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            margin-bottom: 10px;
            padding: 0;
            overflow-x: unset;
            flex-wrap: unset;
          }
        `}
      >
        {dataTab?.length > 0 &&
          dataTab.map(({tab, title, id}) => {
            return (
              <div
                onClick={() => handleChangeTab(id)}
                key={id}
                css={css`
                  transition: ${tab === active ? 'background-color 0.5s linear' : ''};
                  background-color: ${tab === active ? theme.palette.primary.main : ''};
                  margin: 12px 17px 0 0;
                  cursor:pointer;
                  padding: 10px 17px;
                  border-radius:2rem;
                  height:44px;
                  display:inline-flex;
                  justify-content:center;
                  align-items:center;
                  @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                    margin-left: 0;
                    margin-right: 0;
                  }
                `}>
                <Typography
                  css={css`
                    white-space: nowrap;
                    color: ${tab === active ? themeCss.color.white : ''};`} variant="subtitle1">
                  {title}
                </Typography>
              </div>
            )})}
      </Stack>
      {
        active && active === STATUS_MAP.pause && listSkill?.length > 0 ? <Typography css={css`
        width: 100%;
        margin: 22px 0 24px 0;
        padding: 0 14px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          padding: 0;
        }`} variant={checkBreakpointTypo ? 'subtitle2' : 'subtitle1'}>
          {t('26')}
        </Typography> : <></>
      }
    </>
  )
}
const ButtonComponent = () => {
  const { t } = useTranslation(nsDisplaySkill)
  const theme = useTheme()
  const router = useRouter()
  const onClickAddSkill = () => {
    router.push('/mypage/display/skill/input').then()
  }
  return (
    <Stack
      alignItems="center"
      direction="row"
      css={css`
      height: 48px;
      position: relative;
      border-bottom: 1px solid #c6c6c6;
      width: 100%;
      display: none;
      justify-content: center;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        margin: 40px 0 26px 0;
        height: unset;
        display: flex;
        position: static;
        border-bottom: unset;
        justify-content: flex-end;
      }
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        justify-content: space-between;
      }`}>
      <Typography
        css={css`
          display: none;
          font-size: 16px;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            font-size: 24px;
          }
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            display:flex;
          }`}>
        {t('2')}
      </Typography>
      <GgjContainButton
        css={css`
          width: 100%;
          justify-content: center;
          align-items: center;
          max-width: 111px;
          display:none;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            display:flex;}
          `}
        onClick={onClickAddSkill}
      >
        <AddIcon css={css`color: ${themeCss.color.white};`}/>
        <Typography
          css={css`
          margin-left: 9px;
          color: ${themeCss.color.white};`} variant="subtitle1">
          {t('3')}
        </Typography>
      </GgjContainButton>
    </Stack>
  )
}
export const ButtonComponentHOC = memo(ButtonComponent)
const Skill = () => {
  const { t } = useTranslation(nsDisplaySkill)
  const { updateLayoutSetting } = useLayoutContext()
  const theme = useTheme()
  const router = useRouter()
  const {t: skillStatusType}: any = router.query
  const paramsTab: number = parseInt(STATUS_MAP[skillStatusType] as unknown as string)
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`, {noSsr: true})
  const [dataCommon, setDataCommon] = useState<DataCommonProps>({
    pagination: {},
    indexTab: -1,
    list: [],
  })
  const handleOnChangeTab = useCallback(async (index: number , type: 'changeTab' | 'infiniteScroll') => {
    try {
      loadingOnHandler()
      const {page} = dataCommon.pagination
      const {page: pageDefault, limit: limitDefault} = themeCss.pagination
      const {data,error}: {data: any, error?: string | undefined} = await getAllSkillServiceList({} as NextRequest, index && index !== 0 && index > -1 ? index : STATUS_MAP.draft,
        type === 'changeTab' ? pageDefault : (page > 0 ? page+pageDefault : pageDefault), limitDefault)
      if (error) {
        toastHandler({type: 'error'})
        return
      }
      setDataCommon({...dataCommon,
        // save the index of the tab when infinite scroll will reuse the index of this tab
        indexTab: dataCommon.indexTab !== index ? index : dataCommon.indexTab,
        // reset list when change tab or scroll infinite
        list: data?.data?.length > 0 ? (type === 'changeTab' ? [...data.data] : [...dataCommon.list, ...data.data]) : [],
        // reset pagination when change tab or scroll infinite
        pagination: data?.pagingMeta || {}})
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataCommon])

  const headData = useMemo(() => ({
    title: t('32'),
    description: t('34'),
    keywords: t('33'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: t('2'),
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/mypage')
    })
    handleOnChangeTab(isNaN(paramsTab) ? STATUS_MAP.sale : paramsTab, 'changeTab')
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <section
        css={css`
        margin: 0 auto 2.5rem auto;
        flex-direction: column;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        width: 100%;
        max-width: calc(100vw - 16px*2);
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 668px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 856px;
        }`}>
        <ButtonComponentHOC/>
        <SaleList listSkill={dataCommon.list} handleOnChangeTab={(index: number) => handleOnChangeTab(index, 'changeTab')} />
        {dataCommon?.list?.length === 0 ? (
          <Stack
            justifyContent="center"
            alignItems="center"
            direction="column"
            css={css`
            width: 100%;
            height: 100%;
            margin: 58.89px 19.43px 0 24.68px;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              margin: 64px auto;}`}>
            <div css={css`
              width: 100%;
              max-width: 315.89px;
              height: 219.84px;
              margin-bottom: 24.26px;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                max-width: 385.23px;
                height: 268.1px;
                margin-bottom: 24.93px;}`} >
              <Image src={TreaSureHunt} alt='NoDataSkijan' objectFit='contain' />
            </div>
          </Stack>
        ): <div css={css`width:100%;`}>
          <InfiniteScrollCommon
            loader='' scrollableTarget={isDesktop ? 'BodyWrapper' : ''} hasMore={dataCommon?.pagination?.hasNextPage}
            next={() => handleOnChangeTab(dataCommon.indexTab, 'infiniteScroll')} dataLength={dataCommon.list.length} >
            <Items indexTab={dataCommon.indexTab} handleOnChangeTab={handleOnChangeTab} dataCommon={dataCommon}/>
          </InfiniteScrollCommon>
        </div>}
      </section>
    </>
  )
}

function Items({dataCommon, handleOnChangeTab, indexTab}: {
  dataCommon: DataCommonProps,
  indexTab: number,
  handleOnChangeTab: (idx: number, type: 'changeTab' | 'infiniteScroll') => Promise<void>
}) {
  const { t } = useTranslation(nsDisplaySkill)
  const {
    openModal,
    setOpenModal,
    modalProps,
    setCurrentItem,
    setNewStatusType,
    onSubmitStatus,
    setModalProp,
    calcModalState,
  } = useModalConfirmChangeStatus()
  const handleSelectItem = useCallback((saleValue: ItemProps<number>, newStatusType: SaleStatusType) => {
    setModalProp(calcModalState(STATUS_MAP_REVERSE[saleValue.statusType] ?? 0, newStatusType, t))
    setCurrentItem({statusType: saleValue.statusType, id: saleValue.id})
    setNewStatusType(STATUS_MAP[newStatusType])
    setOpenModal(true)
  }, [
    setModalProp,
    setCurrentItem,
    setNewStatusType,
    setOpenModal,
    calcModalState,
    t,
  ])
  return (
    <>
      <ItemComponentMemo indexTab={indexTab} handleSelectItem={handleSelectItem} list={dataCommon.list}/>
      <ModalConfirmChangeStatus
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={() => onSubmitStatus().then(() => handleOnChangeTab(dataCommon?.indexTab, 'changeTab'))}
        {...modalProps}
      />
    </>
  )
}
export async function getServerSideProps({ req, resolvedUrl }: { req: NextRequest, resolvedUrl: string }) {
  const re = skjMiddleware(req, resolvedUrl)
  if (re !== true) {
    return re
  }
  return {
    props: {
      ...await ggjServerSideTranslations(req as NextRequest, [nsDisplaySkill, ModalConfirmChangeStatusNS], nsTranMypageDetailLayout),
    },
  }
}
export default Skill
Skill.Layout = MypageDetailLayout
