import IconButton, {IconButtonProps} from '@mui/material/IconButton'
import {css} from '@emotion/react'
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline'
import React from 'react'

export default function PlayIconAbsolute({className, size}: {className?: string, size: IconButtonProps['size']}) {
  return <IconButton
    size={size}
    className={className}
    css={css`
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `}
  ><PlayCircleOutlineIcon fontSize={size}/></IconButton>
}
