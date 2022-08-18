import {memo, ReactNode, useMemo} from 'react'
import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {Typography} from '@mui/material'
import {GgjContainButton} from '../../commons/GgjButton'

const CustomizedButton = ({
  onClick,
  disabled,
  children
}: {
  onClick?: () => void
  disabled?: boolean,
  children: ReactNode
}) => {
  const theme = useTheme()
  const breakPointLg = useMemo(() => theme.breakpoints.values.lg, [])
  const breakPointMd = useMemo(() => theme.breakpoints.values.md, [])

  return (
    <footer
      css={css`
        display: flex;
        justify-content: flex-start;
        margin-top: ${theme.spacing(5)};
        @media screen and (max-width: ${breakPointLg - 1}px) {
          justify-content: center;
        }
      `}
    >
      <GgjContainButton
        onClick={onClick}
        disabled={disabled}
        cssStr={`
          width:100%;
          @media (min-width:${breakPointMd}px) and (max-width: ${breakPointLg - 1}px)
          {
            width:440px;
          }
          @media (min-width:${breakPointLg}px)
          {
            width:240px;
          }
       `}
      >
        <Typography
          css={css`
            font-size: 16px;
            line-height: 24px;
            letter-spacing: 0.5px;
          `}
        >
          {' '}
          {children}
        </Typography>
      </GgjContainButton>
    </footer>
  )
}
export default memo(CustomizedButton)
