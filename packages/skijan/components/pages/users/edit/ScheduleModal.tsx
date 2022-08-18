import {useTheme} from '@mui/material/styles'
import {Dialog, Stack, Typography, useMediaQuery} from '@mui/material'
import {css} from '@emotion/react'
import Button from '@mui/material/Button'
import {ChevronLeft} from '@mui/icons-material'
import UserAvatar from './UserAvatar'
import React from 'react'
import {IUserSelfIntro, ns} from 'store/usersSlice'
import {useAppSelector} from 'store/hooks'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'
import {HEADER_FORM} from './const'

function ScheduleModal({open, handleClose,}: {
  open: boolean
  handleClose: () => void
}) {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const userSelfIntroduce: IUserSelfIntro = useAppSelector((state) => state[ns]?.userSelfIntroduce)
  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      css={css`
        .MuiPaper-root {
          width: 100%;
          display: flex;
          max-width: 640px;
          min-height: 666px;
          justify-content: start;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            justify-content: space-between;
          }
        }
      `}
    >
      {fullScreen && (
        <Button
          onClick={handleClose}
          css={css`
            display: flex;
            align-items: center;
            background: white;
            min-height: ${HEADER_FORM};
            height: ${HEADER_FORM};
            border-radius: 0;
            width: 100%;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              background: ${theme.palette.smoke.light};
            }
          `}
        >
          <ChevronLeft
            css={css`
              color: ${theme.palette.jade.dark};
            `}
          />
          <Stack
            direction="row"
            justifyContent="center"
            css={css`
              width: calc(100% - 50px);
            `}
          >
            <Typography
              variant="h6"
              css={css`
                color: ${theme.palette.jade.dark};
                @media (min-width: ${theme.breakpoints.values.lg}px) {
                  color: ${theme.palette.smoke.dark};
                }
              `}
            >
              {t('32')}
            </Typography>
          </Stack>
        </Button>
      )}
      <Stack
        direction="column"
        css={css`
          max-width: 640px;
          margin: 0 auto;
          padding: 0 34px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            margin-top: 67px;
            padding: 0;
          }
        `}
      >
        <UserAvatar/>
        <Typography
          variant="body2"
          css={css`
            color: ${theme.palette.jade.light};
            word-break: break-word;
            margin-top: 27px;
            line-height: 24px;
            white-space: pre-wrap;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              max-width: 400px;
            }
          `}
        >
          {userSelfIntroduce.schedule}
        </Typography>
      </Stack>
      {!fullScreen && (
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
            margin-right: 40px;
            margin-bottom: 29px;
          `}
        >
          <Button onClick={handleClose}>{t('33')}</Button>
        </div>
      )}
    </Dialog>
  )
}

export default React.memo(ScheduleModal)
