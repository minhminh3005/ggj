import CloseIcon from '@mui/icons-material/Close'
import {
  Stack,
  Typography,
  IconButton,
  useMediaQuery,
  Dialog,
  Menu,
  Badge,
  Avatar,
} from '@mui/material'
import { css } from '@emotion/react'
import { useTranslation } from 'next-i18next'
import { useTheme } from '@mui/material/styles'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Link from 'next/link'
import { dateFormat, formatDate } from 'common/date'
import { ItemProps } from 'pages/information'
import SkijanIcon from 'components/icons/SkijanIcon'
import { getInformation } from 'store/informationSlice'
import GgjInfinite from 'components/commons/GgjInfinite'
import React, {useEffect, useState, memo} from 'react'
import { InformationParams } from 'store/informationSlice'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import {
  addEventVisibilityChangeListener,
  isDocumentVisible,
  removeEventVisibilityChangeListener
} from '../../pages/mypage/transaction'

export const nsTranInformation = 'common@information'
interface ItemMessageProps {
  indexMessage: number
  valuesMessage: ItemProps
  setShowBellIcon?: React.Dispatch<React.SetStateAction<boolean>>
}
interface ModalMessageProps {
  handleModal: () => void
  type?: 'information' | 'notification'
  informationData: ItemProps[]
  fetchOldInformations: () => void
  setShowBellIcon?: React.Dispatch<React.SetStateAction<boolean>>
}

type InformationFetchType = 'new' | 'old'

let unreadStartAt = 0
let unreadEndAt = 0
let timeoutId: ReturnType<typeof setTimeout>

function clearInformationTimeout() {
  timeoutId && clearTimeout(timeoutId)
}


export const paginationDefault = {
  page: 1,
  limit: 10,
}

export const ItemMessage: React.FC<ItemMessageProps> = ({
  indexMessage,
  valuesMessage,
  setShowBellIcon,
}) => {
  const theme = useTheme()

  const hideRedIconAfterTenSeconds = () => {
    if (!valuesMessage?.isShowRedIcon) {
      return
    }
    setTimeout(() => {
      valuesMessage.isShowRedIcon = false
    }, 10000)
  }

  const setPublishedTimeToLocalStorage = () => {
    if (!valuesMessage?.isShowRedIcon) {
      return
    }

    setTimeout(() => {
      const publishedStartAt = Number(localStorage.getItem('publishedStartAt'))
      const publishedEndAt = Number(localStorage.getItem('publishedEndAt'))

      if (!publishedStartAt || publishedStartAt > valuesMessage.publishedAt) {
        localStorage.setItem('publishedStartAt', valuesMessage.publishedAt + '')
      }
      if (!publishedEndAt || publishedEndAt < valuesMessage.publishedAt) {
        localStorage.setItem('publishedEndAt', valuesMessage.publishedAt + '')
      }
    }, 500)
  }

  useEffect(() => {
    hideRedIconAfterTenSeconds()
    setPublishedTimeToLocalStorage()

    if (valuesMessage.publishedAt == unreadStartAt) {
      unreadStartAt = 0
    }
    if (valuesMessage.publishedAt == unreadEndAt) {
      unreadEndAt = 0
    }
    setShowBellIcon && setShowBellIcon(!!(unreadStartAt || unreadEndAt))
    return () => {
      valuesMessage.isShowRedIcon = false
    }
  }, [])

  return (
    <Stack
      key={indexMessage}
      css={css`
        padding: 17px 16px 16px 16px;
        width: 100%;
        cursor: pointer;
        &:hover {
          background-color: #fafafa;
        }
        &:last-child {
          border-bottom: 1px solid #ededed
        }`}
      justifyContent="flex-start"
      alignItems="flex-start"
      direction="row"
    >
      <Stack position="relative">
        <span
          hidden={!valuesMessage?.isShowRedIcon}
          css={css`
            height: 8px;
            width: 8px;
            border-radius: 50%;
            background-color: ${theme.palette.ruby.main};
            position: absolute;
            top: calc(50% - 4px);
            left: -12px;
          `}
        />

        {valuesMessage?.imgUserAvatarUrl ? (
          <Avatar
            sx={{ width: 40, height: 40 }}
            alt=""
            src={valuesMessage?.imgUserAvatarUrl}
          />
        ) : (
          <SkijanIcon
            bg={theme.palette.primary.main}
            css={css`
              color: white;
              border-radius: 50%;
              width: 40px;
              height: 40px;
              position: relative;
            `}
          />
        )}
      </Stack>

      <div
        css={css`
          margin-left: 16px;
        `}
      >
        <Typography
          css={css`
              overflow: hidden;
              word-break: break-all;
              line-height: 24px;
            `}
          variant="subtitle1"
        >
          {valuesMessage?.title || ''}
        </Typography>
        <Typography variant="caption">
          {formatDate(valuesMessage?.publishedAt || 0, dateFormat)}
        </Typography>
      </div>
    </Stack>
  )
}

