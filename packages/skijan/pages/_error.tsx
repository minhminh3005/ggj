import { SurfaceLayout, nsTranSurfaceLayout } from 'components/layouts'
import { css } from '@emotion/react'
import image500 from 'components/pages/500.png'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import Image from 'next/image'
import {i18n} from 'next-i18next'

import hookRender from 'modules/hook-render'
import NextErrorComponent, { ErrorProps } from 'next/error'
import { NextPageContext } from 'next'

const Error500Component = () => {
  const theme = useTheme()
  const errorMessage = {
    title: 'Oops...Something went wrong.',
    content: 'Sorry for the inconvenience, we are working on it.'
  }
  return <Stack justifyContent='center' alignItems='center' direction='column' css={css`
  background-color: ${theme.palette.smoke.light};
  width: 100%;
  padding: 0 16px;
  height: 100vh;`}>
    <div css={css`
    width: 240px;
    height: 240px;
    @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
      width: 300px;
      height: 300px;
    }`}>
      <Image objectFit='contain' src={image500} alt='404ErrorSkjian' />
    </div>
    <Typography css={css`
    margin: 24px 0 16px 0;
    color: ${theme.palette.jade.dark};
    font-size: 16px;
    font-weight: bold;
    @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
      font-size: 24px;
      margin-bottom: 27px;
    }`}>{errorMessage.title}</Typography>
    <Typography css={css`
      margin-bottom: 41px;
      text-align: center;
      color: ${theme.palette.jade.dark};
      line-height: 20px;
    `} variant='subtitle2'>{errorMessage.content}</Typography>
  </Stack>
}
function MyError() {
  for (const ns of  nsTranSurfaceLayout)
  {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const  json =  require(`lang/ja/${ns}.json`)
    i18n?.addResourceBundle('ja', ns,json)
  }
  return <Error500Component/>
}

export const getServerSideProps = async (ctx: NextPageContext) => {
  const {err, req} = ctx
  const props = NextErrorComponent.getInitialProps(ctx) as ErrorProps
  const statusCode = props.statusCode

  // if the error is status http 500, send slack
  if (statusCode === 500) {
    hookRender(err, req)
  }

  return {props: {}}
}

MyError.Layout = SurfaceLayout
export default MyError
