import { Stack, Typography} from '@mui/material'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { memo } from 'react'
import Image from 'next/image'
import banner from 'components/pages/index/skjTopIllustration_01.png'
import Link from 'next/link'
interface SkjBannerProps<T> {
  content: T
  id: number
  title: T
  url: T
  imageUrl: T
  background: T
}
const ContentComponent = ({listSkjBanner}: {listSkjBanner: SkjBannerProps<string>[]}) => {
  const theme = useTheme()
  return (
    <Stack css={css`
    position: relative;
    padding: 8px 24px 16px 24px;
    width: 100%;
    flex-direction: row;
    border-radius: 0.5rem;
    background-color: ${listSkjBanner[0].background === null ? theme.palette.primary.main : listSkjBanner[0].background};`}
    justifyContent='space-between'
    flexWrap='wrap'
    alignItems='flex-start'>
      <Stack justifyContent='flex-start' alignItems='center' direction='column'>
        <Typography css={css`
        color: white;
        width: 100%;
        font-size: 34px;
        @media screen and (min-width: ${theme.breakpoints.values.md}px) {
          font-size: 48px;
        }`}>{listSkjBanner[0].title}</Typography>
        <span css={css`
            color: white;
            font-size: 16px;
            cursor: pointer;
            max-width: 500px;
            width:100%;
            @media screen and (min-width: ${theme.breakpoints.values.lg}px) {
              max-width: 550px;
            }`}>
          {listSkjBanner[0].content}
        </span>
      </Stack>
      <div css={css`padding-top: 14px;max-width: 320px`} >
        <Image objectFit='contain' alt='ImageBannerSkjian' css={css`
          margin: auto;
          @media screen and (min-width: ${theme.breakpoints.values.md}px) {
            margin: unset
          }`} src={banner} />
      </div>
    </Stack>
  )
}
const TopBanner = ({listSkjBanner}: {listSkjBanner: SkjBannerProps<string>[]}) => {

  return (
    listSkjBanner[0]?.url ? <Link href={listSkjBanner[0].url} passHref>
      <a css={css`text-decoration: none;`} target='_blank'>
        <ContentComponent listSkjBanner={listSkjBanner} />
      </a>
    </Link> : <ContentComponent listSkjBanner={listSkjBanner} />
  )
}
export default memo(TopBanner)
