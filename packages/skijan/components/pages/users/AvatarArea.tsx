import { css } from '@emotion/react'
import SwitchLeftOutlinedIcon from '@mui/icons-material/SwitchLeftOutlined'
import Button from '@mui/material/Button'
import {IconButton, Link, Rating, Stack, Typography} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import ButtonUnstyled from '@mui/base/ButtonUnstyled'
import PhotoCameraOutlinedIcon from '@mui/icons-material/PhotoCameraOutlined'

// store import
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {actions, DELETE_BANNER, IUserInfo, IUserSelfIntro, ns} from 'store/usersSlice'
import { useState } from 'react'
import TrashIcon from './icons/TrashIcon'
import ScheduleModal from './edit/ScheduleModal'
import UploadAvatar from './edit/UploadAvatar'
import UploadBanner from './edit/UploadBanner'
import UserCheck from 'components/icons/UserCheck'
import { Lock } from '@mui/icons-material'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../common/constant'
import {EDIT, SCHEDULE, timeSince, VIEW} from './edit/const'

// TOGGLE EDIT VIEW MODE
const ButtonToggleMode = () => {
  const mode = useAppSelector((state) => state[ns]?.mode)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const mainColor =
    mode === EDIT ? theme.palette.primary.main : theme.palette.secondary.main
  const {t} = useTranslation(nsUserProfile)
  const onToggleMode = () => {
    dispatch(actions.setMode(mode === EDIT ? VIEW : EDIT))
  }

  return (
    <Button
      variant="contained"
      css={css`
        height: 37px;
        color: white;
        background: ${mainColor};
        font-weight: 100;
        &:hover {
          background: ${mainColor};
          color: white;
        }
      `}
      onClick={onToggleMode}
    >
      <SwitchLeftOutlinedIcon
        css={css`
          background: white;
          color: ${mainColor};
          border-radius: 50%;
          width: 20px;
          height: 20px;
        `}
      />
      <Typography
        variant="body2"
        css={css`
          color: white;
          padding-left: 12px;
          line-height: 15px;
          letter-spacing: 1.25px;
          font-weight: 300;
        `}
      >
        {/* TODO: An - Refactor after add translate sheet */}
        {mode === EDIT ? t('34') : t('35')}
      </Typography>
    </Button>
  )
}

