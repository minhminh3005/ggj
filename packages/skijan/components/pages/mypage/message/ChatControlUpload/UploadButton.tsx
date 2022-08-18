import { memo, useContext } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { GgjContainButton } from '../../../../commons/GgjButton'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import {
  // Action,
  // DispatchContext,
  OptFileContext,
  StateContext,
} from './ChatUploadContext'

const UploadButton = ({handleCloseModal}:{handleCloseModal:()=>void}) => {
  const theme = useTheme()
  const state = useContext(StateContext)
  // const dispatch = useContext(DispatchContext)
  const { maxFiles } = useContext(OptFileContext)
  const isDisableButton =
    !state.listFiles.length || state.listFiles.length >= maxFiles

  const handleUpload = () => {
    // dispatch({ type: Action.CallApiUpload })
    handleCloseModal()
  }

  return (
    <div
      css={css`
        padding: ${theme.spacing(3)} ${theme.spacing(4)};
        background: #ffffff;
      `}
    >
      <GgjContainButton
        disabled={isDisableButton}
        onClick={handleUpload}
        css={css`
          width: 100%;
        `}
      >
        <SendRoundedIcon
          css={css`
            color: #ffffff;
            font-size: 16px;
            margin-right: ${theme.spacing(2)};
          `}
        />
        ファイルを送信
      </GgjContainButton>
    </div>
  )
}
export default memo(UploadButton)
