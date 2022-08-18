import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function GoogleIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="グループ_1134" data-name="グループ 1134" transform="translate(-16 -12)">
        <g id="グループ_1449" data-name="グループ 1449" transform="translate(16 12)">
          <g id="google-icon" transform="translate(2 2)">
            <path id="パス_494" data-name="パス 494" d="M140.418,108.863a8.81,8.81,0,0,0-.217-2.1H130.55v3.815h5.665a5.023,5.023,0,0,1-2.1,3.335l-.019.128,3.052,2.364.211.021a10.051,10.051,0,0,0,3.061-7.561" transform="translate(-120.418 -98.505)" fill="#4285f4"/>
            <path id="パス_495" data-name="パス 495" d="M23.108,164.616a9.8,9.8,0,0,0,6.807-2.49l-3.244-2.513a6.084,6.084,0,0,1-3.564,1.028,6.188,6.188,0,0,1-5.848-4.272l-.121.01-3.173,2.456-.041.115a10.272,10.272,0,0,0,9.183,5.665" transform="translate(-12.829 -144.208)" fill="#34a853"/>
            <path id="パス_496" data-name="パス 496" d="M4.432,78.009a6.328,6.328,0,0,1-.343-2.033,6.65,6.65,0,0,1,.331-2.033l-.006-.136L1.2,71.312l-.105.05a10.258,10.258,0,0,0,0,9.229l3.335-2.581" transform="translate(0 -65.772)" fill="#fbbc05"/>
            <path id="パス_497" data-name="パス 497" d="M23.024,3.975a5.618,5.618,0,0,1,3.938,1.531l2.874-2.833A9.737,9.737,0,0,0,23.024,0a10.169,10.169,0,0,0-9.1,5.665l3.293,2.581a6.163,6.163,0,0,1,5.805-4.272" transform="translate(-12.829 0)" fill="#eb4335"/>
          </g>
          <rect id="長方形_755" data-name="長方形 755" width="24" height="24" fill="none"/>
        </g>
      </g>
    </SvgIcon>
  )
}
