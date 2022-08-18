import { memo, ReactNode, useCallback } from 'react'
import { Avatar, Stack, Typography, useTheme } from '@mui/material'
import { css } from '@emotion/react'
import FileItem from '../transaction/FileItem'
import { useAppDispatch } from 'store/hooks'
import {actions as actionImageViewer, IImageViewer} from 'components/commons/GgjChatImageViewer'
import { formatDate } from 'common/date'
import { IFile } from '../transaction/FileItem'
import Link from 'next/link'

const DATE_FORMAT = 'yyyy/MM/dd hh:mmaaa'

const WrapperChatPanel = memo(({ children }: { children: ReactNode }) => {
  const theme = useTheme()
  return (
    <Stack spacing={2} direction="column-reverse" className="ggj-scrollbar" css={css`
      display: flex;
      padding: 20px ${theme.spacing(4)};
      height: calc(100% - 72px - 56px);
      overflow-y: scroll;
      background: ${theme.palette.canvas.light};
      @media screen and (max-width: ${theme.breakpoints.values.lg - 1}px) {
        height: calc(100% - 156px);
      }
    `}>
      {children}
      <Stack direction="column" alignItems="center">
        <Avatar
          css={css`
            height: 72px;
            width: 72px;
            margin-right: ${theme.spacing(2)};
            margin-bottom: ${theme.spacing(2)};
          `}
          src={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU'
          }
        />

        <Typography
          css={css`
            font-weight: 500;
          `}
          variant="body1"
        >
          Nick name nick name nick name
        </Typography>

        <Link href={'/'} passHref>
          <Typography
            component="a"
            css={css`
              border-radius: 19px;
              padding: 6px 12px;
              border: 1px solid ${theme.palette.divider};
              margin-top: 32px;
              margin-bottom: ${theme.spacing(3)};
              text-decoration: none;
              background-color: white;
            `}
            variant="subtitle2"
          >
            プロフィールを見る
          </Typography>
        </Link>
      </Stack>
    </Stack>
  )
})
WrapperChatPanel.displayName = 'WrapperChatPanel'

interface MessageConentProps {
  avatar?: string
  nickName: string
  message: string
  isNewMessage?: boolean
  fileList?: IFile[]
  createdAt: number
}
const MessageConent = memo((props: MessageConentProps) => {
  const {
    nickName,
    message,
    isNewMessage,
    fileList,
    createdAt = 0,
    avatar,
  } = props
  const theme = useTheme()

  return (
    <div
      css={css`
        padding-top: ${theme.spacing(3)};
        padding-bottom: ${theme.spacing(5)};
        &:not(:last-child) {
          border-bottom: 1px solid ${theme.palette.divider};
        }
      `}
    >
      <Stack direction="row" alignItems="center">
        <Avatar
          css={css`
            height: 40px;
            width: 40px;
            margin-right: ${theme.spacing(2)};
          `}
          src={avatar}
        />

        <Stack>
          <Typography
            css={css`
              font-weight: 500;
            `}
            variant="body1"
          >
            {nickName}
          </Typography>
          <Stack direction="row">
            <Typography
              css={css`
                margin-right: ${theme.spacing(2)};
              `}
              variant="caption"
            >
              {formatDate(createdAt, DATE_FORMAT)}
            </Typography>
            {isNewMessage && (
              <Typography
                css={css`
                  letter-spacing: 0.37px;
                  color: ${theme.palette.ruby.main};
                `}
                variant="caption"
              >
                New message
              </Typography>
            )}
          </Stack>
        </Stack>
      </Stack>

      <Typography
        css={css`
          font-weight: 400;
          margin-top: ${theme.spacing(2)};
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            margin-top: ${theme.spacing(3)};
          }
        `}
        variant="body1"
      >
        {message}
      </Typography>

      <Stack
        css={css`
          margin-top: ${theme.spacing(4)};
        `}
        direction="column"
        rowGap={theme.spacing(3)}
      >
        {fileList?.map((file, index) => (
          <FileItem key={index} {...file} />
        ))}
      </Stack>
    </div>
  )
})
MessageConent.displayName = 'MessageConent'

// Main component
export const ContentChatPanel = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  const handleClickImages = useCallback((item: IImageViewer) => {
    dispatch(actionImageViewer.setViewingImages([item]))
  }, [])

  return (
    //ToDo: Thao, need add component children
    <WrapperChatPanel>
      <div>
        <MessageConent
          avatar={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU'
          }
          message="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore"
          nickName={'nick name 1'}
          fileList={[
            {
              name: 'Sassssssfe & Sound feat. The Civil Wars (The Hunger Games: Songs From District 12 And Beyond).zip',
              fileType: 'file',
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU',
              ext: 'zip',
              colorIcon: '#ffffff',
              colorBgIcon: theme.palette.primary.main,
              colorText: theme.palette.jade.light,
            },
            {
              onClickFileItem: () =>
                handleClickImages(
                  {
                    name: 'Sassssssfe & Sound feat. The Civil Wars (The Hunger Games: Songs From District 12 And Beyond).zip',
                    url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU'
                  }
                ),
              name: 'Carpe diem, quam minimim belula postero.png',
              fileType: 'image',
              url: 'https://i.pinimg.com/736x/f6/e4/df/f6e4dfc2834fafdc38caec39ed628748.jpg',
              ext: 'jpg',
              colorText: theme.palette.jade.light,
              colorIcon: '#ffffff',
              colorBgIcon: theme.palette.primary.main,
            },
          ]}
          createdAt={1652864857000}
        />
        <MessageConent
          avatar={
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU'
          }
          message="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore"
          nickName={'nick name 2'}
          fileList={[
            {
              name: 'Sassssssfe & Sound feat. The Civil Wars (The Hunger Games: Songs From District 12 And Beyond).zip',
              fileType: 'file',
              url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRddHYb8V68DUb2_L70XqS5o5QTSD8BwjjYRw&usqp=CAU',
              ext: 'zip',
              colorIcon: '#ffffff',
              colorBgIcon: theme.palette.primary.main,
              colorText: theme.palette.jade.light,
            },
          ]}
          createdAt={1652864857000}
        />
        <MessageConent
          message="Lorem ipsum dolor sit amet, consectetur adipisci elit, sed eiusmod
        tempor incidunt ut labore"
          nickName={'nick name 3'}
          isNewMessage
          createdAt={1652864857000}
        />
      </div>
    </WrapperChatPanel>
  )
}
