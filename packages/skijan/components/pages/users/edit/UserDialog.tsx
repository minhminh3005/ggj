import {Dialog, DialogActions, DialogContent, Typography} from '@mui/material'
import Button from '@mui/material/Button'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'

interface UserDialogProps {
  open: boolean
  title: string
  description: string
  closeText: string
  okText: string
  parentId: string
  onClose: () => void
  onOk: () => void
}

const UserDialog = (props: UserDialogProps) => {
  const theme = useTheme()
  return (
    <Dialog open={props.open} container={() => document.getElementById(props.parentId)}
      css={css`
        position: absolute;

        .MuiBackdrop-root {
          position: absolute;
        }
      `}
    >
      <DialogContent css={css`
        width: 340px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 20px 0 0 26px;
      `}>
        <Typography css={css`font-size: 22px`}>{props.title}</Typography>
        <Typography variant="caption" css={css`color: ${theme.palette.jade.dark};
          padding-top: 9px`}>{props.description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onClose}><Typography variant="body2" css={css`color: ${theme.palette.jade.light};
              font-weight: 300`}>{props.closeText}</Typography></Button>
        <Button onClick={props.onOk}><Typography variant="body2" css={css`color: ${theme.palette.ruby.main};
              font-weight: 300`}>{props.okText}</Typography></Button>
      </DialogActions>
    </Dialog>
  )
}
export default UserDialog
