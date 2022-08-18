import { Typography, Divider } from '@mui/material'
import { css } from '@emotion/react'
import {useRouter} from 'next/router'
import {useLayoutContext} from 'contexts/LayoutContext'
import {useEffect} from 'react'
const Heading = ({ title, showTitle }: { title: string , showTitle?: boolean}) => {
  const router = useRouter()
  const { updateLayoutSetting } = useLayoutContext()

  useEffect(()=> {
    updateLayoutSetting({
      title: title,
      onBack: () => router.push('/')
    })
  },[])

  return (
    <>
      {showTitle && <div
        css={css`
        margin-bottom: 24px;
      `}
      >
        <Typography
          variant="h5"
          component="h1"
          css={css`
          font-weight: bold;
        `}
        >
          {title}
        </Typography>
        <Divider />
      </div>
      }
    </>
  )
}

export default Heading
