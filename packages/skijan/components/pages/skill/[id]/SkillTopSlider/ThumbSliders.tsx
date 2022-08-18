import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import {css} from '@emotion/react'
import IconButton from '@mui/material/IconButton'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import {Swiper, SwiperSlide} from 'swiper/react'
import {Grid, Pagination} from 'swiper'
import React, {useMemo} from 'react'
import {ItemType} from './shared-components/Viewer'
import {Swiper as SwiperClass} from 'swiper/types'
import SquareWrapper from './shared-components/SquareWrapper'
import PlayIconAbsolute from './shared-components/PlayIconAbsolute'
import {UploadTypes} from 'components/commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import {Theme} from '@mui/material/styles/createTheme'

type ThumbSliderProps = {
  setThumbsSwiper: (swiper: SwiperClass) => void
  currentMainIndex: number
  slideTo?: SwiperClass['slideTo'] | undefined
  thumbData: Array<MappedItemType>
}

type MappedItemType = { originIndex: number, computedIndex: number, data: ItemType }

const BASE_SWIPER_CONFIG = (theme: Theme) => (
  {
    freeMode: true,
    watchSlidesProgress: true,
    modules: [Grid, Pagination],
    breakpoints: {
      0: {
        slidesPerView: 3,
        slidesPerGroup: 2,
      },
      320: {
        slidesPerView: 4,
        slidesPerGroup: 2,
      },
      380: {
        slidesPerView: 5,
        slidesPerGroup: 2,
      },
      440: {
        slidesPerView: 6,
        slidesPerGroup: 2,
      },
      600: {
        slidesPerView: 7,
        slidesPerGroup: 2,
      },
      [theme.breakpoints.values.lg]: {
        slidesPerView: 6.1,
        slidesPerGroup: 6,
      },
    }
  }
)

// using in case number item => 12.
export function ThumbSlider({setThumbsSwiper, currentMainIndex, slideTo, thumbData}: ThumbSliderProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const slideToIndex = (idx: number) => {
    slideTo && slideTo(idx)
  }

  // css
  const {containerCss, navigateBtnCss} = useThumbCss()

  return (
    <div css={containerCss} className="thumb1">
      <IconButton
        onClick={() => slideToIndex(currentMainIndex + 1)}
        css={navigateBtnCss}
        color="primary"
        className="next-btn"
      ><ChevronRightIcon/></IconButton>
      <IconButton
        onClick={() => slideToIndex(currentMainIndex - 1)}
        css={navigateBtnCss}
        color="primary"
        className="prev-btn"
      ><ChevronLeftIcon/></IconButton>
      <Swiper
        {...BASE_SWIPER_CONFIG(theme)}
        onSwiper={setThumbsSwiper}
        slidesPerView="auto"
        className="thumb-slider"
        grid={{rows: isDesktop ? 2 : 1, fill: 'column'}}
        spaceBetween={isDesktop ? 24 : 16}
      >
        {thumbData.map((item) => {
          return (
            <SwiperSlide key={item.originIndex} onClick={() => slideTo && slideTo(item.computedIndex, 300)}>
              <ThumbItem
                item={item}
                isActive={currentMainIndex === (isDesktop ? item.computedIndex : item.originIndex)}/>
            </SwiperSlide>
          )
        })}
      </Swiper>
    </div>
  )
}

// using in case number item <= 12.
export function ThumbSlider2({setThumbsSwiper, currentMainIndex, slideTo, thumbData}: ThumbSliderProps) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const slideToIndex = (idx: number) => {
    slideTo && slideTo(idx)
  }

  // css
  const {containerCss, navigateBtnCss} = useThumbCss()

  return (
    <div css={containerCss} className="thumb2">
      <IconButton
        onClick={() => slideToIndex(currentMainIndex + 1)}
        css={navigateBtnCss}
        color="primary"
        className="next-btn"
      ><ChevronRightIcon/></IconButton>
      <IconButton
        onClick={() => slideToIndex(currentMainIndex - 1)}
        css={navigateBtnCss}
        color="primary"
        className="prev-btn"
      ><ChevronLeftIcon/></IconButton>
      <Swiper
        {...BASE_SWIPER_CONFIG(theme)}
        onSwiper={setThumbsSwiper}
        slidesPerView="auto"
        className="thumb-slider"
        grid={{rows: isDesktop ? 2 : 1, fill: 'row'}}
        spaceBetween={isDesktop ? 24 : 16}
      >
        {thumbData.filter(item => item.data)
          .sort((item1, item2) => item1.originIndex - item2.originIndex)
          .map(item => {
            return (
              <SwiperSlide key={item.originIndex} onClick={() => slideTo && slideTo(item.originIndex, 300)}>
                <ThumbItem item={item} isActive={currentMainIndex === item.originIndex}/>
              </SwiperSlide>
            )
          })}
      </Swiper>
    </div>
  )
}

function ThumbItem({item, isActive}: { item: MappedItemType, isActive?: boolean }) {
  const theme = useTheme()
  if (!item.data) return <></>

  // css
  const containerCss = css`
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 10px;
    overflow: hidden;
    background: ${theme.palette.grey['100']};
    background-size: cover;
    transition: background .3s;

    &.is-active {
      border: 2px solid #496CDC;
      position: absolute;
      top: -1px;
      left: -1px;
    }

    // &:hover {
      //   background: ${theme.palette.grey['200']};
    // }

    img {
      max-width: 100%;
    }
  `
  return (
    <div css={css`
      width: 48px;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        width: 64px;
      }
    `}>
      <SquareWrapper
        css={containerCss}
        className={isActive ? 'is-active' : ''}
      >
        {
          item.data.type === UploadTypes.Youtube
            ? (
              <>
                <img src={item.data.thumbnailUrl} alt=""/>
                <PlayIconAbsolute size="medium" css={css`cursor: unset`}/>
              </>
            )
            : <img src={item.data.imageUrl} alt=""/>
        }
      </SquareWrapper>
    </div>
  )
}

// centralize css for ThumbSlider and ThumbSlider2
function useThumbCss() {
  const theme = useTheme()
  const containerCss = useMemo(() => css`
    position: relative;

    .swiper.thumb-slider {
      margin-top: 20px;
      height: 85px;
      padding: 2px;
      margin-left: 0;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        height: 180px;
        width: calc(100% - 64px);
      }

      .swiper-slide {
        position: relative;
        max-height: 48px;
        cursor: pointer;
        @media only screen and (max-width: ${theme.breakpoints.values.lg}px) {
          margin-right: ${theme.spacing(3)};
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-height: 64px;
          text-align: center;
          font-size: 18px;
          background: #fff;
        }
      }
    }

    &.thumb1 {
      .swiper-wrapper {
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          flex-direction: column;
          flex-wrap: wrap;
        }
      }

      .swiper-slide {
        position: relative;
        cursor: pointer;
      }
    }

    &.thumb2 {
      .swiper-wrapper {
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          flex-wrap: wrap;
          align-content: flex-start;
        }
      }

      .swiper-slide {
        order: 0 !important;
      }
    }
  `, [theme])

  const navigateBtnCss = useMemo(() => css`
    position: absolute;
    right: 0;
    box-shadow: 0 3px 6px #00000014;
    top: 0;
    display: none;

    &.prev-btn {
      top: 48px;
    }

    @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
      display: flex;
    }
  `, [theme])

  return {
    navigateBtnCss,
    containerCss,
  }
}
