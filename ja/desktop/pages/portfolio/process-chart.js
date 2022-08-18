function processChart(dataChart, dec = {}) {
    let lData = [],
      tData = [],
      l1 = [],
      l2 = [],
      ls = {},
      dd = 0,
      lastD = 0,
      portIncrease = 0,
      maxPortIncrease = 0,
      maxPortDD = 0,
      profitFactor = 0,
      winningRate = 0,
      recovery = 0,
      avgProfit = 0,
      objChart = {}

    for (let i in dataChart) {
      let baseLots = dataChart[i].baseLots,
      unit = dataChart[i].unit,
      lot = typeof dec[i] === 'number' ? dec[i] : 0.1
      
      let diameter = lot / baseLots * unit

      if(!baseLots || !unit) diameter = lot

      let oData = dataChart[i].data
      ls[i] = []
      for (let j in oData) {
        let tmp = oData[j]
        tmp.b *= diameter
        tmp.e *= diameter

        // line chart
        ls[i].push([tmp.t, Math.round(tmp.b, 2)])

        // sum b if same t
        if (objChart[tmp.t] == undefined) {
          objChart[tmp.t] = 0
        }
        objChart[tmp.t] += tmp.b || 0
      }
      lData = lData.concat(oData)
      tData = tData.concat(dataChart[i].totalData)
    }

    tData = tData.reduce(
      (res, val) => {
        res.GrossLoss += parseFloat(val.GrossLoss)
        res.GrossProfit += parseFloat(val.GrossProfit)
        res.ProfitTotal += parseFloat(val.ProfitTotal)
        res.ProfitTrades += parseInt(val.ProfitTrades)
        res.TradesTotal += parseInt(val.TradesTotal)
        return res
      },
      {
        GrossLoss: 0,
        GrossProfit: 0,
        ProfitTotal: 0,
        ProfitTrades: 0,
        TradesTotal: 0,
      }
    )
    lData.sort((a, b) => {
      return a.t - b.t
    })

    if(lData.length) {      
      for (let k in lData) {
        let tmp1 = lData[k]
        
        // l1 gain/loss portfolio line
        // l2 portfolio line
        if (lastD !== tmp1.t) {
          l1.push([tmp1.t, Math.round(tmp1.b, 2)])
          l2.push([tmp1.t, Math.round(tmp1.b + tmp1.e, 2)])
        } else {
          l1[l1.length - 1][1] += Math.round(tmp1.b, 2)
          l2[l2.length - 1][1] += Math.round(tmp1.b + tmp1.e, 2)
        }
        lastD = tmp1.t
      }
    }

    let ock = Object.keys(objChart)
    maxPortDD = objChart[ock[1]] - objChart[ock[0]],
    maxPortIncrease = objChart[ock[0]]

    if(ock.length) {
      for (let i = 2, l = ock.length; i < l; i++) {
        portIncrease = objChart[ock[i]]
        if (maxPortIncrease < portIncrease) {
          maxPortIncrease = portIncrease
        }
        dd = maxPortIncrease - portIncrease
        if (maxPortDD < dd) {
          maxPortDD = dd
        }
      }
    }

    // calculator summary
    if (tData.GrossLoss !== 0) {
      profitFactor = parseFloat((tData.GrossProfit / tData.GrossLoss) * -1).toFixed(2)
    }
    if (tData.TradesTotal !== 0) {
      winningRate = parseFloat((tData.ProfitTrades / tData.TradesTotal) * 100).toFixed(2)
      avgProfit = Math.round(portIncrease / tData.TradesTotal, 0)
    }
    if (maxPortDD !== 0) {
      recovery = parseFloat(portIncrease / maxPortDD).toFixed(2)
    }

    return [
      l1,
      l2,
      ls,
      {
        portIncrease,
        maxPortIncrease,
        maxPortDD,
        profitFactor,
        winningRate,
        recovery,
        avgProfit,
      },
    ]
}

export default processChart