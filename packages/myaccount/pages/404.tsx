import NextErrorComponent from 'next/error'

export default function MyError() {
  return <NextErrorComponent statusCode={404} />
}
