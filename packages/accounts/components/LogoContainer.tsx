import { css } from '@emotion/react'
import { Button } from '@mui/material'
import Link from 'next/link'
import { ComponentPropsWithoutRef, memo } from 'react'
import { useTheme } from '@mui/material/styles'

function LogoContainer(props: ComponentPropsWithoutRef<'div'> & { href: string, width?: string, height?: string, rounded?: string, border?: string }) {
  const { width, height, rounded, border } = props
  const theme = useTheme()
  return (
    <Link href={props.href} passHref>
      <Button
        css={css`
          border: ${border ? border : 'none'};
          height: ${height ? height : '40px'};
          min-width: 0;
          width: ${width ? width : '40px'};
          border-radius: ${rounded ? rounded : '10px'};
          overflow: hidden;
          transition: ${theme.transitions.create(['box-shadow'], { duration: 'complex' })};
          cursor: pointer;
          box-shadow: ${theme.shadows[0]};
          display: block;
          padding: 0;
          transition: box-shadow ${theme.transitions.duration.standard};
          svg {
            height: 100%;
            width: 100%;
          }
          &:hover {
            box-shadow: ${theme.shadows[1]};
          }
          &:active {
            box-shadow: ${theme.shadows[0]};
          }
      `}
      >{props.children}</Button>
    </Link>
  )
}

export default memo(LogoContainer)
