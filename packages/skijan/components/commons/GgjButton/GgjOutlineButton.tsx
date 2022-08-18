import {memo} from 'react'
import {css} from '@emotion/react'
import {Button, ButtonProps} from '@mui/material'
import {styled} from '@mui/material/styles'
import {rgba} from 'emotion-rgba'
import {GgjButtonProps} from './const'


const OutlineButton = styled(Button)<ButtonProps>(({theme}) => {
  return {
    fontSize: 16,
    fontWeight: 500,
    padding: `10px ${theme.spacing(3)}`,
    height: '44px',
    border: '1px solid',
    lineHeight: theme.spacing(3),
    backgroundColor: 'transparent',
    borderColor: rgba(theme.palette.primary.main, 0.5),
    fontFamily: theme.typography.fontFamily,
    color: theme.palette.primary.main,
    letterSpacing: '1.42px',
    borderRadius: '10px',
    '&:hover': {
      backgroundColor: rgba(theme.palette.primary.main, 0.05),
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
      boxShadow: 'none',
      cursor: 'pointer',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: rgba(theme.palette.primary.main, 0.1),
      borderColor: theme.palette.primary.main,
      color: theme.palette.primary.main,
    },
    '&:focus': {
      boxShadow: 'none',
    },
    '&:disabled': {
      boxShadow: 'none',
      cursor: 'not-allowed',
      backgroundColor: '#FFFFFF',
      borderColor: rgba(theme.palette.primary.light, 0.5),
      color: rgba(theme.palette.primary.light, 0.5),
    },
  }
})

function GgjButton({
  cssStr,
  ...props
}: GgjButtonProps) {
  return (
    <OutlineButton
      {...props}
      css={css`
        ${cssStr}
      `}
    />
  )
}
export const GgjOutlineButton = memo(GgjButton)

