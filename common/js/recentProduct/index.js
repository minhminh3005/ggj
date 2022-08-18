import { PAGELISTMAP } from '@@/../common/assets/consts/product'

export function addRecentRecordLocal(data) {
    const result = data.reduce((acc, item) => {
        const keyIdx = `${item.id}_${item.bht}`
        acc[keyIdx] = item
        return acc
    }, {})
    localStorage.setItem('rP', JSON.stringify(result))
}

export function getExistRecentProductLocals() {
    try {
        const getRecentProduct = localStorage.getItem('rP')
            ? JSON.parse(localStorage.getItem('rP'))
            : {}
        const arrayRecentProducts = Object.values(getRecentProduct)
        return arrayRecentProducts.length ? arrayRecentProducts.sort( function(a, b) {
            return a.t - b.t
        }) : []
    } catch (e) {
        localStorage.removeItem('rP')
        return  []
    }
}

function generateData(productId, bht) {
    const existItem = getExistRecentProductLocals()
    if (!productId || !bht) {
        return existItem
    }
    const data = {
        id: productId,
        bht: bht,
        t: Math.floor(Date.now() / 1000), // second
    }
    if (!existItem.length) {
        return [data]
    }
    const removeOldData = existItem.filter(item => item.id !== productId)
    // add new
    const newData = removeOldData.concat(data)
    return newData.length > 10 ? newData.slice(newData.length - 10) : newData
}

export default async function() {
    const userId = this.$store.state.user.id
    const productId = this.$route.params.id || 0
    const browsingHistoryType =
        this.$route.name === 'tools-type-id' // check tool type mobile
            ? (this.$route.params.type  || '')
            : (this.$route.name || '')
    const bht = PAGELISTMAP[browsingHistoryType] || 0
    if (bht) {
        if(userId) {
            // login
            const data = [{
                id: productId,
                bht: bht,
                t: Math.floor(Date.now() / 1000), // second
            }]
            try {
                return this.GoGoHTTP.post('/api/v3/recent-views', {
                    data
                }).catch(function (error) {
                    console.log(error)
                }).finally(() => {
                    localStorage.removeItem('rP')
                })
            } catch (e) {
                console.log('Error Post recent product')
            }
        }else {
            const data = generateData(productId, bht)
            if (!data.length) {
                return
            }
            // no login
            addRecentRecordLocal(data)
        }
    }
}
