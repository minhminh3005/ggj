import {css} from '@emotion/react'
import {Avatar, Divider, Stack, Typography, useTheme} from '@mui/material'
import {memo, ReactNode, useCallback, useEffect} from 'react'
import {formatDate} from 'common/date'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions as actionImageViewer} from 'components/commons/GgjChatImageViewer'
import FileItem from './FileItem'
import {Block, FileDownload} from '@mui/icons-material'
import {getOldMessageOnScrollTop, markReadMessage, ns} from 'store/transactionSlice'
import {
  CHAT_COLOR, checkIsValidChatStatus,
  DATE_FORMAT,
  FILE,
  IFileInfo,
  IMAGE,
  IMessages,
  PanelId,
  SKILL_SALES_STATUS,
  TEXT,
  TransactionType,
  nsTransaction
} from './const'
import GgjLazyRenderComp from '../../../commons/GgjLazyRenderComp'
import {useTranslation} from 'next-i18next'

// Interface, type, const
const BUBBLE_MODE_SEND = 'send'
const BUBBLE_MODE_RECEIVE = 'receive'

// Child Component
const NotAccessibleData = ({colorIcon, colorText}:{
  colorIcon: string,
  colorText: string
}) => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  return <Stack direction='row' alignItems={'center'}>
    <div css={css`
      display: flex;
      background-color: ${theme.palette.smoke.light};
      min-width: 40px;
      height: 40px;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      margin-right: ${theme.spacing(2)};
    `}>
      <Block css={css`color: ${colorIcon}`}/>
    </div>
    <Typography css={css`color: ${colorText}`}>
      {t('51')}
    </Typography>
  </Stack>
}
const ImageDownLoad = ({type, data}: {
  type: 'send' | 'receive',
  data: IFileInfo,
}) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus || SKILL_SALES_STATUS.PROGRESS_STATUS)
  const handleClickImages = useCallback(() => {
    dispatch(actionImageViewer.setViewingImages([{
      name: data.fileName,
      url: data.url
    }]))
  }, [])
  const itemId = `image-${data.attachmentId}`

  let width, height
  const availableWidth = document.body.clientWidth - 140
  const availableHeight = 200
  if (Number(data.sizeImage?.width) < availableWidth && Number(data.sizeImage?.height) < availableHeight) {
    width = data.sizeImage?.width
    height = data.sizeImage?.height
  } else if (Number(data.sizeImage?.width) > availableWidth && Number(data.sizeImage?.height) > availableHeight) {
    if ((Number(data.sizeImage?.width) - availableWidth) > (Number(data.sizeImage?.height) - availableHeight)) {
      width = availableWidth
      height = Number(data.sizeImage?.height) * width / Number(data.sizeImage?.width)
    } else {
      height = availableHeight
      width = Number(data.sizeImage?.width) * height / Number(data.sizeImage?.height)
    }
  } else {
    if (Number(data.sizeImage?.width) > availableWidth) {
      width = availableWidth
      height = Number(data.sizeImage?.height) * width / Number(data.sizeImage?.width)
    }
    if (Number(data.sizeImage?.height) > availableHeight) {
      height = availableHeight
      width = Number(data.sizeImage?.width) * height / Number(data.sizeImage?.height)
    }
  }
  const removeInitCss = () => {
    const div = document.getElementById(itemId)
    if (div) {
      div.style.backgroundColor = 'transparent'
      div.style.width = 'auto'
      div.style.height = 'auto'
      const fChild = div.firstChild as HTMLElement
      fChild.className = ''
    }
  }
  return <div id={itemId}
    css={css`
      position: relative;
      line-height: 1em;
      background-color: #c4c4c466;
      border-radius: ${type == BUBBLE_MODE_RECEIVE ?
    '0 15px 15px 15px' : '15px 0 15px 15px'};
      overflow: hidden;
      width: ${width}px;
      height: ${height && (Number(height) + 3)}px;

      :hover a {
        visibility: visible;
      }
    `}
  >
    <GgjLazyRenderComp
      component={'img'}
      minHeight={height? (Number(height) + 3): 200}
      componentProps={{
        alt: 'TransactionUserImage',
        src: data.url,
        onClick: handleClickImages,
        onLoad: removeInitCss,
        css: css`
          max-height: 200px;
          max-width: 100%;
          border-radius: ${type == BUBBLE_MODE_RECEIVE ? '0 15px 15px 15px' : '15px 0 15px 15px'};
          overflow: hidden;
          pointer-events: ${checkIsValidChatStatus(salesStatus) ? 'unset' : 'none'};
          cursor: ${checkIsValidChatStatus(salesStatus) ? 'zoom-in' : 'unset'};
        `
      }}
    />
    {
      checkIsValidChatStatus(salesStatus) &&
      <a
        href={data.url} download={data.fileName}
        css={css`
          position: absolute;
          visibility: hidden;
          right: ${type == BUBBLE_MODE_RECEIVE && theme.spacing(2)};
          left: ${type == BUBBLE_MODE_SEND && theme.spacing(2)};
          top: ${theme.spacing(2)};
          background: #00000066;
          padding: ${theme.spacing(2)} ${theme.spacing(1)} 0;
          border-radius: ${theme.spacing(2)};
          cursor: pointer;
        `}
      >
        <FileDownload css={css`color: ${theme.palette.common.white};`}/>
      </a>
    }
  </div>
}
const BubbleTimeWrapper = ({wrap, unwrap, time, type}: {
  wrap?: ReactNode | string,
  unwrap?: ReactNode | string,
  time: number,
  type: 'send' | 'receive'
}) => {
  const theme = useTheme()
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  return (
    <Stack
      spacing={1}
      direction={type == BUBBLE_MODE_RECEIVE ? 'row' : 'row-reverse'}
      css={css`
        max-width: 100%;
        width: 100%;
        ${type == 'send' && 'align-self: flex-end;'}
      `}
    >
      {wrap &&
        <div css={css`
          color: ${type == BUBBLE_MODE_RECEIVE ? 'unset' : theme.palette.common.white};
          padding: ${theme.spacing(2)} ${theme.spacing(3)};
          border: 1px solid ${theme.palette.smoke.light};
          background-color: ${type == BUBBLE_MODE_RECEIVE ? CHAT_COLOR[mode].secondary.bg : CHAT_COLOR[mode].primary.bg};
          border-radius: ${type == BUBBLE_MODE_RECEIVE ? '0 15px 15px 15px' : '15px 0 15px 15px'};
          word-break: break-all;
          white-space: pre-wrap;
          max-width: 100%;
        `}>
          {wrap}
        </div>
      }
      {unwrap}
      <Typography variant="caption" css={css`align-self: flex-end;
        width: 36px;`}>
        {formatDate(time, DATE_FORMAT.TIME)}
      </Typography>
    </Stack>
  )
}
const BubbleReceive = memo(({data, showDate}: { data: IMessages, showDate?: boolean }) => {
  const theme = useTheme()
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus)
  const isCancel = Boolean(salesStatus == SKILL_SALES_STATUS.BUYER_CANCEL || salesStatus == SKILL_SALES_STATUS.SELLER_CANCEL)
  const userId = useAppSelector(state => state[ns]?.CHATINFO_info[`${mode == TransactionType.Buyer? 'seller' : 'buyer'}Id`])
  return <>
    <Stack direction="row" spacing={2}>
      <Avatar
        src={`/img/v3/skijan/users/avatar/${userId || -1}?noDefaultImg=0`}
        css={css`
          width: 40px;
          height: 40px;
          border-radius: 20px;
          flex: none;
        `}
      />
      <Stack spacing={1} css={css`
        max-width: calc(100% - ${theme.spacing(6)});
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          max-width: 50%;
        }`}>
        <Typography
          variant="caption">{mode == TransactionType.Buyer ? data.nickNameSeller : data.nickNameBuyer}</Typography>
        {data.contentType == TEXT
          ? <BubbleTimeWrapper wrap={data.content} time={data.sentAt} type={BUBBLE_MODE_RECEIVE}/>
          : isCancel ? data.attachment.map((item) => {
            return <BubbleTimeWrapper
              key={`messFile${item.attachmentId}`}
              wrap={<NotAccessibleData
                colorIcon={CHAT_COLOR[mode].secondary.icon}
                colorText={CHAT_COLOR[mode].secondary.text}
              />}
              time={data.sentAt}
              type={BUBBLE_MODE_RECEIVE}
            />
          })
            : data.contentType == FILE && data.attachment.map((item) => {
              return (
                <BubbleTimeWrapper
                  key={`messFile${item.attachmentId}`}
                  unwrap={item.fileType == IMAGE &&
                  <ImageDownLoad
                    type={BUBBLE_MODE_RECEIVE}
                    data={item}
                  />
                  }
                  wrap={item.fileType == FILE &&
                  <FileItem
                    url={item.url}
                    ext={item.ext}
                    name={item.fileName}
                    colorBgIcon={CHAT_COLOR[mode].secondary.iconBg}
                    colorIcon={CHAT_COLOR[mode].secondary.icon}
                    colorText={CHAT_COLOR[mode].secondary.text}
                  />}
                  time={data.sentAt}
                  type={BUBBLE_MODE_RECEIVE}
                />
              )
            })}
      </Stack>
    </Stack>
    {showDate && <DateDivider time={data.sentAt}/>}
  </>
})
BubbleReceive.displayName = 'BubbleReceive'
const BubbleSend = memo(({data, showDate}: { data: IMessages, showDate?: boolean }) => {
  const theme = useTheme()
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus)
  const isCancel = Boolean(salesStatus == SKILL_SALES_STATUS.BUYER_CANCEL || salesStatus == SKILL_SALES_STATUS.SELLER_CANCEL)
  return <>
    <div>
      <Stack spacing={1} css={css`
      margin-left: auto;
      max-width: calc(100% - ${theme.spacing(6)});
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        max-width: 50%;
      }`}>
        {data.contentType == TEXT
          ? <BubbleTimeWrapper wrap={data.content} time={data.sentAt} type={BUBBLE_MODE_SEND}/>
          : isCancel ? data.attachment.map((item) => {
            return <BubbleTimeWrapper
              key={`messFile${item.attachmentId}`}
              wrap={<NotAccessibleData
                colorIcon={CHAT_COLOR[mode].primary.icon}
                colorText={CHAT_COLOR[mode].primary.text}
              />}
              time={data.sentAt}
              type={BUBBLE_MODE_SEND}
            />
          })
            : data.contentType == FILE && data.attachment.map((item) => {
              return (
                <BubbleTimeWrapper
                  key={`messFile${item.attachmentId}`}
                  unwrap={item.fileType == IMAGE &&
                  <ImageDownLoad
                    type={BUBBLE_MODE_SEND}
                    data={item}
                  />
                  }
                  wrap={item.fileType == FILE &&
                  <FileItem
                    url={item.url}
                    ext={item.ext}
                    name={item.fileName}
                    colorBgIcon={CHAT_COLOR[mode].primary.iconBg}
                    colorIcon={CHAT_COLOR[mode].primary.icon}
                    colorText={CHAT_COLOR[mode].primary.text}
                  />}
                  time={data.sentAt}
                  type={BUBBLE_MODE_SEND}
                />
              )
            })}
      </Stack>
    </div>
    {showDate && <DateDivider time={data.sentAt}/>}
  </>
})
BubbleSend.displayName = 'BubbleSend'

