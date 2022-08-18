import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'

interface Props extends SvgIconProps {
  css?: SerializedStyles
}

export default function EditIcon(props: Props) {
  return (
    <SvgIcon {...props} height="24px" viewBox="0 0 24 24" width="24px" fill="#000000">
      <rect fill="none" height="24" width="24" />
      <path
        d="M3,10h11v2H3V10z M3,8h11V6H3V8z M3,16h7v-2H3V16z M18.01,12.87l0.71-0.71c0.39-0.39,1.02-0.39,1.41,0l0.71,0.71 c0.39,0.39,0.39,1.02,0,1.41l-0.71,0.71L18.01,12.87z M17.3,13.58l-5.3,5.3V21h2.12l5.3-5.3L17.3,13.58z" />
    </SvgIcon>
  )
}

