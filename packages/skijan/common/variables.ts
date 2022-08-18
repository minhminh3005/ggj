export const validEmail = new RegExp(
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
)
/* validPassword:
    password >= 6 letters
    password must be only letter and numbers
    password is Case Sensitive (has at least 1 capital letter)
*/
export const validPassword = new RegExp(
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{6,}$/
)
export const imgRegex = /<img[^>]*id=[^>]*">/g
// eslint-disable-next-line no-useless-escape
export const ytRegExp = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|v\/)?)([\w\-]{11})(?:(?:[\?&](t|ab_channel)=)(\S+))?.*/
export const ytRegExpForStart = /^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s)?$/
export const auPayload = 'au-payload'
