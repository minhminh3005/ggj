import { useTheme } from '@mui/material/styles'
import { Slide, SlideProps } from '@mui/material'
import { css } from '@emotion/react'
export default function SuccessSlider(props: SlideProps & {isShow: boolean}) {
  const theme = useTheme()
  return (
    <Slide direction='left' in={props.isShow} css={css`
      position: absolute;
      top: ${theme.spacing(3)};
      left: 0;
      background-color: #fff;
      padding: 0 ${theme.spacing(3)};
      width: 100%;
      height: 100%;
      @media (min-width: ${theme.breakpoints.values.sm}px)  {
        top: ${theme.spacing(7)};
      `}>
      {props.children}
    </Slide>
  )
}