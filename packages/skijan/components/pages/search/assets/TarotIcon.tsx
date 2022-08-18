import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/css'

const cls1 = css`
  fill: #626262;
  fill-opacity: 0;
`

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function TarotIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="レイヤー_2" data-name="レイヤー 2">
        <g id="レイヤー_1-2" data-name="レイヤー 1">
          <rect id="長方形_2324" data-name="長方形 2324" className={cls1} width="24" height="24" />
          <g id="グループ_5844" data-name="グループ 5844">
            <path id="前面オブジェクトで型抜き_2" data-name="前面オブジェクトで型抜き 2"
              d="M18,22H6a2,2,0,0,1-2-2V4A2,2,0,0,1,6,2H18a2,2,0,0,1,2,2V20A2,2,0,0,1,18,22ZM6,4V20H18V4Z" />
            <g id="グループ_5843" data-name="グループ 5843">
              <path id="前面オブジェクトで型抜き_1" data-name="前面オブジェクトで型抜き 1"
                d="M11.65,15.64A4,4,0,0,1,8,13.29a3.91,3.91,0,0,0,1.65.35,4,4,0,0,0,4-4h0A3.75,3.75,0,0,0,13.3,8a4,4,0,0,1-1.65,7.64Z" />
              <path id="パス_1237" data-name="パス 1237"
                d="M10,11.05l1.23.75-.33-1.41L12,9.45l-1.44-.12L10,8,9.44,9.33,8,9.45l1.09.94L8.77,11.8Z" />
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
