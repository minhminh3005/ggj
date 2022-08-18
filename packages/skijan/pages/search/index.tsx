import {NextRequest} from 'next/server'
import {ggjServerSideTranslations} from 'common/i18nUtils'
import {nsTranSurfaceSearchLayout, SurfaceSearchLayout} from 'components/layouts'
import {useCallback, useEffect, useMemo, useRef, useState, memo} from 'react'
import {Stack, Skeleton, Card, Typography, useMediaQuery, Button} from '@mui/material'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {NoSsr} from '@mui/material'
import { useRouter } from 'next/router'
import SearchNoDataIllustration from 'components/pages/search/assets/searchNoDataIllustration.png'
import Image from 'next/image'
import { useTranslation } from 'next-i18next'
import SortMenu from '../../components/pages/search/SortMenu'
import getCategories, {nsCommonCategories} from '../../common/categories'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {getSearchResults} from '../../store/searchSlice'
import {toastHandler} from '../../contexts/ToastContext'
import {buildQueryString, ggjDebounce, scrollToElSmoothly} from 'common/utils'
import GgjProductBoxWrapper, {nsGgjProductBoxWrapper} from 'components/commons/GgjProductBoxWrapper'
import { IGgjSKillItem } from 'components/commons/GgjProductBox'
import GgjCommonHead from '../../components/commons/GgjCommonHead'
import {SP} from '../../components/pages/search/consts'
import GgjHiddenH1 from 'components/commons/GgjHiddenH1'
const nsTran = 'surface@search'
interface ISearchResults {
  data: Array<IGgjSKillItem>,
  pagingMeta: IPaging,
}
interface IPaging {
  hasNextPage: boolean
  hasPreviousPage: boolean
  limit: number
  page: number
  totalItem: number
  totalPage: number
}

const SearchPageSkeleton = memo(function () {
  const theme = useTheme()
  const roundEdge = css`border-radius: 10px;`

  return (
    <NoSsr>
      <Stack spacing={4}>
        <Skeleton variant="text" css={css`
          border-radius: 10px;
          padding-top: 10px;
          height: 42px;
        `}/>
        <div css={css`
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 6px;
          padding: 0 1rem;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
            gap: 1.5rem;
          }
        `}>
          {Array(4).fill(null).map((item, idx) =>
            <Card
              key={idx}
              css={css`
                padding: ${theme.spacing(3)};
              `} >
              <Stack direction="column" spacing={2}>
                <Skeleton variant="rectangular" css={css`
                  border-radius: 10px;
                  height: auto;
                  aspect-ratio: 1/1;
                `} />
                <Skeleton variant="rectangular" css={roundEdge} height={74}/>
                <Stack direction="row" spacing={3}>
                  <div css={css`width: calc(100% - 56px)`}>
                    <Skeleton variant="rectangular" css={roundEdge} height={40}/>
                  </div>
                  <Skeleton variant="circular" width={40} height={40}/>
                </Stack>
              </Stack>
            </Card>
          )}
        </div>
      </Stack>
    </NoSsr>
  )
})
SearchPageSkeleton.displayName = 'SearchPageSkeleton'

const EmptyResult = memo(function () {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <div css={css`
      width: 100%;
      max-width: 328px;
      min-height: 386px;
      padding-top: 60px;
      padding-bottom: 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: auto;
      margin-bottom: 24px;
    `}>
      <Image
        src={SearchNoDataIllustration}
        alt="NoData"
      />
      <Typography
        css={css`
          margin: ${theme.spacing(4)} 0 ${theme.spacing(3)};
          color: ${theme.palette.smoke.dark};
        `}
        component="p"
      >{t('25')}</Typography>
      <Typography variant='subtitle1' component="p">{t('26')}</Typography>
    </div>
  )
})
EmptyResult.displayName = 'EmptyResult'

