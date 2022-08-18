(async function buildMenuData() {
  /* eslint-disable @typescript-eslint/no-var-requires */
  const fs = require('fs')
  const path = require('path')
  const axios = require('axios')
  const configs = require('@ggj/configs')
  /* eslint-enable @typescript-eslint/no-var-requires */
  console.log('============ Build menu begin')
  try {
    const fileDir = path.resolve('./components/layouts/common')
    const filePath = path.join(fileDir, 'menu-data.json')
    const filterFilePath = path.join(fileDir, 'menu-data-extend.json')
    if(process.env.ENV === 'local' && fs.existsSync(filePath) && fs.existsSync(filterFilePath)) {
      console.log('menu-data.json existed.')
    } else {
      const resEnv = await configs.getConfigs()
      const resMenuData = await axios.get('api/skijan/v1/app/menu', {baseURL: resEnv.SKIJAN_API_URL})
      !fs.existsSync(fileDir) && fs.mkdirSync(fileDir)
      fs.writeFileSync(path.join(fileDir, 'menu-data-extend.json'), JSON.stringify(resMenuData.data.data.filter(item => item.forSaleGgj == 1)))
      fs.writeFileSync(path.join(fileDir, 'menu-data.json'), JSON.stringify(resMenuData.data.data.filter(item => item.forSaleGgj !== 1)))
      console.log('menu-data.json created.')
    }
    console.log('============ Build menu end')
  } catch(e) {
    console.log(e)
    process.exit(1)
  }
})()
