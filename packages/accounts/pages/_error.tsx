import NextErrorComponent from 'next/error'
import hookRender from 'modules/hook-render'
import { NextPage } from 'next'
import { NextPageContext } from 'next'

interface Props {
  userAgent?: string
  statusCode: number
}

const MyError: NextPage<Props> = (ctx) => {
  const statusCode: number = ctx.statusCode
  return <NextErrorComponent statusCode={statusCode} />
}

MyError.getInitialProps = (ctx: NextPageContext) => {
  const { err, req, res } = ctx
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404

  // if the error is status http 500, send slack
  if (statusCode === 500) {
    hookRender(err, req)
  }

  // other http status code
  return NextErrorComponent.getInitialProps(ctx)
}

export default MyError
