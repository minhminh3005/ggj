import { SELLER_BOX_DISPLAY_PATH_REG } from '@@/../utils/constants'
export async function getUserInfo(app, path){
  try{
    if (SELLER_BOX_DISPLAY_PATH_REG.test(path) && !path.startsWith('/finance')){
      return {}
    }
    return await app.GoGoHTTP.get('/api/v3/surface/user')
  }catch (e) {
    console.error(e)
    return {}
  }
}