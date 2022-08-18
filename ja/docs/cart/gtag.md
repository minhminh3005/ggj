# Add gtag event
https://gogojungle.backlog.jp/view/OAM-35654 \
it will be configured at ja/nuxt.config.js
```js
{
  src: '@@/../common/plugins/gtag.js',
  ssr: false,
}
```
## /cart
1. User login\
Add to cart

2. User not login\
Add to cart\
Login with exist account

3. User not login\
Add to cart /finance/salons/8812\
Register new account
