interface TBaseError {
  error?: string
  message?: string
}

type TEventData = {
  req: any
  res: any
  next: any
}

type TAuthPayload = {
  uid: number
  uname: string
}

type TToken = {
  ats: string
  rts: string
}

type TRefreshTokenResult = {
  token: TToken
  userData: TAuthPayload
}

type TRefreshTokenResponse = {
  error?: string
  data: TRefreshTokenResult
}

type TRedirectResponse = {
  statusCode: 401
  url: string
}
