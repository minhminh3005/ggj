import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import {Typography, useMediaQuery} from '@mui/material'
import GgjSlide from 'components/commons/GgjSlide'
import { useTranslation } from 'next-i18next'
import GgjProductBox, {breakPointMobile, IGgjProductProps, IGgjSKillItem} from 'components/commons/GgjProductBox'
import { memo } from 'react'
import { typeCheck } from 'pages'
import {nsCommonCategories} from 'common/categories'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'

const nsTran = nsCommonCategories
const LazyItemRanking = ({data}: {data: IGgjProductProps}) => {
  const theme = useTheme()
  // @ts-ignore
  const isMobile = useMediaQuery(breakPointMobile(theme))
  return (
    <GgjLazyRenderComp
      alwaysShow={false}
      component={GgjProductBox}
      componentProps={{data: data}}
      minHeight={isMobile?140:365.42}
    />
  )
}
const GgjSlideCommon = ({categoryId, title, listData, type}: {type:string, categoryId: number, title?: string, listData: IGgjSKillItem[]}) => {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  // @ts-ignore
  const isMobile = useMediaQuery(breakPointMobile(theme))
  return (
    <GgjSlide
      id={`${type === typeCheck.ranking ? 'ranking' : 'customContent'}_${categoryId}`}
      title={type === typeCheck.ranking ? t(`${categoryId}`) : title || ''}
      list={listData}
      showNavBtn={true}
      component={LazyItemRanking}
      minHeight={isMobile?140:365.42}
      slideProps={{
        centeredSlides: false,
        breakpoints: {
          0: {
            slidesPerView: 1.2,
            spaceBetween: 6,
          },
          375: {
            slidesPerView: 2.1,
            spaceBetween: 6,
          },
          475: {
            slidesPerView: 2.2,
            spaceBetween: 6,
          },
          600: {
            slidesPerView: 3.1,
            spaceBetween: 6,
          },
          768: {
            slidesPerView: 3.5,
            spaceBetween: 6,
          },
          960: {
            slidesPerView: 3,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 3.2,
            spaceBetween: 24,
          },
          1280: {
            slidesPerView: 4.2,
            spaceBetween: 24,
          },
          1440: {
            slidesPerView: 5,
            spaceBetween: 24,
          },
        },
      }}
    />
  )
}
const SlideComponent = ({mockData, type, categoryId}: {categoryId?: number ,type: string, mockData: any, index?: number}) => {
  return (
    <>
      {
        type === typeCheck.ranking
          ? <GgjSlideCommon listData={mockData} categoryId={categoryId || -1} type={type}/>
          : Object.keys(mockData).length > 0 && Object.keys(mockData).map((valueKeys) => {
            return (
              <GgjSlideCommon key={valueKeys}
                listData={mockData[valueKeys]?.data || []} title={mockData[valueKeys]?.title || ''}
                categoryId={parseInt(valueKeys) || -1} type={type}/>
            )
          })
      }
    </>
  )
}
const SlideComponentHOC = memo(SlideComponent)
const Ranking = ({listRanking, type}: {type: string, listRanking: any}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <section css={css`margin-top: 64px;`} >
      {type === typeCheck.ranking && <Typography css={css` margin-bottom: 16px;
      color: ${theme.palette.jade.dark}`} variant='h6' component="h2">{t('mid_272')}</Typography>}
      {
        type === typeCheck.ranking
          ?  Object.keys(listRanking).length > 0 && Object.keys(listRanking).map((valueKeys) => {
            return (
              <SlideComponentHOC
                categoryId={parseInt(valueKeys)} type={type} key={parseInt(valueKeys)}
                mockData={listRanking[valueKeys]} />
            )
          })
          : <SlideComponentHOC type={type} mockData={listRanking} />
      }
    </section>
  )
}
export default memo(Ranking)
