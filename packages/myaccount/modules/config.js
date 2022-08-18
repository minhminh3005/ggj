/* eslint-disable @typescript-eslint/no-var-requires */
const configs = require('@ggj/configs')

configs.getConfigs().then((config) => {
  // do nothing in local env
  if (process.env.ENV === 'local') {
    return
  }

  // create file ".env.yaml" at staging/production env
  const fs = require('fs')
  const path = require('path')
  const jsYaml = require('js-yaml')
  fs.writeFileSync(path.join(process.cwd(), '.env.yaml'), jsYaml.dump(config))
})
/* eslint-enable @typescript-eslint/no-var-requires */
