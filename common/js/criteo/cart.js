// OAM-17509
import wrapper from './wrapper'
import {criteoFilter} from "./helper"

async function criteo() {
    let bn = this.$store.state.cart01.data.buyNow, item = [], ids = []
    // init item
    bn.forEach(e => {
      let pro = e.priceId ? e.prices.find(e1 => e1.id == e.priceId) : e.product,
        pId = e.priceId ? pro.productId : pro.id
      item.push({
        quantity: e.count,
        price: pro.price || 0,
        id: `P${pId}`,
        pId
      })
      ids.push(pId)
    })
    // filter criteo process
    ids = (await criteoFilter.call(this, { ids }))
    item = item.filter(i => ids.includes(i.pId)).map(i => {
      delete i.pId
      return i
    })

    return item.length ? { event: 'viewBasket', item } : null
}

export default function() {
  wrapper(criteo.bind(this))
}
