import http, {appendGgjHeader} from 'common/http'
import {NextRequest} from 'next/server'
import {ISales} from 'components/pages/mypage/sales/interfaces'
import {createSlice, PayloadAction} from '@reduxjs/toolkit'
import {HYDRATE} from './reduxWrapper'

export const ns = 'salesSlice'

type initialStateType = {
  salesData: ISales
}

const salesData: ISales = {
  generalSales: {
    totalSales: 0,
    totalProfit: 0
  },
  hotSales: {
    hotProduct: {
      imageUrl: '',
      totalSales: 0,
      productId: 0,
      titleProduct: ''
    },
    bestProfit: {
      imageUrl :'',
      totalProfit: 0,
      productId: 0,
      titleProduct: ''
    }
  },
  monthlyHotSales: {
    bestProfits: [],
    hotProducts: []
  }
}

const initialState: initialStateType = {
  salesData,
}

const slice = createSlice({
  name: ns,
  initialState,
  reducers: {
    setSalesData: (state, action: PayloadAction<ISales>) => {
      state.salesData = action.payload
    }
  },
  extraReducers: {
    [HYDRATE]: (state, action) => {
      return {
        ...state,
        ...action.payload[ns],
      }
    },
  },
})

export const getSaleRecord = async (req: NextRequest ) => {
  const data = await http.get('/api/skijan/v1/mypage/sales', {
    headers: appendGgjHeader({req}),
  })
  const returnData = data.data.data
  return returnData
}

export const getMonthlySaleRecord = async ({date, page,}: { date: string, page: number }) => {
  const data = await http.get(
    `/api/skijan/v1/mypage/sales/${date}?order=ASC&page=${page}&limit=10`
  )
  const returnData = data.data.data
  return returnData
}

export const {actions} = slice
export default slice
