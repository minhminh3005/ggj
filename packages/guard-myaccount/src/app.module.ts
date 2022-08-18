import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { HttpModule } from '@nestjs/axios'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { PubSubService } from './services/pub-sub.service'
import { AuthenticationMiddleware } from './middlewares/authentication.middleware'

@Module({
  imports: [HttpModule],
  providers: [PubSubService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    if (process.env.ENV == 'local') {
      consumer
        .apply(
          createProxyMiddleware({
            target: process.env.MYACCOUNT_GUI_URL,
            ws: true,
          }),
        )
        .forRoutes('/_next/webpack-hmr')
    }

    consumer
      .apply(
        AuthenticationMiddleware,
        createProxyMiddleware({
          target: process.env.MYACCOUNT_GUI_URL,
        }),
      )
      .forRoutes('/')
  }
}
