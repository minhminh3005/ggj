import { css } from '@emotion/react'
import { useTheme } from '@mui/material'
import { Avatar, Stack, Typography } from '@mui/material'
interface MessageInfoBoxProps {
  hasNewMessage?: boolean
  isActive?: boolean
  message: string
  nickName: string
  updatedAt: string
  avatar: string
  id: number
}

export const MessageInfoBox = ({
  hasNewMessage,
  message,
  nickName,
  updatedAt,
  avatar,
  isActive,
}: MessageInfoBoxProps) => {
  const theme = useTheme()
  return (
    <Stack
      direction="row"
      alignItems="center"
      css={css`
        padding: ${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(2)}
          ${theme.spacing(1)};
        background-color: ${isActive ? '#22222229' : 'white'};
        cursor: pointer;
        &:hover {
          background-color: #22222229;
        }
      `}
    >
      <div
        css={css`
          height: ${theme.spacing(2)};
          min-width: ${theme.spacing(2)};
          width: ${theme.spacing(2)};
          background-color: ${hasNewMessage && theme.palette.ruby.main};
          border-radius: 50%;
          margin-right: ${theme.spacing(1)};
        `}
      />
      <Avatar
        css={css`
          height: 56px;
          width: 56px;
          margin-right: ${theme.spacing(3)};
        `}
        src={avatar}
      />

      <Stack flex="1">
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          css={css`
            margin-bottom: ${theme.spacing(1)}px;
          `}
        >
          <Typography className="ggj-wt" variant="body1">
            {nickName}
          </Typography>
          <Typography
            css={css`
              margin-left: ${theme.spacing(3)};
            `}
            variant="caption"
          >
            {updatedAt}
          </Typography>
        </Stack>
        <Typography className="ggj-wt" variant="caption">
          {message}
        </Typography>
      </Stack>
    </Stack>
  )
}