const BubbleSystem = memo(({data, showDate}: { data: IMessages, showDate?: boolean }) => {
  const theme = useTheme()
  return (
    <>
      <div>
        <Stack css={css`
          align-items: end;
          margin: auto;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            max-width: 80%;
          }
        `}>
          <Typography css={css`
          flex: 1;
          background-color: ${theme.palette.jade.dark};
          color: ${theme.palette.common.white};
          padding: ${theme.spacing(2)} ${theme.spacing(3)};
          text-align: center;
          width: 100%;
          border-radius: 15px;
          word-break: break-all;
        `}>
            {data.content}
          </Typography>
          <Typography variant="caption">
            {formatDate(data.sentAt, DATE_FORMAT.TIME)}
          </Typography>
        </Stack>
      </div>
      {showDate && <DateDivider time={data.sentAt}/>}
    </>
  )
})
BubbleSystem.displayName = 'BubbleSystem'

const DateDivider = memo(({time}: { time: number }) => {
  const theme = useTheme()
  return (
    <Stack direction="row" css={css`
      justify-content: center;
      align-items: center;
      width: 100%;
    `}>
      <Divider css={css`flex: 1;`}/>
      <Typography variant="caption" color="smoke.dark" css={css`margin: ${theme.spacing(3)}`}>
        {formatDate(time, DATE_FORMAT.DAY)}
      </Typography>
      <Divider css={css`flex: 1;`}/>
    </Stack>
  )
})
DateDivider.displayName = 'DateDivider'

