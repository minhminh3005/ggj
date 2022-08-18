import { getConfigs, setEnvVariables } from '@ggj/configs'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import helmet from 'helmet'

const PORT = 8919

function security(app) {
  app.use(
    helmet.dnsPrefetchControl({
      allow: true,
    }),
  ) // controls browser DNS prefetching
  app.use(
    helmet.frameguard({
      action: 'sameorigin',
    }),
  ) // to prevent clickjacking
  app.use(helmet.hidePoweredBy()) // to remove the X-Powered-By header
  app.use(helmet.ieNoOpen()) // sets X-Download-Options for IE8+
  app.use(helmet.noSniff()) // to keep clients from sniffing the MIME type
}

async function bootstrap() {
  const value = await getConfigs(true)
  setEnvVariables(value)

  const logger: any[] = ['error', 'warn', 'debug'].concat(
    process.env.ENV != 'production' ? ['log'] : [],
  )

  const app = await NestFactory.create(AppModule, {
    logger,
    bodyParser: false,
  })
  // apply security helmet
  security(app)

  app.use(cookieParser())
  app.use(
    morgan(
      ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :response-time ms :res[content-length] ":referrer" ":user-agent"',
      {
        skip: function (req) {
          return req.originalUrl.startsWith('/health') || req.method == 'GET'
        },
      },
    ),
  )

  // Health check path
  app.use('/health', (req, res) => {
    res.sendStatus(200)
  })

  await app.listen(PORT)
  console.log(`server listening at: http://localhost:${PORT}/`)
}

bootstrap()
