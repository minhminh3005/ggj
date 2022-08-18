// related with table https://gogojungle.backlog.jp/alias/wiki/906935
// -------------


// map name to status number
export enum STATUS_MAP {
  'draft' = 0,
  'sale' = 1,
  'pause' = 2,
  'close' = 3,
}

// map status number to name (reverse with enum STATUS_MAP)
export const STATUS_MAP_REVERSE: Record<number, keyof typeof STATUS_MAP> = {
  0: 'draft', // draft
  1: 'sale', // sale
  2: 'pause', // pause
  3: 'close', // close
}

// alias for `keyof typeof EnumStatusMapReserve`
export type SaleStatusType = keyof typeof STATUS_MAP

