export interface IProduct {
  titleProduct: string
  date? : number
  productId: number
  totalProfit?: number
  totalSales?: number
  imageUrl : string
}

export interface ISales {
  generalSales: {
    totalSales: number
    totalProfit: number
  }
  hotSales: {
    hotProduct: IProduct
    bestProfit: IProduct
  }
  monthlyHotSales: {
    bestProfits: IProduct[]
    hotProducts: IProduct[]
  }
}

export interface IMonthlyData {
  id: number
  date: number
  profit: number
  buyer: string
  titleProduct: string
  optionName: string
  saleType: number
}

export interface IMonthlySummary {
  generalSales: {
    totalSales: number
    totalProfit: number
  }
  months: number[]
  detailSales: {
    data: IMonthlyData[]
    pagingMeta: {
      page: number
      limit: number
      totalItem: number
      totalPage: number
      hasPreviousPage: boolean
      hasNextPage: boolean
    }
  }
}
