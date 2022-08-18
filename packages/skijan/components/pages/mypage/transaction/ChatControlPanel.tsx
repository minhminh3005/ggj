import {css} from '@emotion/react'
import {IconButton, Stack, TextField, useTheme} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {actions, ns, sendNewMessage} from '../../../../store/transactionSlice'
import {ReactNode, memo, useState} from 'react'
import {ChatUpload, optFile} from './ChatControlUpload'
import {CHAT_COLOR, nsTransaction} from './const'
import {useForm, Controller} from 'react-hook-form'
import {ggjDebounce} from '../../../../common/utils'
import {LoadingButton} from '@mui/lab'
import {useTranslation} from 'next-i18next'

interface IFormValues {
  content: string
}

const IconButtonWrapper = ({children, onClick}:{children: ReactNode, onClick?: () => void}) => {
  const theme = useTheme()
  return (
    <IconButton
      onClick={onClick}
      disabled={!onClick}
      css={css`
          width: ${theme.spacing(5)};
          height: ${theme.spacing(5)};
        `}>
      {children}
    </IconButton>
  )
}

const FunctionButton = memo(() => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)

  const openUploadModal = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }
  return (
    <Stack direction="row" spacing="4px" css={css`
      width: calc(100% - ${theme.spacing(5)});
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        width: auto;
      }
    `}>

      <IconButtonWrapper onClick={openUploadModal}>
        <UploadFileIcon/>
      </IconButtonWrapper>

      {/*List*/}
      {/*<IconButtonWrapper>*/}
      {/*  <FormatListNumberedIcon color="disabled"/>*/}
      {/*</IconButtonWrapper>*/}

      {/*Emoji*/}
      {/*<IconButtonWrapper>*/}
      {/*  <InsertEmoticonIcon color="disabled"/>*/}
      {/*</IconButtonWrapper>*/}

      <ChatUpload
        open={open}
        onCloseModal={handleClose}
        maxSize={100}
        maxFiles={5}
        totalSize={500}
        acceptType={optFile.acceptType}
      />
    </Stack>
  )
})
FunctionButton.displayName = 'FunctionButton'

export const ChatControlPanel = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const dispatch = useAppDispatch()
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const loading = useAppSelector((state) => state[ns]?.isLoadingMess)
  const isChatClose = useAppSelector((state) => state[ns]?.isChatClose)
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  const {
    handleSubmit,
    control,
    setValue
  } = useForm<IFormValues>({
    reValidateMode: 'onSubmit'
  })

  const onSubmit = ggjDebounce( async ({content}: IFormValues) => {
    if (!(content.trim().length) || loading) return
    dispatch(actions.setIsLoadingMess(true))
    // @ts-ignore
    const text = await dispatch(sendNewMessage(content))
    setValue('content', String(text))
    dispatch(actions.setIsLoadingMess(false))
  }, 500)

  if(isChatClose) return null

  return (
    <form action='' onSubmit={handleSubmit(onSubmit)} css={css`
      background:${theme.palette.common.white};
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        border: 1px solid ${theme.palette.divider};
        border-radius: 10px;
        margin: 0 ${theme.spacing(4)} ${theme.spacing(3)};
      }
    `}>
      <Stack direction="row" alignItems="flex-end" css={css`
        height: 100%;
        padding: ${theme.spacing(3)};
        flex-wrap: wrap;
        border-top: solid 1px ${theme.palette.divider};
        align-items: center;
        margin-top: 12px;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          flex-wrap: nowrap;
          padding: ${theme.spacing(3)} ${theme.spacing(4)};
          border-top: none;
          margin-top: 0;
        }
      `}>
        <FunctionButton />
        <div className="ggj-scrollbar" css={css`
          width: 100%;
          order: -1;
          margin: 0 0 ${theme.spacing(1)} 0;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            margin: 0 18px 0 12px;
            order: 0;
          }

          .MuiOutlinedInput-input {
            padding: 0;
          }

          .MuiOutlinedInput-root {
            border-radius: ${theme.spacing(4)};
            padding: ${theme.spacing(2)};
          }
        `}>
          <Controller
            control={control}
            name="content"
            aria-describedby="send-content"
            defaultValue=""
            render={({field}) => {
              return(
                <TextField
                  fullWidth
                  multiline
                  placeholder={t('52')}
                  maxRows={12}
                  inputProps={{
                    maxLength: 2000,
                  }}
                  onKeyPress={(event) => {
                    if(!isMobile && !event.shiftKey && event.key == 'Enter') {
                      handleSubmit(onSubmit)()
                      event.stopPropagation()
                      event.preventDefault()
                    }
                  }}
                  {...field}/>
              )
            }
            }
          />
        </div>
        <LoadingButton
          aria-label="upload picture"
          component="span"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
          css={css`
            width: ${theme.spacing(5)};
            height: ${theme.spacing(5)};
            min-width: ${theme.spacing(5)};
            border-radius: 50%;
            background-color: ${loading? theme.palette.divider : CHAT_COLOR[mode].primary.bg};
            :hover {
              background-color: ${CHAT_COLOR[mode].primary.bg};
            }
          `}
          endIcon={<SendRoundedIcon css={css`
            color: ${theme.palette.common.white};
            font-size: 18px;
            margin-left: -${theme.spacing(2)};
          `}/>}
        />
      </Stack>
    </form>
  )
}
