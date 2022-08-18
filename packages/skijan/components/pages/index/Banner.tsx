import {css} from '@emotion/react'
import GgjSlide from 'components/commons/GgjSlide'
import {Pagination} from 'swiper'
import {useTheme} from '@mui/material'
import {memo} from 'react'
import Link from 'next/link'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'

interface AdvertisingProps {
  id: number
  url: string
  imageUrl: string
  nameCate?: string
  title?: string
}

const SlideItem = ({data}: { data: AdvertisingProps }) => {
  const theme = useTheme()
  return (
    <picture>
      <Link href={data.url} passHref>
        <a rel="noreferrer">
          <div css={css`
            position: relative;
            padding-bottom: calc((200 / 640) * 100%);
            overflow:hidden;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              padding-bottom: calc((180 / 1480) * 100%);
            }
          `}>
            <picture>
              <source media={`(max-width: ${theme.breakpoints.values.md - 1}px)`} srcSet={`${data.imageUrl}/mobile`}/>
              <source media={`(min-width: ${theme.breakpoints.values.md}px)`} srcSet={`${data.imageUrl}/pc`}/>
              <img
                css={css`
                position: absolute;
                width: 100%;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                `}
                src={data.imageUrl}
                alt="Banner-Skjian"
              />
            </picture>
          </div>
        </a>
      </Link>
    </picture>
  )
}
const LazyItemBanner = ({data}: { data: AdvertisingProps }) => {
  return (
    <GgjLazyRenderComp
      alwaysShow={false}
      component={SlideItem}
      componentProps={{data: data}}
      minHeight={98}
    />
  )
}
const Banner = ({listAdvertising}: { listAdvertising: AdvertisingProps[] }) => {
  return (
    <GgjSlide
      id="banner"
      title=""
      list={listAdvertising}
      showNavBtn={false}
      component={LazyItemBanner}
      minHeight={98}
      slideProps={{
        modules: [Pagination],
        centeredSlides: false,
        pagination: true,
      }}
    />
  )
}
export default memo(Banner)
