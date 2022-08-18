import {css} from '@emotion/react'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import {useTheme} from '@mui/material/styles'
import {IconButton, Stack, Typography} from '@mui/material'
import {useAppDispatch} from '../../../../store/hooks'
import {actions} from '../../../../store/usersSlice'

interface ITitle<T> {
  name: string
  showEdit?: boolean | false
  onClick?: () => void
  data: T
}

const TitleItem = ({name, showEdit , data}: ITitle<any>) => {
  const theme = useTheme()
  const dispatch = useAppDispatch()

  return (
    <Stack direction="row" justifyContent="space-between" alignItems="center">
      <Typography
        variant="subtitle2"
        css={css`
          color: ${theme.palette.jade.dark};
          white-space: pre-line;
          word-break: break-word;
        `}
      >
        {name}
      </Typography>
      {showEdit &&
        <IconButton
          onClick={() => {
            dispatch(actions.setEditItem({data: data}))
            dispatch(actions.setShowEditForm(true))
          }}
          color="secondary"
          aria-label="edit filed"
          css={css`
            background: #f9ead0;
            width: 32px;
            height: 32px;

            :hover {
              background: #f9ead0;
            }
          `}
        >
          <EditOutlinedIcon css={css`width: 18px;
            height: 18px`}
          />
        </IconButton>
      }
    </Stack>
  )
}

export default TitleItem
