import { decrypt } from '@@/../utils/crypto'

function setAIDCookie(res, val) {
  const unixTimeNow = Date.now()
  const now = new Date(unixTimeNow + 2592000000)
  let cookieOpts = {
    path: '/',
    httpOnly: true,
    expires: now, // 30 days
  }
  res.cookie('aid', val, cookieOpts)
  res.cookie('aidt', unixTimeNow, {
    ...cookieOpts,
    domain: process.env.GOGO_DOMAIN
  })
}

export default function({ req, res, error }) {
  if (req && req.query.auxTag) {
    const aidCookie = req.cookies['aid'] || ''
    const refCookie = req.cookies['ref'] || ''

    const enTag = req.query.auxTag
    try {
      const deAuxiliryTag = decrypt(enTag)
      const seperateCharacterIndex = deAuxiliryTag.indexOf('_')
      const aid = parseInt(deAuxiliryTag.substr(0, seperateCharacterIndex + 1))
      const referer = deAuxiliryTag.substr(seperateCharacterIndex + 1)

      if (aid !== aidCookie){
        setAIDCookie(res, aid)
      }
      if (referer !== refCookie)
        res.cookie('ref', referer, {
          path: '/',
          httpOnly: true,
          expires: new Date(Date.now() + 2592000000), // 30 days
        })
    } catch (e) {
      return error({ statusCode: 404 })
    }
  }
  // OAM-19449: force to override aid cookie
  if (req && req.query.utm_source) {
    res.clearCookie('ref') //OAM-22123: delete ref cookie with utm_source parameter
    setAIDCookie(res, 1)
  }

  // Forced affiliate user to GGJ (120001) with src parameter
  // https://gogojungle.backlog.jp/view/OAM-28291
  if (req && req.query.src) {
    setAIDCookie(res, 1)
  }
}
