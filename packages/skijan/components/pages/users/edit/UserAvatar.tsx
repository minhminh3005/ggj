import React from 'react'
import { css } from '@emotion/react'
import { Avatar, Stack, Typography } from '@mui/material'
import { IUserInfo, ns } from 'store/usersSlice'
import { useAppSelector } from 'store/hooks'

function UserAvatar() {
  const data: IUserInfo = useAppSelector((state) => state[ns]?.user)
  const avatar = useAppSelector(state => state[ns]?.avatar)

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="21px"
      justifyContent="center"
    >
      <Avatar
        alt=""
        css={css`
          height: 93px;
          width: 93px;
        `}
        src={avatar}
      />
      <Typography variant="h6">{data.nickName}</Typography>
    </Stack>
  )
}

export default React.memo(UserAvatar)