const ModalMessage: React.FC<ModalMessageProps> = ({
  handleModal,
  type,
  fetchOldInformations,
  informationData,
  setShowBellIcon,
}) => {
  const { t } = useTranslation(nsTranInformation)
  const theme = useTheme()

  return (
    <Stack
      css={css`
        width: 100%;
        margin: 0 auto;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 700px;
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          max-width: 460px;
          margin: unset;
        }
      `}
      justifyContent="flex-start"
      alignItems="center"
      direction="column"
    >
      <Stack
        css={css`
          max-width: 100%;
          position: fixed;
          z-index: 10;
          height: 56px;
          text-align: center;
          width: 100%;
          background-color: #ffffff;
          border-bottom: 2px solid #ededed;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            position: relative;
            max-width: unset;
            z-index: unset;
          }
        `}
        justifyContent="center"
        alignItems="center"
        direction="row"
      >
        <a css={css`text-decoration: none;`} target='_blank'>
          <Typography
            css={css`
              padding-bottom: 0;
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              padding-bottom: 0.25rem;
              }`}
            variant="subtitle1">
            {t('2')}
          </Typography>
        </a>
        <CloseIcon
          onClick={handleModal}
          css={css`
            margin: 17.5px 20px 0 0;
            cursor: pointer;
            font-size: 1.35rem;
            color: ${theme.palette.smoke.dark};
            position: absolute;
            right: 0;
            top: 0;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: 15px 20px 0 0;
            }
          `}
        />
      </Stack>
      <div
        css={css`
          margin: 56px auto 0 auto;
          width: 100%;
          overflow-y: auto;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: unset;
            margin: unset;
          }
        `}
      >
        <GgjInfinite
          hasMore={true}
          next={fetchOldInformations}
          loader={null}
          dataLength={informationData?.length}
          scrollableTarget="scrollableBlock"
        >
          {informationData?.length > 0 &&
            informationData?.map((valuesMessage, indexMessage) => {
              return (
                <Stack key={valuesMessage?.id || -1}>
                  <Link
                    href={`/${
                      type === 'notification' ? 'notification' : 'information'
                    }/${valuesMessage?.id || -1}`}
                  >
                    <a
                      css={css`
                        text-decoration: none;
                        cursor: pointer;
                        width: 100%;
                      `}
                    >
                      <GgjLazyRenderComp
                        minHeight={82}
                        componentProps={{
                          indexMessage,
                          valuesMessage,
                          setShowBellIcon,
                        }}
                        component={ItemMessage}
                      ></GgjLazyRenderComp>
                    </a>
                  </Link>
                </Stack>
              )
            })}
        </GgjInfinite>
      </div>
    </Stack>
  )
}

