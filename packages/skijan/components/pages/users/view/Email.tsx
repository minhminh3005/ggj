import {Button, Grid, Typography, useTheme, Dialog} from '@mui/material'
import {css} from '@emotion/react'
import {Calculate, MailOutline} from '@mui/icons-material'
import {useState} from 'react'
import {FormProvider, useForm} from 'react-hook-form'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import {
  GgjUploadImagesOrFiles,
  FileTypes
} from 'components/commons/GgjUploadImagesOrFiles'

const EmailDialog = () => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const handler = () => setOpen(!open)

  return (
    <>
      <div
        css={css`
          display: flex;
          justify-content: center;
          margin-top: 30px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            margin-top: 42px;
          }
        `}
      >
        <Button
          startIcon={<MailOutline/>}
          onClick={handler}
          css={css`
            width: 100%;
            border-radius: 10px;
            padding: 12px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              width: 337px;
            };
          `}
          variant="contained"
        >
          <Typography variant="body1">質問を送信する</Typography>
        </Button>
      </div>
      <Dialog open={open}>
        <div
          css={css`
            padding: 20px 24px;
          `}
        >
          <Typography
            variant="h5"
            css={css`
              margin-bottom: 8px;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                font-size: 35px;
              };
            `}
          >
            送信しました。
          </Typography>
          <Typography
            variant="caption"
            css={css`
              @media (min-width: ${theme.breakpoints.values.md}px) {
                font-size: 16px;
              };
            `}
          >
            送信内容、返信内容は、マイページのメッセージからご確認ください。
          </Typography>
          <div
            css={css`
              display: flex;
              justify-content: flex-end;
              margin-top: 20px;
            `}
          >
            <Button onClick={handler}>
              <Typography
                variant="button"
                css={css`
                  @media (min-width: ${theme.breakpoints.values.md}px) {
                    font-size: 22px;
                  };
                `}
              >
                OK
              </Typography>
            </Button>
          </div>
        </div>
      </Dialog>
    </>
  )
}

const EmailOptions = () => {
  const theme = useTheme()
  return (
    <Grid container spacing={3}>
      <Grid item xs={6} md={6} lg={12}>
        <Button
          startIcon={<MailOutline/>}
          css={css`
            width: 100%;
            border-radius: 10px;
            padding: 12px 16px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              padding: 12px 36px;
            }
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              width: 180px;
            }
          `}
          fullWidth
          variant="outlined"
        >
          質問する
        </Button>
      </Grid>
      <Grid item xs={6} md={6} lg={12}>
        <Button
          startIcon={<Calculate/>}
          css={css`
            width: 100%;
            border-radius: 10px;
            padding: 12px 16px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              padding: 12px 36px;
            }
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              width: 180px;
            }
          `}
          disabled
          fullWidth
          variant="outlined"
        >
          見積依頼
        </Button>
      </Grid>
    </Grid>
  )
}

interface IFormValues {
  question: string
}

const Email = () => {
  const value: Array<FileTypes> = []
  let lstFiles: Array<FileTypes> = []
  const methods = useForm<IFormValues>({reValidateMode: 'onSubmit'})
  const theme = useTheme()
  const onSubmit = ({question}: IFormValues) => {
    console.log('onSubmit', question)
  }
  const handleChange = (listFiles: Array<FileTypes>) => {
    lstFiles = listFiles
    console.log('listFiles', lstFiles)
  }
  const handleRemove = (listRemoveFiles: Array<FileTypes>) => {
    //  lstRemoveFiles = listRemoveFiles
    console.log('listRemoveFiles', listRemoveFiles)
  }

  return (
    <Grid container spacing={4} css={css`position: relative;`}
    >
      <Grid item xs={12} lg={3}>
        <EmailOptions/>
      </Grid>
      <Grid item xs={12} lg={6}>
        <a href="https://skijan.com/mypage/message">
          <Typography
            component="div"
            variant="caption"
            css={css`
              color: ${theme.palette.primary.main};
              text-decoration: underline;
              cursor: pointer;
            `}
          >
            過去のメッセージを見る
          </Typography>
        </a>
        <div css={css`margin-top: 7px`}>
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              action=""
              css={css`
                .MuiFormControl-root {
                  width: 100%;
                }
              `}
            >
              <GgjInputCountText
                cssInput={css`
                  width: 100%;
                  height: 240px;
                `}
                name="question"
                rules={{maxLength: 1000}}
                isMultiline={true}
                rows={10}
                placeholder=""
              />
            </form>
          </FormProvider>
          <Typography variant="subtitle2" css={css`margin-top: 16px`}>画像を選択</Typography>
          <GgjUploadImagesOrFiles onChange={handleChange} onRemove={handleRemove} value={value} maxFiles={5}
            acceptType=".png,.jpg,.pdf" maxSize={5}
          />
        </div>
        <EmailDialog/>
      </Grid>
      <div
        css={css`
          position: absolute;
          display: block;
          border-radius: 10px;
          width: 100%;
          height: 105%;
          top: 0;
          left: 12px;
          background-color: #22222252;
        `}
      >
        <Typography
          variant="h5"
          css={css`
            color: white;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
          `}
        >
          coming soon...
        </Typography>
      </div>
    </Grid>
  )
}

export default Email
