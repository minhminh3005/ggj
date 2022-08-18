import {YoutubeItemType} from './Viewer'
import {useCallback, useEffect, useState} from 'react'
import {useTheme} from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import { css } from '@emotion/react'
import PlayIconAbsolute from './PlayIconAbsolute'

enum VideoEnumType {
  'thumb',
  'video',
}

export function VideoItem({item, isActive, className}: { item: YoutubeItemType, isActive: boolean, className?: string }) {
  const [mode, setMode] = useState<VideoEnumType>(VideoEnumType.thumb)
  useEffect(() => setMode(VideoEnumType.thumb), [isActive])
  if (mode === VideoEnumType.thumb && !isActive) return (
    <div onClick={() => setMode(VideoEnumType.video)} className={className}>
      <img src={item.thumbnailUrl} alt=""/>
      <PlayIconAbsolute size="large" css={css`
        background: #fff5;
        &:hover {
          background: #fff;
        }`}/>
    </div>
  )
  return (
    <iframe
      width="420"
      height="345"
      src={`https://www.youtube.com/embed/${item.thumbnailId}?autoplay=1&mute=1`}
      allowFullScreen/>
  )
}

export function VideoItemNoAutoPlay({
  item,
  isActive,
}: { item: YoutubeItemType, isActive: boolean }) {
  const theme = useTheme()
  const isDesktop = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const [mode, setMode] = useState<VideoEnumType>(VideoEnumType.thumb)
  const handleClickPlay = useCallback(() => {if (isDesktop) setMode(VideoEnumType.video)}, [isDesktop])
  useEffect(() => setMode(VideoEnumType.thumb), [isActive])

  if (mode === VideoEnumType.thumb) {
    return (
      <div
        css={css`
          height: 100%;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          .play-btn {
            background: #fff5;
            transition: background .3s;
          }
          &:hover {
            .play-btn {
              background: #fff;
            }
          }
        `}
        onClick={handleClickPlay}
      >
        <img src={item.thumbnailUrl} alt=""/>
        <PlayIconAbsolute size="large" className="play-btn"/>
      </div>
    )
  }
  return (
    <iframe
      width="420"
      height="345"
      src={`https://www.youtube.com/embed/${item.thumbnailId}?autoplay=1&mute=1`}
      allowFullScreen/>
  )
}
