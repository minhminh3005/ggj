import {memo, useMemo} from 'react'
import {css} from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import React, {useState, useEffect, useCallback} from 'react'

// Import Swiper React components
import {Swiper, SwiperSlide} from 'swiper/react'
import useMediaQuery from '@mui/material/useMediaQuery'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/navigation'
import 'swiper/css/thumbs'
import 'swiper/css/zoom'

// import required modules
import {FreeMode, Navigation, Thumbs, Zoom} from 'swiper'
import {Swiper as SwiperClass} from 'swiper/types'
import {getMappedData} from './dataMapping'
import SquareWrapper from './shared-components/SquareWrapper'

// store
import  {ns as nsImageViewer , Viewer, slice as imageViewerSlice} from './shared-components/Viewer'
import  {ItemType} from './shared-components/Viewer'
import {reducerManager} from 'store/store'
import {actions as actionImageViewer} from './shared-components/Viewer'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs} from 'store/skillSlice'
import {IconButton} from '@mui/material'

import {ThumbSlider, ThumbSlider2} from './ThumbSliders'
import {VideoItemNoAutoPlay} from './shared-components/VideoItem'
import {GgjFavoriteButton} from 'components/commons/GgjFavoriteButton'
import {UploadTypes} from 'components/commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'

import { useRouter } from 'next/router'
type MappedItemType = {originIndex: number, computedIndex: number, data: ItemType}

function SkillTopSlider({className}: {className?: string}) {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const url = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.generalInfoSkill.url ?? '[]')
  const isFavorite = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.generalInfoSkill.isFavorite ?? '[]')
  const imageUrl = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.generalInfoSkill.imageUrl ?? '[]')
  const router = useRouter()

  const sliderData = useMemo(() => {
    const thumbnail = { type: UploadTypes.Image, imageUrl: imageUrl}

    // data from api may be not json, try catch it
    try {
      return [thumbnail, ...JSON.parse(url)]
    } catch (e) {
      console.log(e)
      return [thumbnail]
    }
  }, [url, imageUrl])

  const {mainData, thumbData} = useMemo(() => getMappedData(sliderData, isDesktop), [isDesktop, sliderData])

  useEffect(() => {
    reducerManager.add(imageViewerSlice)
    return function () {
      reducerManager.remove(nsImageViewer)
    }
  }, [])

  // swiper instances
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null)
  const [mainSwiper, setMainSwiper] = useState<SwiperClass>()
  const [currentMainIndex, setCurrentMainIndex] = useState(0)

  // handle on slide change
  type TOnSlideChange = SwiperClass & {swipeDirection: 'next'|'prev'}
  const onSlideChange = (swiper: TOnSlideChange) => {
    // update currentMainIndex
    setCurrentMainIndex(swiper.realIndex)

    // slide thumb to corresponding position
    const positionToSlide = Math.floor(swiper?.activeIndex)
    thumbsSwiper?.slideTo(isDesktop ? positionToSlide/2 : positionToSlide)
  }

  //
  const handleClickImages = useCallback((item: MappedItemType) => {
    if(isDesktop) return
    dispatch(actionImageViewer.setFirstViewingImageIndex(isDesktop ? item.computedIndex : item.originIndex))
    dispatch(actionImageViewer.setViewingImages(mainData.map(item => item.data)))
  }, [dispatch, isDesktop, mainData])

  // css
  const containerCss = css`
    width: 592px;
    max-width: calc(100vw - 32px);
    position: relative;
    .swiper.main-slider {
      border-radius: 10px;
      height: 100%;
      max-height: calc(100vw - 32px);
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        max-width: 100%;
      }
      img {
        max-width: 100%;
        max-height: 100%;
      }
    }
  `

  if(!sliderData.length) return <></>

  return (
    <div css={containerCss} className={className}>
      <SquareWrapper>
        <Swiper
          onSwiper={setMainSwiper}
          spaceBetween={10}
          navigation={false}
          slidesPerView={1}
          modules={[FreeMode, Navigation, Thumbs, Zoom]}
          className="main-slider"
          onSlideChange={(swiper) => onSlideChange(swiper as TOnSlideChange)}
        >
          {mainData.map((item, idx) => {
            return <SwiperSlide key={idx} onClick={() => handleClickImages(item)}>
              {({isActive}) => <MainItem item={item} isActive={isActive}/>}
            </SwiperSlide>
          })}
        </Swiper>
      </SquareWrapper>
      {
        mainData.length > 12
          ? <ThumbSlider
            setThumbsSwiper={setThumbsSwiper}
            currentMainIndex={currentMainIndex}
            slideTo={(idx) => (mainSwiper?.slideTo(idx))} thumbData={thumbData}
          />
          : <ThumbSlider2
            setThumbsSwiper={setThumbsSwiper}
            currentMainIndex={currentMainIndex}
            slideTo={(idx) => (mainSwiper?.slideTo(idx))} thumbData={thumbData}
          />
      }
      <Viewer />
      <IconButton
        component="div"
        css={css`
          top: 16px;
          right: 16px;
          position: absolute;
          z-index: 1000;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 44px;
          width: 44px;
          padding: 0;
          background: #FFFFFF 0 0 no-repeat padding-box;
          &:hover {
            background: #FFFFFF 0 0 no-repeat padding-box;
            opacity: .8;
          }
        `}
        size="small"
      >
        <GgjFavoriteButton id={parseInt(`${router.query.id}`)} isFavorite={isFavorite}/>
      </IconButton>
    </div>
  )
}

function MainItem({item, isActive}: {item: MappedItemType, isActive: boolean}) {
  const theme = useTheme()
  return <div
    css={css`
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      background: ${theme.palette.grey['100']};
      img {
        height: auto;
      }
      iframe {
        width: 100%;
        height: calc(100% - 160px);
        border: none;
      }
      &.${UploadTypes.Youtube} img {
        width: 100%;
      }
    `}
    className={item.data.type}
  >
    {
      item.data.type === UploadTypes.Youtube
        ? (
          <VideoItemNoAutoPlay
            item={item.data}
            isActive={isActive}
          />
        )
        : <img src={item.data.imageUrl} alt=''/>
    }
  </div>
}


export default memo(SkillTopSlider)


