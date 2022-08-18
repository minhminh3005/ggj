import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/css'

const cls1 = css`
  fill: #626262;
  fill-opacity:0;
`

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function ConsultationIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="レイヤー_2" data-name="レイヤー 2">
        <g id="レイヤー_1-2" data-name="レイヤー 1">
          <rect id="長方形_2330" data-name="長方形 2330" className={cls1} width="24" height="24"/>
          <g id="グループ_5847" data-name="グループ 5847">
            <path id="前面オブジェクトで型抜き_3" data-name="前面オブジェクトで型抜き 3"
              d="M12,22A10,10,0,0,1,2,12H2A10,10,0,0,1,12,2h8a2,2,0,0,1,2,2v8A10,10,0,0,1,12,22ZM12,4a8,8,0,0,0-8,8H4a8,8,0,0,0,16,0V4Z"/>
            <g id="グループ_5846" data-name="グループ 5846">
              <circle id="楕円形_225" data-name="楕円形 225" cx="8" cy="12" r="1"/>
              <circle id="楕円形_226" data-name="楕円形 226" cx="12" cy="12" r="1"/>
              <circle id="楕円形_227" data-name="楕円形 227" cx="16" cy="12" r="1"/>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
