# A. GUI-AUTH
## How to start
### Development mode
```
$ cd packages/accounts
$ yarn start
```
### Staging/production mode
```
$ cd packages/accounts
$ yarn aws:build
$ yarn aws
```

## Features
  - [x] Use AWS AppConfig
    ```
    packages\accounts\bin\config.js
    ```
  - [x] Global error & send slack
    At `packages\accounts\pages\_error.tsx`, invoke the function `hookRender` like the below.

    ```
    interface Props {
      userAgent?: string
      statusCode: number
    }

    const MyError: NextPage<Props> = (ctx) => {
      const statusCode: number = ctx.statusCode
      return <NextErrorComponent statusCode={statusCode} />
    }

    MyError.getInitialProps = async (ctx: NextPageContext) => {
      const errorInitialProps = await NextErrorComponent.getInitialProps(ctx)
      const { err, req, res } = ctx
      const statusCode = res ? res.statusCode : err ? err.statusCode : 404

      // if the error is status http 500, send slack
      if(statusCode === 500) {
        hookRender(err, req)
      }

      // other http status code
      return errorInitialProps
    }

    export default MyError

    ```
  - [x] [Material UI](https://mui.com/)
    - Setting breakpoint at `packages\accounts\pages\_app.tsx`.
  - [x] GGJ's config `next.config.js`\
    Default `serverRuntimeConfig` contains all configs
    ```
    module.exports = {
      publicRuntimeConfig: {
        // Will be available on both server and client
        MYSECRET: env.MYSECRET,
      },
    }
    ```
    - How to use
    ```
    import getConfig from 'next/config'
    import Image from 'next/image'

    // Only holds serverRuntimeConfig and publicRuntimeConfig
    const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

    // Will only be available on the server-side
    console.log(serverRuntimeConfig.mySecret)

    // Will be available on both server-side and client-side
    console.log(publicRuntimeConfig.staticFolder)

    function MyImage() {
      return (
        <div>
          <Image
            src={`${publicRuntimeConfig.staticFolder}/logo.png`}
            alt="logo"
            layout="fill"
          />
        </div>
      )
    }

    export default MyImage
    ```
    - Docs refernce: https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration
  - [x] [Default alias](https://www.typescriptlang.org/tsconfig#paths)
  - [x] GGJ's axios
    - Auto append request header
      ```
      packages\accounts\common\http.ts
      ```
    - Proxy `/api/*` to api

      At client, config at `packages\accounts\next.config.js`

      ```
      module.exports = {
        ...
        async rewrites() {
          return [
            {
              source: '/v1/:path*',
              destination: `${env.API_V1_HOST_URL}/v1/:path*` // Proxy to Backend
            }
          ]
        },
      }
      ```

      At server, map axios `baseURL` following this code below. (File: `packages\accounts\common\http.ts`)
      ```
      http.interceptors.request.use(
        config => {
          if(typeof window === 'undefined') { // if is in server
            if(config?.url?.startsWith('/v1')) {
              config.baseURL = process.env.API_V1_HOST_URL
            }
          }
          return config
        },
      )
      ```

    - [How to use]
      ```
      import { http } from 'common/http'
      async fn(): Promise<void|object> {
        await http.get('/api/v3/surface/top')
      }
      ```
  - [x] [Typescript](https://vuejs.org/v2/guide/typescript.html)
  - [ ] SEO: title, description,...
  - [x] health check `packages\accounts\index.js`
    ```
    ...
    server.get('/health', (req, res) => res.sendStatus(200))
    ...
    ```
  - [x] i18n `bin/i18n.js`
    - I18n Google sheets: https://drive.google.com/drive/folders/1HZldQXO1ij2O5IlBSI8zz2ClpOCWQJ0d?usp=sharing
    - How to use
    ```
    ...
    import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
    import { useTranslation } from 'next-i18next'
    const ns = 'common@index' // next18n namespace, file name is 'common', and sheet name is 'index'
    ...

    function Home() {
      const router = useRouter()
      const { t } = useTranslation(ns)
      return (
        <>
          <h1 className='mt-3 mb-5'>{t('change-locale')}</h1>
        </>
      )
    }

    export async function getServerSideProps(ctx: NextPageContext) {
      const req = ctx.req as (IncomingMessage & { cookies: any })
      return {
        props: {
          ...(await serverSideTranslations(
            req.cookies.lang || 'ja', // get lang from cookie, if it null, default is 'ja'
            [ns] // name space
          )
          ),
        },
      }
    }

    export default Home
    ```
  - [x] cookie-parser `packages\accounts\index.js`
  - [ ] modify 404 error page
  - [ ] modify 500 error page
  - [ ] how to use cookie?
    - Service side
    ```js
    TODO
    ```
    - Client side
    ```js
    TODO
    ```
  - [x] How to use [store](https://www.notion.so/ggjungle/How-to-write-React-efficiency-7375694fa89b4ff9b613a9d6718775b9#0062320eb6704659be874138db905d55)?
  - [x] How to use [emotion css](https://www.notion.so/ggjungle/How-to-write-React-efficiency-7375694fa89b4ff9b613a9d6718775b9#a39aba18ff294b7ea26cb1f0eca27b4b)?
  - [x] How to use [i18n](https://www.notion.so/ggjungle/How-to-write-React-efficiency-7375694fa89b4ff9b613a9d6718775b9#f52445624b4043e59761ba19a541c720)?
  - [x] How to use Loading Progress
    ``` 
    import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
    
    loadingOnHandler() or document.dispatchEvent(new CustomEvent('loadingOn')) to turn on loading
    loadingOffHandler() or document.dispatchEvent(new CustomEvent('loadingOff')) to turn off loading
    ```
  - [x] How to use Toast
    ```
     import { toastHandler } from 'contexts/ToastContext'
    ...
    toastHandler({ message:'', type: 'success' | 'error' | 'warning' })


    ```
## Related library
- https://emotion.sh/docs/introduction
- https://github.com/isaachinman/next-i18next

## Old skeleton version
The old version is using nuxtjs, this have been removed at [this commit](https://github.com/gogojungle/surface.gogojungle.co.jp/commit/216717ab15dbdf4d807da5c6f3a8e0216de1c382)

# B. Principles and code style guide
This document is a recommendation, that will help we code easier to maintain, easier to read. All contribute to improve the codebase and this README are welcome.
## Principles
  ### 1. Isolate code
  - The component should be as isolate as possible.
  - The CSS/JSX/JS, it should be contain all in one at component file.

  ### 2. Common components should be atomic
  - The common components should be as atomic as possible.
  - The "atomic" meaning simplest and isolatest, that not depend on the using place.
## Code style guide
  ### Priority A: Essential
  ### Priority B: Recommended
  1. Using media query with min-width, styling from small screen to larger screen. Example (in sass syntax):

      > BAD
      ```
      .ex-class {
        // ...css
        @media only screen and (max-width: 992px /* lg */) {
          // ...css for lg
        }
        @media only screen and (max-width: 768px /* md */) {
          // ...css for md
        }
        @media only screen and (min-width: 480px /* sm */) {
          // ...css for sm
        }
      }
      ```
      > GOOD
      ```
      .ex-class {
        // ...css for smallest screen (xs)
        @media only screen and (min-width: 480px /* sm */) {
          // ...css for sm
        }
        @media only screen and (min-width: 768px /* md */) {
          // ...css for md
        }
        @media only screen and (min-width: 992px /* lg */) {
          // ...css for lg
        }
      }
      ```

  2. CSS implement style
      We have about 3 type to css in the auth project
      - Using emotion (embed style tag in document, recommend for SSR styling)
      - Using [Built-In CSS Support](https://nextjs.org/docs/basic-features/built-in-css-support)
      - Using scss file

  3. How to show error? 
     - Application error
       - Internal server error (ECI500)
       - Permission error (???)
       - We will show app error like: internal error try again later
     - Business error: will show at input error or depend on spec

# C. Sitemap 
link: https://miro.com/app/board/uXjVOJmhu24=/
