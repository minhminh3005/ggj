import { Button, Link, Typography } from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'

import { Box } from '@mui/system'

export interface GgjIconButtonProps {
  icon: JSX.Element,
  content: string,
  path?: string,
  onClick?: () => void,
}

function GgjIconButton({item}: {item: GgjIconButtonProps}) {
  const theme = useTheme()

  return (
    <Link href={item.path} css={css`
      text-decoration: none;
    `}>
      <Button
        variant="outlined"
        fullWidth
        css={css`
          text-transform: none;
          height: ${theme.spacing(6)};
          align-items: center;
        `}
        onClick={item.onClick}
      >
        <Box css={css`
          width: ${theme.spacing(4)};
          height: ${theme.spacing(4)};
          position: absolute;
          left: ${theme.spacing(3)};`}
        >
          {item.icon}
        </Box>
        <Typography variant="body2"
          css={css`
            width: 100%;
            max-width: calc(100% - 60px);
            font-weight: 500;
            word-break: break-all;
          `}>{item.content}</Typography>
      </Button>
    </Link>
  )
}

export default GgjIconButton
