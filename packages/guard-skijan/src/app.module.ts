import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { PubSubService } from './services/pub-sub.service'
import { HttpModule } from '@nestjs/axios'
import { createProxyMiddleware } from 'http-proxy-middleware'
import { AuthenticationMiddleware } from './middlewares/authentication.middleware'
import { LogoutMiddleware } from './middlewares/logout.middleware'

@Module({
  imports: [HttpModule],
  providers: [PubSubService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LogoutMiddleware).forRoutes('/logout')
    if (process.env.ENV == 'local') {
      consumer
        .apply(
          createProxyMiddleware({
            target: process.env.SKJ_GUI_URL,
            ws: true,
          }),
        )
        .forRoutes('/_next/webpack-hmr')
    }
    consumer
      .apply(
        AuthenticationMiddleware,
        createProxyMiddleware({
          target: process.env.SKJ_GUI_URL,
        }),
      )
      .forRoutes('/')
  }
}
