import { SerializedStyles } from '@emotion/react'
import { css } from '@emotion/css'
import SvgIcon from '@mui/material/SvgIcon'

interface Props {
  css?: SerializedStyles,
}

export default function SkijanLogoIcon(props: Props) {
  const clsE = css`fill:#fff;`
  const clsF = css`fill:#222;`
  const clsG = css`fill:#496cdc;`
  return (
    <SvgIcon viewBox="0 0 232 80" {...props}>
      <g id="a" />
      <g id="b">
        <g id="c">
          <g>
            <g>
              <rect className={clsG} width="80" height="80" rx="20" ry="20" />
              <g>
                <path className={clsE}
                  d="M60.5,37.71l-1.55-.48c.05,.07,.09,.15,.12,.23,.14,.46-.12,.95-.58,1.09l-7.66,2.37-7.33,2.27c-1.97,.61-4.08,.61-6.05,0l-7.33-2.27-7.66-2.37c-.28-.09-.49-.3-.58-.58-.08-.27-.02-.54,.14-.76l-1.58,.49c-2.93,.91-4.93,3.62-4.93,6.69v5.1c0,3.07,2,5.78,4.93,6.69l15.9,4.91c2.69,.83,5.57,.83,8.27,0l15.9-4.91c2.93-.91,4.93-3.62,4.93-6.69v-5.1c0-3.07-2-5.78-4.93-6.69Z" />
                <path id="d" className={clsE} d="M34.5,18.11h0l5.08,21.55-13.32-13.32-5.08-5.08,13.32-3.15Z" />
                <circle className={clsE} cx="45.86" cy="27.47" r="4" />
              </g>
            </g>
            <g>
              <path className={clsF}
                d="M117.23,25.58c-2.24-2.98-4.88-3.27-6.25-3.27-4.02,0-5.28,2.53-5.28,4.48,0,.92,.29,1.78,1.2,2.58,.92,.86,2.18,1.32,4.59,2.18,2.98,1.03,5.8,2.07,7.75,3.84,1.72,1.55,3.27,4.13,3.27,8.03,0,7.46-5.39,12.57-13.31,12.57-7.06,0-11.19-4.3-13.2-7.23l4.88-4.65c1.84,3.73,5.34,5.11,8.03,5.11,3.39,0,5.91-2.07,5.91-5.28,0-1.38-.46-2.47-1.49-3.44-1.44-1.32-3.73-2.07-5.91-2.81-2.01-.69-4.42-1.61-6.37-3.33-1.26-1.09-3.04-3.21-3.04-7.12,0-5.62,3.79-11.25,12.28-11.25,2.41,0,6.94,.46,10.85,4.48l-3.9,5.11Z" />
              <path className={clsF}
                d="M134.43,16v24.91l8.89-8.67h8.67l-11.14,10.43,12.02,13.33h-8.89l-8.83-10.15-.71,.66v9.49h-6.69V16h6.69Z" />
              <path className={clsF}
                d="M198.48,32.73h6.35v22.54h-6.35v-2.92c-2.29,3.28-5.31,3.64-6.92,3.64-6.92,0-11.51-5.41-11.51-12.03s4.53-11.97,11.19-11.97c1.72,0,5.1,.31,7.24,3.64v-2.91Zm-11.87,11.24c0,3.59,2.6,6.4,6.25,6.4s6.25-2.81,6.25-6.4-2.6-6.35-6.25-6.35-6.25,2.76-6.25,6.35Z" />
              <path className={clsF}
                d="M209.56,32.75h6.55v3.01c1.24-1.72,3.44-3.76,7.2-3.76,2.04,0,5.05,.59,6.87,2.85,1.61,1.99,1.83,4.3,1.83,6.55v14.6h-6.55v-12.67c0-1.29-.05-3.33-1.23-4.56-1.02-1.07-2.42-1.18-3.06-1.18-1.72,0-3.06,.59-4.03,2.04-.97,1.5-1.02,3.17-1.02,4.51v11.87h-6.55v-23.25Z" />
              <g>
                <path className={clsF} d="M162.85,32v24h-6.76v-24h6.76Z" />
                <path className={clsG}
                  d="M159.47,16c1.85,0,3.38,1.53,3.38,3.38s-1.53,3.38-3.38,3.38-3.38-1.53-3.38-3.38,1.53-3.38,3.38-3.38Z" />
              </g>
              <g>
                <path className={clsF} d="M175.33,32v24c0,8-6.76,8-6.76,8V32h6.76Z" />
                <path className={clsG}
                  d="M171.95,16c1.85,0,3.38,1.53,3.38,3.38s-1.53,3.38-3.38,3.38-3.38-1.53-3.38-3.38,1.53-3.38,3.38-3.38Z" />
              </g>
            </g>
          </g>
        </g>
      </g>
    </SvgIcon>
  )
}
