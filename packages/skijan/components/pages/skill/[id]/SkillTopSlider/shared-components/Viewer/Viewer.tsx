import React, {memo, useCallback, useMemo, useState} from 'react'
import {css} from '@emotion/react'
import {Backdrop, BackdropProps, Box, ButtonGroup, Dialog, IconButton, Tooltip} from '@mui/material'
import {styled, useTheme} from '@mui/material/styles'
import {Close, ZoomIn, ZoomOut} from '@mui/icons-material'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, ItemType, ns} from './ViewerSlice'
import {Swiper, SwiperSlide} from 'swiper/react'
import SwiperCore, {FreeMode, Navigation, Thumbs, Zoom} from 'swiper'
import 'swiper/css'
import 'swiper/css/zoom'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/free-mode'

import {Controller} from 'swiper'
import {VideoItem} from '../VideoItem'

import {useSwiper} from 'swiper/react'
import {rgba} from 'emotion-rgba'
import {UploadTypes} from 'components/commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'

const CustomBackdrop = styled(Backdrop)<BackdropProps>(({theme}) => {
  return {
    backgroundColor: theme.palette.text.primary,
  }
})

function ToolbarGroup() {
  const theme = useTheme()
  const swiper = useSwiper()
  const handleZoomIn = () => {
    swiper?.zoom?.in()
  }
  const handleZoomOut = () => {
    swiper?.zoom?.out()
  }
  const containerCss = css`
    background: ${rgba(theme.palette.jade.light, 0.5)};
    position: absolute;
    z-index: 1;
    left: 50%;
    bottom: -20px;
    transform: translateX(-50%);
    height: 40px;
    @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
      bottom: -${theme.spacing(4)};
      height: 48px;
      svg {
        height: 32px;
        width: 32px;
      }
    }
  `
  return (
    <ButtonGroup variant="contained" css={containerCss} className="ToolbarGroup">
      <Tooltip title="Zoom In">
        <IconButton onClick={handleZoomIn}>
          <ZoomIn css={css` color: #ffffff;`}/>
        </IconButton>
      </Tooltip>
      <Tooltip title="Zoom Out">
        <IconButton onClick={handleZoomOut}>
          <ZoomOut css={css` color: #ffffff;`}/>
        </IconButton>
      </Tooltip>
    </ButtonGroup>
  )
}

