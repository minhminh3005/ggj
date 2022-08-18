export const DELAY = process.env === 'production'
                        ? 3e5 /*5m*/ 
                        : 3e4 /*30s*/
export function broadcast(eventName, value, fromTabId = null) {
  localStorage.setItem('broadcast', JSON.stringify({ eventName, value, fromTabId, hash: Math.random() }))
}
