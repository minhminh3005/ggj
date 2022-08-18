import { Injectable, NestMiddleware } from '@nestjs/common'
import {
  ACCESS_TOKEN_SIG_COOKIE,
  REFRESH_TOKEN_SIG_COOKIE,
} from '../app.constants'

@Injectable()
export class LogoutMiddleware implements NestMiddleware {
  private readonly skjDomain = process.env.SKJ_DOMAIN
  private readonly accountHostUrl = process.env.ACCOUNT_HOST_URL

  async use(req: any, res: any): Promise<any> {
    res.clearCookie(ACCESS_TOKEN_SIG_COOKIE, { domain: this.skjDomain })
    res.clearCookie(REFRESH_TOKEN_SIG_COOKIE, { domain: this.skjDomain })
    return res.redirect(`${this.accountHostUrl}/logout`)
  }
}