const ResultCategory = memo(() => {
  const router = useRouter()
  const { t } = useTranslation(nsCommonCategories)
  const [category, setCategory] = useState('')
  const resultRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    resultRef?.current && scrollToElSmoothly({el: resultRef.current})
  }, [])

  useEffect(() => {
    if (!router.query.pc) return
    const categories = getCategories()
    const currentQuery = router.query.pc?.toString().split(',')
    for (let i = 0, l = categories.length; i < l; i++) {
      const e = categories[i]
      const val = e.sub.some((e1) => {
        if (currentQuery[0] != String(e1.id)) return false
        // translate large category & middle category if any

        // list = mid + list small
        if([e1.id].concat(e1.smallIds || []).join() == currentQuery.join()) {
          setCategory([t(String(e.id))].concat([t(`mid_${e1.id}`)]).join('/'))
        }
        // list = list mid
        else {
          setCategory([t(String(e.id))].concat(currentQuery.length == 1 ? [t(`mid_${e1.id}`)] : []).join('/'))
        }
        return true
      })
      if (val) break
    }
  },[router.query.pc])

  return (
    <Typography
      variant="subtitle1"
      component="p"
      ref={resultRef}
      css={css`
        margin: 10px auto 0 8px;
        flex-wrap: wrap;
        word-break: break-all;
        flex: 1;
      `}
    >
      {category}
    </Typography>
  )
})
ResultCategory.displayName = 'ResultCategory'

const Paging = ({paging}:{paging: IPaging}) => {
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  return (
    <Stack
      spacing={3}
      direction='row'
      justifyContent='center'
      mt={3}
      css={css`
      visibility: ${paging.totalPage > 1? 'unset' : 'hidden'}
    `}>
      <Button
        variant="outlined"
        startIcon={<ChevronLeftIcon />}
        disabled={paging.page == 1}
        onClick={() => {
          buildQueryString(
            router,
            {[SP]: paging.page - 1},
            undefined,
            undefined,
            {shallow: true},
          )
        }}
      >
        {t('28')}
      </Button>
      <Button
        variant="outlined"
        endIcon={<ChevronRightIcon />}
        disabled={paging.page == paging.totalPage}
        onClick={() => {
          buildQueryString(
            router,
            {[SP]: paging.page + 1},
            undefined,
            undefined,
            {shallow: true},
          )
        }}
      >
        {t('29')}
      </Button>
    </Stack>
  )
}

const Search = () => {
  const [results, setResults] = useState<ISearchResults>({
    data: [],
    pagingMeta: {
      hasNextPage: false,
      hasPreviousPage: false,
      limit: 30,
      page: 1,
      totalItem: 0,
      totalPage: 1,
    },
  })
  const [isLoading, setIsLoading] = useState(true)
  const {t} = useTranslation(nsTran)
  const router = useRouter()
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const headData = useMemo(() => ({
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
  }), [])

  const getResults = useCallback(ggjDebounce(async () => {
    setIsLoading(true)
    try {
      const data = await getSearchResults(router.query)
      if (data.error == 'ECB001') {
        throw new Error(data.error)
      }
      setResults(data)
    } catch (e) {
      toastHandler({
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }, 500), [router])

  useEffect(getResults, [router])

  return <>
    <GgjCommonHead data={headData} />
    <GgjHiddenH1 />

    {isLoading ? <SearchPageSkeleton /> :
      <>
        <Stack direction="row" css={css`
        align-items: start;
        height: 42px;
        padding-top: 10px;
        margin-bottom: ${theme.spacing(4)};
      `}>
          <Typography variant="h5" component="p">{results.pagingMeta.totalItem}{t('24')}</Typography>
          <ResultCategory />
          {isDesktop && <SortMenu />}
        </Stack>
        {results.data.length ?
          <GgjProductBoxWrapper list={results.data} />
          : <EmptyResult />}
        <Paging paging={results.pagingMeta} />
      </>}
  </>
}

export async function getServerSideProps({req}: {req: NextRequest}) {
  const props = {
    props: {
      ...(await ggjServerSideTranslations(
        req as unknown as NextRequest,
        [nsTran, ...nsGgjProductBoxWrapper],
        nsTranSurfaceSearchLayout
      )),
    },
  }
  return { ...props }
}
export default Search
Search.Layout = SurfaceSearchLayout