// OWNER AREA
const OwnerArea = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const isOwner = useAppSelector((state) => state[ns]?.isOwner || false)
  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)
  if (isOwner)
    return (
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          height: 60px;
        `}
      >
        <ButtonToggleMode />
        {mode === EDIT && (
          <Link href={'/mypage/member'} css={css`
            text-decoration-color: ${theme.palette.jade.light};
            &:hover {
              text-decoration-color: ${theme.palette.jade.light};
            }
          `}>
            <Typography variant="caption">{t('36')}</Typography>
          </Link>
        )}
      </div>
    )
  return <div />
}

// BUTTON SHOW SCHEDULE EDIT
const ButtonSchedule = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)
  const colorTxt =
    mode === EDIT ? theme.palette.secondary.main : theme.palette.primary.main
  const {t} = useTranslation(nsUserProfile)

  const openShedule = () => {
    if (mode === EDIT) dispatch(actions.setSettingMode(SCHEDULE))
    else setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <div
        css={css`
          display: flex;
          justify-content: center;
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            justify-content: flex-end;
          }
        `}
      >
        <ButtonUnstyled
          onClick={openShedule}
          variant="body2"
          component="span"
          css={css`
            padding: 0;
            display: flex;
            width: fit-content;
            cursor: pointer;
            justify-content: flex-end;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              justify-content: center;
            }
          `}
        >
          <Typography
            variant="body2"
            css={css`
              color: ${colorTxt};
              text-decoration: underline;
            `}
          >
            {mode == EDIT ? t('37'): t('67')}
          </Typography>
        </ButtonUnstyled>
      </div>
      <ScheduleModal open={open} handleClose={handleClose} />
    </div>
  )
}

// Confirm And Confidentiality Retention Contract NDA Item
const InfoItem = () => {
  const theme = useTheme()

  return (
    <div
      css={css`
        background: #f6f6f6;
        border: solid 1px #e5e5e5;
        width: 27px;
        height: 22px;
        border-radius: 3px;
        display: flex;
        justify-content: center;
      `}
    >
      <Typography
        variant="body2"
        css={css`
          color: ${theme.palette.jade.light};
        `}
      >
        -
      </Typography>
    </div>
  )
}

// WALLPAPER
const WallpaperArea = () => {
  // TODO: An - polish css for buttons upload & delete screen 320px
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)
  const banner = useAppSelector(state => state[ns]?.banner || '')
  const {t} = useTranslation(nsUserProfile)

  const openUploadModal = () => {
    dispatch(actions.setShowUploadBannerModal(true))
  }
  const openConfirmModal = () => {
    dispatch(
      actions.setShowConfirmDialog({
        title: t('6'),
        description: t('7'),
        closeText: t('8'),
        okText: t('9'),
        mode: DELETE_BANNER
      })
    )
  }
  return (
    <div
      css={css`
        position: relative;
        overflow: hidden;
        padding-top: calc(100% / (3 / 1));
        background: ${theme.palette.canvas.light};
      `}
    >
      <img src={banner} alt="banner"
        css={css`
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: cover;
        object-position: center;
      `}/>
      {mode === EDIT && (
        <>
          <IconButton
            onClick={openConfirmModal}
            color="primary"
            aria-label="upload banner"
            component="span"
            css={css`
              height: 30px;
              width: 30px;
              background: ${theme.palette.canvas.light};
              position: absolute;
              text-align: center;
              top: 18px;
              right: 21px;
              opacity: 0.9;
              cursor: pointer;
              z-index: 1;
              :hover {
                background: ${theme.palette.canvas.light};
              }
            `}
          >
            <TrashIcon
              css={css`
                width: 14px;
                height: 15px;
                color: ${theme.palette.ruby.main};
              `}
            />
          </IconButton>
          <div
            css={css`
              position: absolute;
              left: 0;
              right: 0;
              top: 0;
              bottom: 0;
              padding-top: 19px;
              display: flex;
              justify-content: center;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                padding-top: 0;
                align-items: center;
              }
            `}
          >
            <Button
              onClick={openUploadModal}
              css={css`
                background: #ffffff;
                opacity: 0.8;
                border-radius: 18px;
                width: 196px;
                height: 36px;
                @media (min-width: ${theme.breakpoints.values.lg}px) {
                  width: 244px;
                  height: 44px;
                }
                :hover {
                  background: #ffffff;
                }
              `}
            >
              <PhotoCameraOutlinedIcon
                css={css`
                  color: #999999;
                `}
              />
              <Typography
                css={css`
                  color: #999999;
                  font-weight: bold;
                  margin-left: 10px;
                  font-size: 13px;
                  @media (min-width: ${theme.breakpoints.values.lg}px) {
                    font-size: 16px;
                  }
                `}
              >
                {t('38')}
              </Typography>
            </Button>
          </div>
        </>
      )}
    </div>
  )
}




// INFO AND AVATAR
const UserInfoAndAvatar = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)
  const data: IUserInfo = useAppSelector((state) => state[ns]?.user)
  const selfIntro: IUserSelfIntro = useAppSelector((state) => state[ns]?.userSelfIntroduce)
  const avatar = useAppSelector(state => state[ns]?.avatar || '')
  const {t} = useTranslation(nsUserProfile)

  const openUploadModal = () => {
    dispatch(actions.setShowUploadAvatarModal(true))
  }

  const age = selfIntro.isDisplayAge == 1 && data.birthday ? data.birthday + t('68') : ''
  const sex = selfIntro.isDisplayGender == 1 ? data.sexType == 2 ? t('40') : data.sexType == 1 ? t('39') : t('70') : t('70')
  const corporation = data.isCorporation == 1 ? t('64') : t('42')
  const per = data.prefectures ? data.prefectures : ''
  const slash1 = ((age || sex) && corporation) ? '・' : ''
  const slash2 = (per && (age || sex || corporation)) ? '・' : ''
  const userInfo = age + sex + slash1 + corporation + slash2 + per

  return (
    <Stack
      flexDirection={{ xs: 'column', lg: 'row' }}
      alignItems={{ xs: 'center', lg: 'unset' }}
      css={css`
        width: 100%;
        min-height: 240px;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          padding-bottom: 73px;
        }
      `}
    >
      {/* LEFT */}
      <Stack
        css={css`
          flex: 1;
          margin-top: ${theme.spacing(4)};
          width: auto;
          text-align: right;
          @media (max-width: ${theme.breakpoints.values.lg}px) {
            width: 100%;
            text-align: center;
          }
        `}
        direction="column"
        spacing={2}
      >
        <Typography
          css={css`
            font-size: 20px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              font-size: 30px;
            }
          `}
          component="h2"
        >
          {data.nickName}
        </Typography>
        <Typography variant="body2">{userInfo}</Typography>
        <Typography
          variant="body2"
          css={css`
            color: ${theme.palette.jade.light};
          `}
        >
          {t('63')} {timeSince(data.lastLoginAt)}
        </Typography>
        <ButtonSchedule />
      </Stack>
      {/* AVATAR */}
      <div
        css={css`
          position: relative;
          order: -1;
          height: 100%;
          background: #1b6d85;
          margin-left: 0;
          margin-right: 0;
          width: 30%;
          margin-bottom: 10%;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 24%;
          }
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            order: unset;
            margin-left: 5%;
            margin-right: 5%;
          }
        `}
      >
        <div
          css={css`
            position: absolute;
            top: -50%;
            transform: translateY(-50%);
            left: 0;
            right: 0;
          `}
        >
          <div css={css`
            position: relative;
            overflow: hidden;
            //border: solid 1px #ffffff;
            border-radius: 50%;
            padding-top: calc(100% / (1 / 1));
            box-shadow: ${theme.shadows[1]};
          `}>
            <img src={avatar} alt="avatar" css={css`
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              object-fit: cover;
              object-position: center;
            `}/>
          </div>
          {mode === EDIT && (
            <div
              css={css`
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
              `}
            >
              <IconButton
                color="primary"
                aria-label="upload avatar"
                component="span"
                css={css`
                  height: 48px;
                  width: 48px;
                  padding: 8px;
                  border: 1px solid ${theme.palette.smoke.light};
                  position: absolute;
                  background: #c2c3bc;
                  opacity: 0.9;
                  text-align: center;
                  left: calc(30% - 48px);
                  bottom: 0;
                  @media (min-width: ${theme.breakpoints.values.md}px) {
                    left: calc(24% - 48px);
                  }
                  :hover {
                    background: #999999;
                  }
                `}
                onClick={openUploadModal}
              >
                <PhotoCameraOutlinedIcon
                  css={css`
                    color: #ffffff;
                    font-size: 29px;
                  `}
                />
              </IconButton>
            </div>
          )}
        </div>
      </div>
      {/* RIGHT */}
      <Stack
        direction="column"
        spacing={2}
        css={css`
          flex: 1;
          text-align: center;
          margin-top: ${theme.spacing(5)};
          width: auto;
          margin-bottom: 0;
          @media (max-width: ${theme.breakpoints.values.lg}px) {
            margin-bottom: ${theme.spacing(5)};
            width: 100%;
          }
        `}
      >
        <Stack direction="row" spacing="18px">
          <Typography
            variant="body2"
            css={css`
              color: ${theme.palette.jade.light};
            `}
          >
            {t('43')}
          </Typography>
          <Typography
            variant="body2"
            css={css`
              color: ${theme.palette.jade.light};
            `}
          >
            {data.saleCount == 0 ? '-' : data.saleCount}
          </Typography>
        </Stack>
        <Stack direction="row" spacing="12px">
          <Typography
            variant="body2"
            css={css`
              color: ${theme.palette.jade.light};
            `}
          >
            評価
          </Typography>
          <Rating
            readOnly
            precision={0.5}
            name="simple-controlled"
            size="small"
            value={data.reviewStar}
          />
        </Stack>
        <Stack
          direction="row"
          css={css`
            flex-wrap: wrap;
            gap: 18px;
            @media (max-width: ${theme.breakpoints.values.lg}px) {
              gap: 16px;
            }
          `}
        >
          <Stack direction="row" spacing="14px" alignItems="center">
            <Typography
              variant="body2"
              css={css`
                color: ${theme.palette.jade.light};
              `}
            >
              {t('44')}
            </Typography>
            {data.isIdentity == 1 ? <UserCheck css={css`fill: ${theme.palette.primary.main}`} /> : <InfoItem />}
          </Stack>
          <Stack direction="row" spacing="14px" alignItems="center">
            <Typography
              variant="body2"
              css={css`
                color: ${theme.palette.jade.light};
              `}
            >
              {t('45')}
            </Typography>
            {data.isNda == 1 ? (
              <Lock
                css={css`
                  width: 27px;
                  height: 27px;
                  color: ${theme.palette.primary.main};
                `}
              />
            ) : (
              <InfoItem />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  )
}

// MAIN
function AvatarArea() {
  return (
    <>
      <OwnerArea />
      <WallpaperArea />
      <UserInfoAndAvatar />
      <UploadAvatar />
      <UploadBanner />
    </>
  )
}

export default AvatarArea
