interface TBaseError {
  error?: string
  message?: string
}

type TEventData = {
  req: any
  res: any
  next: any
}

type TUserPayloadData = {
  uid: number
  uname: string
  clientId: string
}

type TAuthPayload = {
  uid: number
  uname: string
}

type TToken = {
  ats?: string
  rts: string
}

type TRefreshTokenResult = {
  token: TToken
  userData: TUserPayloadData
}

type TRefreshTokenResponse = {
  error?: string
  data: TRefreshTokenResult
}

type TRedirectResponse = {
  statusCode: 401
  url: string
}

type TInvalidAccessTokenHandlerData = {
  refreshTokenSignature: string
  req: Request
  res: Response
  next: (error?: any) => void
  isDeleteEventCache?: boolean
}
