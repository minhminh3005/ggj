import SvgIcon, { SvgIconProps }  from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function EmailIcon(props: Props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path id="パス_626" data-name="パス 626" d="M0,0H24V24H0Z" fill="none"/>
      <path id="パス_627" data-name="パス 627" d="M20,4H4A2,2,0,0,0,2.01,6L2,18a2.006,2.006,0,0,0,2,2H20a2.006,2.006,0,0,0,2-2V6A2.006,2.006,0,0,0,20,4Zm0,4-8,5L4,8V6l8,5,8-5Z" fill="#626262"/>
    </SvgIcon>
  )
}
