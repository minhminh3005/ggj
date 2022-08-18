import SvgIcon from '@mui/material/SvgIcon'
import { SerializedStyles } from '@emotion/react'
interface Props {
  css?: SerializedStyles
}

export default function TelevisionIcon(props?: Props) {
  return (
    <SvgIcon
      {...props}
      height="24px"
      viewBox="0 0 24 24"
      width="24px"
      fill="#000000"
    >
      <path d="M0 0h24v24H0V0z" fill="none" />
      <path d="M21 2H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h7v2H8v2h8v-2h-2v-2h7c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H3V4h18v12z" />
    </SvgIcon>
  )
}