const ChatPanel = memo(({children}: { children: ReactNode }) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const listenerFn = () => {
    const target = document.getElementById(PanelId)
    if (target && (target.scrollHeight - target.clientHeight) < (250 - target.scrollTop)) {
      // @ts-ignore
      dispatch(getOldMessageOnScrollTop(listenerFn))
    }
    if (target && target.scrollTop > -100)
      // @ts-ignore
      dispatch(markReadMessage())
  }

  useEffect(() => {
    const panel = document.getElementById(PanelId)
    if (panel) panel.addEventListener('scroll', listenerFn)
  }, [])

  return (
    <Stack
      spacing={2}
      direction="column-reverse"
      className="ggj-scrollbar"
      id="#chat-panel-content"
      css={css`
          display: flex;
          padding: 20px ${theme.spacing(4)};
          height: 100%;
          overflow-y: scroll;
          @media screen and (max-width: ${theme.breakpoints.values.lg - 1}px) {
            height: calc(100% - 156px);
          }
        `}
    >
      {children}
    </Stack>
  )
})
ChatPanel.displayName = 'ChatPanel'

// Main component
export const ContentChatPanel = () => {
  const listMessage = useAppSelector(state => state[ns].CHATCONTENT_listMessages) as Array<IMessages>
  return (
    <ChatPanel>
      {listMessage.map((item, index) => {
        const nextDate = listMessage[index + 1] ? new Date(listMessage[index + 1].sentAt) : new Date(0)
        // Check if passed to another day
        const shouldShowDate = new Date(item.sentAt).getDate() != nextDate.getDate()
          || new Date(item.sentAt).getMonth() != nextDate.getMonth()
          || new Date(item.sentAt).getFullYear() != nextDate.getFullYear()

        if (!item.userId)
          return <BubbleSystem data={item} key={`mess${item.id}`} showDate={shouldShowDate}/>
        if (item.isSender)
          return <BubbleSend data={item} key={`mess${item.id}`} showDate={shouldShowDate}/>

        return <BubbleReceive data={item} key={`mess${item.id}`} showDate={shouldShowDate}/>
      })}
    </ChatPanel>
  )
}
