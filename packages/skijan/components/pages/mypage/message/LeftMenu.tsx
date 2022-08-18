import { css } from '@emotion/react'
import { Box, useTheme } from '@mui/material'
import { EmptyMessageBox } from './EmptyMessageBox'
import { MessageInfoBox } from './MessageInfoBox'
import { memo } from 'react'

interface LeftMenuProps {
  cssStr?: string
  roomId?: number
}

function Menu({ cssStr,roomId }: LeftMenuProps) {
  const theme = useTheme()

  const rooms = [
    {
      title: 'Skill title skill titlell title',
      nickName: 'Client nickname',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKsLH_FgTGo7a5V3JLu7ecz8SxULQhTIIGxQ&usqp=CAU',
      updatedAt: '22/10/2022',
      message: 'Last message last message last message',
      hasNewMessage: true,
      id: 1,
    },
    {
      title: 'Skill title skill titlell title',
      nickName: 'Client nickname',
      avatar:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKsLH_FgTGo7a5V3JLu7ecz8SxULQhTIIGxQ&usqp=CAU',
      updatedAt: '22/10/2022',
      message: 'Last message last message last message',
      id: 2,
    },
  ]
  return (
    <Box
      css={css`
        width: 320px;
        min-width: 320px;
        border-radius: 10px;
        height: inherit;
        border: 1px solid ${theme.palette.smoke.light};
        overflow: hidden;
        ${cssStr};
        @media only screen and (max-width: ${theme.breakpoints.values.lg -1}px) {
          width: 100%;
          border: none;
          border-radius: unset;
          margin-right: 0;
        }
      `}
    >
      <Box
        className="ggj-scrollbar"
        css={css`
          height: calc(100vh - 165px - 56px);
          overflow-y: auto;
          padding: ${theme.spacing(2)} 0;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            height: 100%;
          }
        `}
      >
        {rooms?.length === 0 && <EmptyMessageBox />}
        {rooms?.map((item, index) => (
          <MessageInfoBox {...item} key={index} isActive={roomId === item.id} />
        ))}
      </Box>
    </Box>
  )
}

export const LeftMenu = memo(Menu)
