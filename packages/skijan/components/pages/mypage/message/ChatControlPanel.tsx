import {css} from '@emotion/react'
import {IconButton, Stack, TextField, useTheme} from '@mui/material'
import SendRoundedIcon from '@mui/icons-material/SendRounded'
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon'
import {ChatUpload} from './ChatControlUpload'
import TitleIcon from '@mui/icons-material/Title'
import {FileTypes,dispatchEvent, EventBusAction} from './ChatControlUpload/const'


interface ChatControlProps {
  masterId: number
  createMessageUrl: string
  uploadFileUrl: string
}

export const ChatControlPanel = (props: ChatControlProps) => {
  const theme = useTheme()
  let lstFile: Array<FileTypes> = []

  const handleChange = (listFiles: Array<FileTypes>) => {
    lstFile = listFiles
    console.log(lstFile)
  }

  const sendMessage = ()=>{
    dispatchEvent(EventBusAction.HandleResetListFiles, null)
  }
  return (
    <div
      css={css`
        background: ${theme.palette.canvas.light};
      `}
    >
      <div
        css={css`
          background: ${theme.palette.common.white};
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            border: 1px solid ${theme.palette.divider};
            border-radius: 10px;
            margin: 0 ${theme.spacing(4)} ${theme.spacing(3)};
          }
        `}
      >
        <Stack
          direction="row"
          alignItems="flex-end"
          css={css`
            height: 100%;
            padding: ${theme.spacing(3)};
            flex-wrap: wrap;
            border-top: solid 1px ${theme.palette.divider};
            @media only screen and (min-width: ${theme.breakpoints.values
      .lg}px) {
              flex-wrap: nowrap;
              padding: ${theme.spacing(3)} ${theme.spacing(4)};
              border-top: none;
            }
          `}
        >
          <Stack
            direction="row"
            spacing="16px"
            alignItems="center"
            css={css`
              height: 39px;
              width: calc(100% - ${theme.spacing(5)});
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                width: auto;
              }
            `}
          >
            <ChatUpload
              onChange={handleChange}
              maxSize={100}
              maxFiles={5}
              totalSize={500}
              acceptType=".pdf,.jpg,.png,.mp3,.mp4,.zip"
              masterId={props.masterId}
              createMessageUrl={props.createMessageUrl}
              uploadFileUrl={props.uploadFileUrl}
            />
            <TitleIcon color="disabled"/>
            <InsertEmoticonIcon color="disabled"/>
          </Stack>
          <div
            className="ggj-scrollbar"
            css={css`
              width: 100%;
              order: -1;
              margin: 0 0 ${theme.spacing(1)} 0;
              @media only screen and (min-width: ${theme.breakpoints.values
      .lg}px) {
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
            `}
          >
            <TextField
              fullWidth
              multiline
              placeholder="メッセージを入力"
              id="fullWidth"
              maxRows={12}
            />
          </div>
          <Stack direction="row" alignItems="center" height="39px">
            <IconButton
              aria-label="upload picture"
              component="span"
              onClick={sendMessage}
              css={css`
                width: ${theme.spacing(5)};
                height: ${theme.spacing(5)};
                background-color: #a4b5ed;

                :hover {
                  background-color: ${theme.palette.primary.main};
                }
              `}
            >
              <SendRoundedIcon
                css={css`
                  color: ${theme.palette.common.white};
                  font-size: 18px;
                `}
              />
            </IconButton>
          </Stack>
        </Stack>
      </div>

    </div>
  )
}
