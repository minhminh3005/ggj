import { css } from '@emotion/react'
import { PhotoCamera } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { actions, nsIndex } from 'store/indexSlice'

const nsTran = 'components@index'

function UserAvatar() {
  const theme = useTheme()
  const avatar = useAppSelector(state => state[nsIndex].avatar)

  return (
    <Box p={2} css={css`
      border-radius: 50%;
      background: #fff;
      position: relative;
    `}>
      <Avatar
        alt="User Avatar"
        src={avatar}
        css={css`
          width: 68px;
          color: #fff;
          height: 68px;
          object-fit: cover;
          border-radius: 50%;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 90px;
            height: 90px;
          }
        `}
      />
    </Box>
  )
}

function CameraIconBox() {
  const theme = useTheme()
  return (
    <Box p={theme.spacing(2)} css={css`
      border: 1px solid ${theme.palette.divider};
      padding: ${theme.spacing(2)};
      border-radius: 50%;
      height: 38px;
      width: 38px;
      position: absolute;
      right: -4px;
      bottom: -8px;
      background: #fff;
      text-align: center;
      @media (min-width: ${theme.breakpoints.values.md}px) {
        height: ${theme.spacing(6)};
        width: ${theme.spacing(6)};
      }
    `}
    >
      <PhotoCamera css={css`
        color: ${theme.typography.subtitle1.color};
        font-size: 18px;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          font-size: 29px;
        }
      `}
      />
    </Box>
  )
}

function UserInfo() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const nickName = useAppSelector(state => state[nsIndex].data.nickName)
  const id = useAppSelector(state => state[nsIndex].data.id)
  const dispatch = useAppDispatch()

  const openUploadModal = () => {
    dispatch(actions.setIsShowConfirmUploadModal(true))
  }
  return (
    <Stack direction="row" alignItems="flex-start" spacing={theme.spacing(4)} py={{ xs: 3, md: 4, lg: 5 }} >
      {/* avatar box */}
      <Box
        onClick={openUploadModal}
        css={css`
          position: relative;
          cursor: pointer;
          width: 82px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 110px;
          }
      `}>
        <UserAvatar />
        <CameraIconBox />
      </Box>
      {/* nickname and id */}
      <Stack>
        <Typography mt={2} variant="body1" css={css`
          font-weight: bold;
          word-break: break-all;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            font-size: 20px;
          }
        `}>{nickName}</Typography>
        <Typography variant="subtitle2">{t('2', { id: id })}</Typography>
      </Stack>
    </Stack>
  )
}

export default UserInfo
