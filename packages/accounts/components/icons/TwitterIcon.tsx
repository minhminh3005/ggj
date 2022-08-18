import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function TwitterIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <g id="グループ_1452" data-name="グループ 1452" transform="translate(-16 -4)">
        <g id="Logo_1_" transform="translate(17 7)">
          <path id="white_background" d="M20.748,5.948c.013.194.013.388.013.584A12.755,12.755,0,0,1,7.919,19.374v0A12.778,12.778,0,0,1,1,17.347a9.182,9.182,0,0,0,1.074.065A9.063,9.063,0,0,0,7.68,15.476a4.519,4.519,0,0,1-4.217-3.134A4.5,4.5,0,0,0,5.5,12.264,4.514,4.514,0,0,1,1.88,7.84V7.783a4.485,4.485,0,0,0,2.049.565,4.519,4.519,0,0,1-1.4-6.027,12.811,12.811,0,0,0,9.3,4.715A4.518,4.518,0,0,1,19.526,2.92a9.057,9.057,0,0,0,2.866-1.1,4.53,4.53,0,0,1-1.984,2.5A8.977,8.977,0,0,0,23,3.61,9.17,9.17,0,0,1,20.748,5.948Z" transform="translate(-1 -1.497)" fill="#1d9bf0"/>
        </g>
        <rect id="長方形_758" data-name="長方形 758" width="24" height="24" transform="translate(16 4)" fill="none"/>
      </g>
    </SvgIcon>
  )
}
