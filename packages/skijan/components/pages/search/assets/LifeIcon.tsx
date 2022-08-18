import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/css'

const cls1 = css`
  fill: none;
`

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function LifeIcon (props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="レイヤー_2" data-name="レイヤー 2">
        <g id="レイヤー_1-2" data-name="レイヤー 1">
          <path id="パス_1239" data-name="パス 1239" className={cls1} d="M0,0H24V24H0Z"/>
          <path id="パス_1240" data-name="パス 1240" d="M16.5,3A6,6,0,0,0,12,5.09,6,6,0,0,0,7.5,3,5.45,5.45,0,0,0,2,8.39V8.5C2,12.28,5.4,15.36,10.55,20L12,21.35,13.45,20C18.6,15.36,22,12.28,22,8.5A5.45,5.45,0,0,0,16.61,3ZM12.1,18.55l-.1.1-.1-.1C7.14,14.24,4,11.39,4,8.5A3.42,3.42,0,0,1,7.33,5H7.5a3.91,3.91,0,0,1,3.57,2.36h1.87A3.89,3.89,0,0,1,16.5,5,3.42,3.42,0,0,1,20,8.33V8.5C20,11.39,16.86,14.24,12.1,18.55Z"/>
          <path
            d="M12.38,16.27h0a1,1,0,0,1-.9-.57l-2.1-4.36-1,1.92a1,1,0,0,1-.89.54H1.89a1,1,0,0,1,0-2h5L8.52,8.64a1,1,0,0,1,1.79,0L12.4,13l1.41-2.82A1,1,0,0,1,15.45,10l1.61,1.83h2a1,1,0,0,1,0,2H16.6a1,1,0,0,1-.75-.34l-.92-1.05-1.65,3.3A1,1,0,0,1,12.38,16.27Z"/>
        </g>
      </g>
    </SvgIcon>
  )
}
