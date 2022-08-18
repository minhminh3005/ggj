import {getExistRecentProductLocals} from "./index"

export default async function() {
    const data = getExistRecentProductLocals()
    if (!data.length) {
        return
    }
    try {
        return this.GoGoHTTP.post('/api/v3/recent-views', {
            data
        }).catch(function (error) {
            console.log(error)
        }).finally(() => {
            localStorage.removeItem('rP')
        })
    } catch (e) {
        console.log('Error Sync recent product')
        console.log(e)
    }
}
