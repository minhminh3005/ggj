import { css } from '@emotion/react'
import { Stack, Typography, useMediaQuery} from '@mui/material'
import { MypageDetailLayout, nsTranMypageDetailLayout } from 'components/layouts'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { useTheme } from '@mui/material/styles'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { NextRequest } from 'next/server'
import { useTranslation } from 'next-i18next'
import NoProductImage from 'components/pages/mypage/favorite/no-product.png'
import { toastHandler } from 'contexts/ToastContext'
import Box from '@mui/material/Box'
import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import InfiniteScrollCommon from 'components/commons/GgjInfinite'
import GgjProductBoxWrapper, {nsGgjProductBoxWrapper} from 'components/commons/GgjProductBoxWrapper'
import KeepAliveTabs from 'components/commons/GgjKeepAliveTabs'
import { getAllFavorite } from 'store/mypage/favorite/favoriteSlice'
import { AppError, IPaging } from 'app.d'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import { IGgjSKillItem } from 'components/commons/GgjProductBox'
import { useLayoutContext } from 'contexts/LayoutContext'
import { useRouter } from 'next/router'
import GgjCommonHead from '../../../components/commons/GgjCommonHead'
const nsTran = 'mypage@favorite'
interface ListTabProps {
  title: string
  rows: IGgjSKillItem[]
}
interface DataCommonProps {
  openDialogs: boolean
  pagination: IPaging
  skillId: number
  dataProduct: IGgjSKillItem[]
  onFavorite: () => void
}
interface DataProps {
  data: IGgjSKillItem[]
  pagingMeta: IPaging
  error?: string
}
interface PaginationDefaultProps {
  page: number
  limit: number
}
export const pagination: PaginationDefaultProps = {
  page: 1,
  limit: 10,
}
const dialogs = {
  close: -1
}
const DialogsComponent = (props: {handleCloseDialogs: (skillId: number) => void, dataCommon: DataCommonProps}) => {
  const {handleCloseDialogs, dataCommon} = props
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const {dataProduct, skillId} = dataCommon
  const indexFavoriteClicked = dataProduct.findIndex((values) => values.skillId === skillId)
  return (
    <Dialog
      open={dataCommon.openDialogs}
      onClose={(_, reason) => {
        if (reason !== 'backdropClick') {
          handleCloseDialogs(dialogs.close)
        }}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description">
      <DialogTitle id="alert-dialog-title">
        {t('8')}
      </DialogTitle>
      <DialogContent css={css`
      max-width: 280px;
      @media screen and (min-width: ${theme.breakpoints.values.md}px) {
        max-width: 500px;
      }`}>
        <DialogContentText id="alert-dialog-description">
          {`${dataProduct[indexFavoriteClicked].title} ${t('8')}`}
        </DialogContentText>
      </DialogContent>
      <DialogActions css={css`
      display: flex;
      justify-content: center;
      align-items: center;
      padding-bottom: 1.25rem;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        justify-content: flex-end;
        padding-right: 1.5rem;
      }`}>
        <Button css={css`
        width: 100%;
        max-width: 102px;
        height: 44px;
        border-radius: 0.65rem;
        margin-right: 16px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-right: 8px;
        }`} variant="outlined" onClick={() => handleCloseDialogs(dialogs.close)}>{t('10')}</Button>
        <Button css={css`
        width: 100%;
        max-width: 92px;
        height: 44px;
        border-radius: 0.65rem;`} variant="contained"
        onClick={() => handleCloseDialogs(dataCommon.skillId)}>
          {t('11')}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
const TabComponent = ({data}: {data: DataProps}) => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`, {noSsr: true})
  const scrollableTarget = useMemo(() => isDesktop ? 'BodyWrapper' : '', [isDesktop])
  const [dataCommon, setDataCommon] = useState<DataCommonProps>({
    openDialogs: false,
    skillId: -1,
    pagination: data?.pagingMeta || {},
    dataProduct: data?.data?.length > 0 ? data.data : [],
    onFavorite: () => ''
  })
  const listTab: ListTabProps[] = [
    {
      title: t('6'),
      rows: dataCommon.dataProduct,
    },
  ]
  const handleChangeStatusHeart = (skillId: number) => {
    // if skillId > -1 will call api change status heart
    if(skillId > -1) {
      try {
        loadingOnHandler()
        const {error}: any = dataCommon.onFavorite()
        if(!error) {
          const {dataProduct, pagination} = dataCommon
          const {limit: limitDefault} = pagination
          const index = dataProduct.findIndex((valuesProduct) => valuesProduct.skillId === skillId)
          index > -1 && dataProduct.splice(index, 1)
          const pageNew = Math.ceil(dataProduct.length / limitDefault)
          setDataCommon({...dataCommon, dataProduct: dataProduct, openDialogs: false, pagination: {...pagination, page: pageNew}})
          toastHandler({message: t('2'),type: 'success'})
        }
      } catch (e) {
        toastHandler({type: 'error'})
      } finally {
        loadingOffHandler()
      }
    } else {
      setDataCommon({...dataCommon, openDialogs: false})
    }
  }
  const handleCloseDialogs = async (skillId: number) => {
    handleChangeStatusHeart(skillId)
  }
  const NoProductElement = () => {
    return (
      <Stack css={css`
      width: 100%;
      padding: 23px 0 69px 0;`} justifyContent='center' alignItems='center' direction='column' >
        <div css={css`width: 100%; margin-bottom: 24px;width: 200px; height: 200px;`}>
          <Image src={NoProductImage} alt='NoProductSkjian' objectFit='contain' />
        </div>
        <Typography css={css`
        color: ${theme.palette.smoke.dark};
        margin-bottom: 16px;`} variant='subtitle1' >{t('3')}</Typography>
        <Typography variant='subtitle1' css={css`
        color: ${theme.palette.jade.light};
        text-align: center;`} >{t('4')}</Typography>
      </Stack>
    )
  }
  const getNewFavorite = async () => {
    try {
      loadingOnHandler()
      const {page} = dataCommon.pagination
      const {page: pageDefault, limit: limitDefault} = pagination
      const {data,error}: {data: any, error?: string | undefined} = await getAllFavorite(page > 0 ? page+pageDefault : pageDefault, limitDefault)
      if (error) {
        toastHandler({type: 'error'})
        return
      }
      setDataCommon({...dataCommon,
        // reset list when change tab or scroll infinite
        dataProduct: data?.data?.length > 0 ? [...dataCommon.dataProduct, ...data.data] : [],
        // reset pagination when change tab or scroll infinite
        pagination: data?.pagingMeta || {}})
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }
  const preOnFavorite = (onFavorite: () => void, skillId: number):void => {
    setDataCommon({...dataCommon, openDialogs: true, skillId, onFavorite})
  }
  return (
    <Box sx={{ width: '100%' }}>
      <KeepAliveTabs
        data={
          listTab.map((item) => (
            {
              title: item.title,
              tabContent: <div css={css`
                  padding: 32px 0;
                  @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                    padding: 41px 0;
                  }`} >
                {item?.rows?.length > 0 ? <InfiniteScrollCommon
                  css={css`padding: 0.05rem;`}
                  scrollableTarget={scrollableTarget}
                  loader=''
                  hasMore={dataCommon.pagination.hasNextPage}
                  next={getNewFavorite}
                  dataLength={dataCommon.dataProduct.length}>
                  <GgjProductBoxWrapper preOnFavorite={preOnFavorite} list={dataCommon.dataProduct}/>
                </InfiniteScrollCommon> : NoProductElement()}
              </div>
            }))}/>
      {dataCommon.openDialogs && <DialogsComponent dataCommon={dataCommon} handleCloseDialogs={handleCloseDialogs} />}
    </Box>
  )
}
const Favorite = ({data}: {data: DataProps}) => {
  const { t } = useTranslation(nsTran)
  const {updateLayoutSetting} = useLayoutContext()
  const router = useRouter()
  const headData = useMemo(() => ({
    title: t('12'),
    description: t('14'),
    keywords: t('13'),
  }), [])

  useEffect(() => {
    updateLayoutSetting({
      title: t('5'),
      isShowTitleOnHeaderMobile: true,
      onBack: () => router.push('/mypage')
    })
  }, [])
  return (
    <>
      <GgjCommonHead data={headData} />
      <section>
        <TabComponent data={data} />
      </section>
    </>
  )
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const data = await getAllFavorite(pagination.page, pagination.limit, req)
  if (!data || data?.error === AppError.ECB404) {
    return {
      notFound: true,
    }
  }
  return {
    props: {
      data: data.data,
      ...await ggjServerSideTranslations(req as NextRequest, [nsTran, ...nsGgjProductBoxWrapper], nsTranMypageDetailLayout),
    },
  }
}
export default Favorite
Favorite.Layout = MypageDetailLayout
