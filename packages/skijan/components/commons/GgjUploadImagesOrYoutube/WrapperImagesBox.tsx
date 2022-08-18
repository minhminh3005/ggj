import {memo, useContext} from 'react'
import {Box, Card, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import CloseIcon from '@mui/icons-material/Close'
import {rgba} from 'emotion-rgba'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import {
  Action,
  DispatchContext,
  ImageTypes,
  OptFileContext,
  UploadTypes,
  YoutubeTypes
} from './UploadImagesOrYoutubeContext'

const WrapperImagesBox = ({
  index,
  item,
  type
}: { index: number, item: ImageTypes | YoutubeTypes, type: UploadTypes }) => {
  const theme = useTheme()
  const dispatch = useContext(DispatchContext)
  const {maxFiles} = useContext(OptFileContext)
  const handleRemove = () => {
    dispatch({type: Action.RemoveImage, payload: {index, item: item, type}})
  }

  let src = ''
  if (type == UploadTypes.Image) {
    const image = item as ImageTypes
    src = image.imageUrl
  } else if (type == UploadTypes.Youtube) {
    const youtube = item as YoutubeTypes
    src = youtube.thumbnailUrl
  }

  return <Card css={css`
    overflow: hidden;
    position: relative;
    width: 115px;
    height: 115px;
    border-radius: 10px;
    @media (min-width: ${theme.breakpoints.values.md}px) {
      width: 132px;
      height: 132px;
    }
    @media (min-width: ${theme.breakpoints.values.lg}px) {
      width: 152px;
      height: 152px;
    }

  `}>
    <div
      css={css`
        user-select: none;
        pointer-events: none;
        background: url('${src}');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        width: 100%;
        height: 100%;
      `}
    />
    <button onClick={handleRemove} css={css`
      position: absolute;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      top: 4px;
      right: 4px;
      background-color: ${rgba(theme.palette.jade.dark, 0.68)};
      border-radius: 50%;
      border: none;
      width: ${theme.spacing(4)};
      height: ${theme.spacing(4)};
      color: #FFFFFF;
      z-index: 100;
      pointer-events: auto;
    `}>
      <CloseIcon css={css`
        width: 14px;
        height: 14px`}/>
    </button>
    {
      type == UploadTypes.Youtube
      && <Box css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(calc(50% - ${theme.spacing(6)})) translateY(calc(50% - ${theme.spacing(6)}));
        background-color: ${rgba(theme.palette.jade.dark, 0.68)};
        border-radius: 50%;
        border: none;
        width: ${theme.spacing(6)};
        height: ${theme.spacing(6)};
        color: #FFFFFF;
      `}>
        <PlayArrowIcon css={css`
          width: 24px;
          height: 24px;`}/>
      </Box>
    }
    {
      maxFiles > 1 && <Box css={css`
        position: absolute;
        top: 0;
        left: 0;
        background-color: ${theme.palette.primary.main};
        border: none;
        width: ${theme.spacing(4)};
        height: ${theme.spacing(4)};
        color: #FFFFFF;
        text-align: center;
        user-select: none;
      `}>
        {index + 1}
      </Box>
    }
  </Card>
}

export default memo(WrapperImagesBox)