const SwiperImageViewer = memo(function SwiperImageViewer({items}: {
  items: ItemType[]
}) {
  const theme = useTheme()
  const firstViewingIndex = useAppSelector(state => state[ns].firstViewingIndex)
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperCore>()
  const [swiperRealIndex, setSwiperRealIndex] = useState<number>(-1)
  const itemType = useMemo(() => {
    console.log(swiperRealIndex)
    return items[swiperRealIndex]?.type ?? ''
  }, [swiperRealIndex, items])
  const thumbImgItemCss = css`
    height: 48px;
    width: 48px;
    cursor: pointer;
    object-fit: cover;
    border-radius: 10px;
    @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
      height: 60px;
      width: 60px;
    }
  `

  return (
    <Box
      css={css`
        width: 100%;
        height: 100%;
        margin: 0 auto;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 100%;
        }
        &.${UploadTypes.Youtube} .ToolbarGroup {
          display: none;
        }
        .swiper {
          overflow: visible;
          .swiper-button-disabled {
            display: none;
          }
          .swiper-zoom-container {
            overflow: hidden;
          }
          .swiper-slide-zoomed .swiper-zoom-container {
            overflow: visible;
          }
        }`}
      className={itemType}
    >
      <Swiper
        onSlideChange={useCallback((swiper) => setSwiperRealIndex(swiper.realIndex), [])}
        modules={[Zoom, FreeMode, Thumbs, Controller, Navigation]}
        navigation={true}
        thumbs={{swiper: thumbsSwiper, autoScrollOffset: 1}}
        slidesPerView={1}
        zoom={{
          toggle: true,
          maxRatio: 2,
        }}
        onAfterInit={swiper => swiper.slideTo(firstViewingIndex, 0)}
        css={css`
          --swiper-navigation-color: #ffffff;
          height: calc(100% - 90px);
          @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
            height: calc(100% - 132px);
          }
          .swiper-wrapper {
            align-items: center;
          }
        `}
      >
        {
          items.map((item, idx) => (
            <SwiperSlide key={`${item.type}-${idx}`}>
              {({isActive}) => <ViewItem item={item} isActive={isActive}/>}
            </SwiperSlide>
          ))
        }
        {/* @ts-ignore */}
        <ToolbarGroup slot="container-end" items={items}/>
      </Swiper>

      {/* Thumbs */}
      {items.length > 1 &&
        <Box css={css`
          width: 100%;
          //max-width: 500px;
          overflow: hidden;
          margin: 0 auto;
          padding-top: ${theme.spacing(5)};
          height: 84px;
          @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
            height: 132px;
            padding-top: ${theme.spacing(6)};
          }

        `}>
          <Swiper
            modules={[Thumbs]}
            onSwiper={setThumbsSwiper}
            slidesPerView="auto"
            centeredSlides={true}
            watchSlidesProgress={true}
            spaceBetween={16}
            onAfterInit={swiper => swiper.slideTo(firstViewingIndex, 0)}
            css={css`
              .swiper-slide {
                opacity: 0.4;
                max-width: 48px;
                @media (min-width: ${theme.breakpoints.values.md}px) and (min-height: ${theme.breakpoints.values.md}px) {
                  max-width: 60px;
                }
              }

              .swiper-slide-thumb-active {
                opacity: 1;
              }
            `}
          >
            {items.map((item, idx) => (
              <SwiperSlide key={`${item.type}-${idx}`}>
                <img
                  css={thumbImgItemCss}
                  src={item.type === UploadTypes.Image ? item.imageUrl : item.thumbnailUrl}
                  alt="Image Viewer"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>}
    </Box>
  )
})

export const Viewer = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const viewingData = useAppSelector(state => state[ns]?.viewingData) as ItemType[]

  const handleCloseViewer = () => {
    dispatch(actions.setViewingImages([]))
  }
  return (
    <Dialog
      open={viewingData?.length > 0}
      onClose={handleCloseViewer}
      fullWidth={true}
      BackdropComponent={CustomBackdrop}
      PaperProps={{
        style: {
          background: 'none',
          boxShadow: 'none',
          width: '100%',
          height: '100%',
          maxHeight: '100%',
          margin: 0,
          overflow: 'visible',
        }
      }}
      css={css`z-index: 10000`}
    >
      {/* close modal button*/}
      <Tooltip title="Close">
        <IconButton
          onClick={handleCloseViewer}
          css={css`
            position: fixed;
            z-index: 2;
            right: ${theme.spacing(3)};
            top: ${theme.spacing(3)};
            color: #ffffff;
            background: ${theme.palette.jade.light};

            &:hover {
              background: ${theme.palette.smoke.dark};
            }
          `}
        >
          <Close/>
        </IconButton>
      </Tooltip>

      <SwiperImageViewer items={viewingData}/>
    </Dialog>
  )
}

function ViewItem({item, isActive = false}: {item: ItemType, isActive?: boolean}) {
  const theme = useTheme()
  const imgItemCss = css`
    max-width: 100%;
    height: auto;
    max-height: 80% !important;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      max-width: 80%;
      border-radius: 10px;
    }
  `
  const containerCss = css`
    margin: 0 auto;
    iframe {
      width: 100%;
      height: calc(100% - 132px);
      max-height: 45vh;
      border: none;
    }
  `
  return (
    <Box css={containerCss} className="swiper-zoom-container" >
      <>{
        item.type === UploadTypes.Image
          ? <img css={imgItemCss} src={item.imageUrl} alt="Image Viewer"/>
          : <VideoItem
            item={item}
            isActive={isActive}
            css={css`width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;`}/>
      }</>
    </Box>
  )
}
