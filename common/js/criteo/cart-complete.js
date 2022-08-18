// OAM-17509
import wrapper from './wrapper'
import {criteoFilter} from './helper'

async function criteo() {
  let bn = this.data.trackTransaction || [], item = [], ids = []
  // init item
  bn.forEach(e => {
    item.push({
      quantity: e.quantity,
      price: e.price || 0,
      id: e.id,
    })
    ids.push(`${e.id || ''}`.replace('P', ''))
  })
  // filter criteo process
  ids = (await criteoFilter.call(this, { ids }))
  item = item.filter(i => ids.includes(+i.id.replace('P', '')))

  return item.length ? { event: 'trackTransaction', id: this.data.sessionId, item } : null
}
export default function() {
  wrapper(criteo.bind(this))
}

export function retryWrapper(cb) {
  let error = {}

  for (let i = 0; i < 3; i++) {
    try {
      cb()
      break
    } catch (err) {
      error = err
    }
  }
  console.log(error)
}
