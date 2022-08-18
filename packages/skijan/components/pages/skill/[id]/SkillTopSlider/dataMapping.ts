import {ItemType} from './shared-components/Viewer'

type MappedItemType = { originIndex: number, computedIndex: number, data: ItemType }

const dataMapping: { [key in (number | 'raw')]: (number | null)[] } = {
  0: [
    1, 7,
    2, 8,
    3, 9,
    4, 10,
    5, 11,
    6, 12,
  ],
  1: [
    1, 6,
    2, 7,
    3, 8,
    4, 9,
    5, 10,
    null, null,
  ],
  2: [
    1, 5,
    2, 6,
    3, 7,
    4, 8,
    null, null,
    null, null,
  ],
  3: [
    1, 4,
    2, 5,
    3, 6,
    null, null,
    null, null,
    null, null,
  ],
  4: [
    1, 3,
    2, 4,
    null, null,
    null, null,
    null, null,
    null, null,
  ],
  5: [
    1, 2,
    null, null,
    null, null,
    null, null,
    null, null,
    null, null,
  ],
  raw: [
    1, 2,
    3, 4,
    5, 6,
    7, 8,
    9, 10,
    11, 12,
  ],
}

function getKeyLocationMap(array: string[]): number {
  if (array.length !== 12) throw 'length of array need to be 12!!'
  const length = array.filter(item => !item).length
  return Math.round(length/2 - 0.1)
}

// The UI depend on number of item slider, this pull is using for mapping data for slider.
// If number item > 12, using computedIndex.
// Else using originIndex.
export function getMappedData(sliderData: ItemType[], isDesktop: boolean) {
  const offset = sliderData.length % 12
  const fillArray = Array(offset ? 12 - offset : 0).fill('')
  const array = [...sliderData, ...fillArray]

  let mainData: MappedItemType[] = []
  let thumbData: MappedItemType[] = []

  const limit = array.length / 12
  const shouldMap = isDesktop && array.length > 12

  // mapping
  for (let i = 0; i < limit; i++) {
    const map = dataMapping[shouldMap ? getKeyLocationMap(array.slice(i * 12, (i + 1) * 12)) : 'raw'] ?? []
    const dt = map.map((item, idx) => {
      const dataIndex = i * 12 + idx
      const mappedIndex = item ? i * 12 + item - 1 : -1
      return {
        computedIndex: mappedIndex,
        originIndex: dataIndex,
        data: sliderData[mappedIndex] ?? null,
      }
    })

    thumbData = thumbData.concat(dt)
    mainData = mainData.concat(dt.filter(item => Boolean(item.data)))
  }

  // sort data following length sliderData
  if (sliderData.length <= 12) {
    mainData = mainData.sort((item1, item2) => item1.originIndex - item2.originIndex)
  } else {
    mainData = mainData.sort((item1, item2) => item1.computedIndex - item2.computedIndex)
  }

  return {
    thumbData,
    mainData,
  }
}
