import {css} from '@emotion/react'
import React from 'react'

export default function SquareWrapper({children, className}: {children: JSX.Element, className?: string}) {
  return (
    <div css={css`width: 100%; padding-bottom: 100%; position: relative`}>
      <div
        css={css`
          position: absolute;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          border-radius: 10px;
        `}
        className={className}
      >
        {children}
      </div>
    </div>
  )
}
