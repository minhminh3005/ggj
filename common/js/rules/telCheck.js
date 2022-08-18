const telCheck = {
  messages: {
    en: () => ''
  },
  validate(value) {
    let tel = value.toString(),
    telErr = true
    tel = tel.replace('+', '')
    tel = tel.split('-')
    if (tel.length > 4) {
      telErr = false
    }
    tel = tel.join('')
    const len = tel.length
    if (len > 12 || len < 10 || !/^\d+$/.test(tel)) {
      telErr = false
    }
    return telErr
  },
}

export default telCheck