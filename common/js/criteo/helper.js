export function criteoFilter({ ids, type }) {
  // ids: Array <number>
  // type: 0: productsId | 1: salonsId | 2: articlesId | 3: seriesId | 4: videosId | 5: eventsId
  // output: Array <number>

  return new Promise((rs, rj) => {
    this.GoGoHTTP.get('/api/v3/criteo', { 
      params: {
        ids: `${ids}`,
        type: type || 0
      },
    })
    .then(res => rs(res.criteoList || []))
    .catch(err => {
      console.log(err)
      rj([])
    })
  })
}
