import { PAGELISTMAP } from '@@/../common/assets/consts/product'

export default async function() {
  const browsingHistoryType =
  this.$route.name === 'tools-type-id' // check tool type mobile
      ? (this.$route.params.type  || '')
      : (this.$route.name || '')
  const bht = PAGELISTMAP[browsingHistoryType] || 0
  // check only work for detail product page
  if(bht) {
    let id = this.$route.name === 'finance-navi-index-articles-id' || this.$route.name === 'finance-navi-index-series-id'
    ? window.productId
    : this.$route.params.id
    window.ggjGtmDataLayer(id)
  }
}