export const BellIconComponent = memo( function BellIconComponent(){
  const theme = useTheme()
  const isMobileTablet = useMediaQuery(
    `(max-width:${theme.breakpoints.values.lg - 1}px)`
  )
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [informationData, setInformationData] = useState<ItemProps[]>([])
  const [showBellIcon, setShowBellIcon] = useState<boolean>(false)

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  function fetchOldInformations() {
    clearInformationTimeout()

    fetchInformations({
      params: {
        newPublishedAt: null,
        oldPublishedAt:
          informationData[informationData?.length - 1]?.publishedAt,
      },
      fetchType: 'old',
    })
  }

  const fetchInformations = (() => {
    let newPublishedAt: number
    return async ({
      params,
      fetchType,
    }: {
      params?: InformationParams
      fetchType?: InformationFetchType
    }) => {
      const publishedStartAt = Number(localStorage.getItem('publishedStartAt'))
      const publishedEndAt = Number(localStorage.getItem('publishedEndAt'))
      try {
        const { data, error } = await getInformation({
          oldPublishedAt: params?.oldPublishedAt || null,
          newPublishedAt: newPublishedAt || informationData[0]?.publishedAt,
          publishedStartAt,
          publishedEndAt,
          ...params,
        })
        if (error) {
          return
        }

        for (
          let i = 0, j = data.informations.length - 1;
          i < data.informations.length;
          i++, j--
        ) {
          data.informations[i].isShowRedIcon &&
            (unreadEndAt =
              unreadEndAt < data.informations[i].publishedAt
                ? data.informations[i].publishedAt
                : unreadEndAt)
          data.informations[j].isShowRedIcon &&
            !unreadStartAt &&
            (unreadStartAt = data.informations[j].publishedAt)
          data.informations[j].isShowRedIcon &&
            (unreadStartAt =
              unreadStartAt > data.informations[j].publishedAt
                ? data.informations[j].publishedAt
                : unreadStartAt)
        }
        setShowBellIcon(Boolean(unreadStartAt || unreadEndAt))
        setInformationData((prevInformations) =>
          fetchType === 'old'
            ? prevInformations?.concat(data?.informations)
            : data?.informations?.concat(prevInformations)
        )

        fetchType === 'old' && fetchInterval()

        if (
          (data?.informations?.length && fetchType === 'new') ||
          (!informationData?.length && data?.informations?.length)
        ) {
          newPublishedAt = data?.informations[0]?.publishedAt
        }
      } catch (e) {
        console.log('error: ', e)
      }
    }
  })()

  function fetchInterval() {
    clearInformationTimeout()
    timeoutId = setTimeout(() => {
      fetchInformations({
        fetchType: 'new',
      })
      fetchInterval()
    }, 60e3)
  }

  useEffect(() => {
    fetchInformations({})
    fetchInterval()

    const handler = function() {
      isDocumentVisible()
        ? fetchInterval()
        : clearInformationTimeout()
    }
    addEventVisibilityChangeListener(handler)

    return () => {
      clearInformationTimeout()
      removeEventVisibilityChangeListener(handler)
    }
  }, [])

  return (
    <>
      <IconButton
        onClick={handleOpen}
        color="inherit"
        size="large"
        css={css`
          color: ${theme.palette.smoke.dark};
          flex: 0 0 auto;
        `}
      >
        <Badge
          invisible={!showBellIcon}
          color="primary"
          variant="dot"
          sx={{
            '& .MuiBadge-dot': {
              backgroundColor: theme.palette.ruby.main,
              borderRadius: '50%',
            },
          }}
        >
          <NotificationsNoneIcon color="inherit" />
        </Badge>
      </IconButton>

      {!!anchorEl &&
        (isMobileTablet ? (
          <Dialog
            PaperProps={{
              id: 'scrollableBlock',
            }}
            fullScreen
            open={!!anchorEl}
            onClose={handleClose}
          >
            <ModalMessage
              informationData={informationData}
              type="information"
              handleModal={handleClose}
              fetchOldInformations={fetchOldInformations}
              setShowBellIcon={setShowBellIcon}
            />
          </Dialog>
        ) : (
          <Menu
            anchorEl={anchorEl}
            open={!!anchorEl}
            disableAutoFocusItem
            PaperProps={{
              style: {
                width: '100%',
                maxWidth: '460px',
                overflowY: 'scroll',
                height: '80vh',
              },
              id: 'scrollableBlock',
              className: 'ggj-scrollbar',
            }}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <ModalMessage
              informationData={informationData}
              type="information"
              handleModal={handleClose}
              fetchOldInformations={fetchOldInformations}
              setShowBellIcon={setShowBellIcon}
            />
          </Menu>
        ))}
    </>
  )
})
