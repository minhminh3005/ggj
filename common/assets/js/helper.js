export function urlify(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g
    return (text || '').replace(urlRegex, function(url) {
        return '<a href="' + url + '">' + url + "</a>"
    })
}

export function urlifyOutsideATag(text) {
    const urlRegex = /((https?|ftps?):\/\/[^"<\s]+)(?![^<>]*>|[^"]*?<\/a)/g
    return (text || '').replace(urlRegex, function(url) {
        return '<a target="_blank" href="' + url + '">' + url + "</a>"
    })
}

// https://gogojungle.backlog.jp/view/OAM-74072
// Special characters have been replaced by a hexadecimal escape sequence
export function urlEscapeSpecialCharacter(text) {
    // eslint-disable-next-line no-useless-escape
    const urlRegex = /[-!$%^&*()_+|~=`{}\[\]:\/;<>?,.@#]/g
    return (text || '').replace(urlRegex, function(spChar) {
        return escape(spChar)
    })
}

/**
 * Get translated messages from parent. Support getting messages from 2 parent levels
 * @param key
 * @returns {string}
 */
export function t(key) {
    // back to level 1
    let messages =  this.$parent.$i18n.messages
    // back to level 2
    if (!messages.ja) messages = this.$parent.$parent.$i18n.messages
    const localeMessages = messages[this.$i18n.locale || 'ja'] || {}
    return localeMessages[key] || key
}