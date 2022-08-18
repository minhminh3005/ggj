export function setCookie(
  name: string,
  value = '',
  expiredInMinutes = 24 * 60,
  path = '/',
  domain?: string,
) {
  if (typeof window === 'undefined') {
    return
  }
  const date = new Date()
  date.setTime(date.getTime() + expiredInMinutes * 60 * 1000)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=${path}; ${domain ? `domain=${domain}` : ''}`
}

/**
 * Debounce function, call once after timeout
 * will reset & re-wait timeout in case re-call before timeout
 * @param fn callback function
 * @param wait in milliseconds
 * @returns {(...args: any) => void}
 */
export function ggjDebounce(fn: any, wait: number) {
  let timerId: any, lastArguments: any, lastThis: any
  return (...args: any) => {
    timerId && clearTimeout(timerId)
    lastArguments = args
    //@ts-ignore
    lastThis = this
    timerId = setTimeout(function() {
      fn.apply(lastThis, lastArguments)
      timerId = null
    }, wait || 400)
  }
}
