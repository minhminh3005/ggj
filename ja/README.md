# Development environment
## For gui-sf-ja development
For speed up development:

Disable build mobile if any `ja/index.js`
```js
BEFORE
const promise = Promise.all([
  isLocal() ? new Builder(nuxtMobile).build() : isReady(nuxtMobile),
  isLocal() ? new Builder(nuxtDesktop).build() : isReady(nuxtDesktop),
])

AFTER
const promise = Promise.all([
  !isLocal() ? new Builder(nuxtMobile).build() : isReady(nuxtMobile),
  isLocal() ? new Builder(nuxtDesktop).build() : isReady(nuxtDesktop),
])
```

Remove redundant pages at `ja/desktop/pages`. Do the same in case also building mobile.\
You should move for another git changelist for easy manage. Git changelist's.

> **_NOTE:_**  this is temporary fix & you must revert it back when committing

```
$ yarn start
```

# Production environment
## Prerequisite
Install pm2 `sudo npm i -g pm2`\
Install pm2-logrotate with normal user: `pm2 install pm2-logrotate`\
Config pm2-logrotate:
```
pm2 set pm2-logrotate:max_size 500M
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat "YYYY-MM-DD_HH-mm-ss"
```
## Run
Run `$ npm run build:prod`
`$ npm run run:prod`

## Build staging mode at local
Modify `utils/dev.js`

```
BEFORE
function isLocal() {
  return !['production', 'staging'].includes(process.env.ENV)
}

AFTER
function isLocal() {
  return ['production', 'staging'].includes(process.env.ENV)
}
```

Modify `.env.yaml`

```
...
NODE_ENV: staging
...
```

Run
```
$ yarn aws:build
$ yarn aws
```

## Responsive a page

Go to `ja/desktop/layouts/default.vue`
Add page to `isSupportResponsive`