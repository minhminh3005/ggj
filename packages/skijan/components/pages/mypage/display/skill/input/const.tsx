export const MAX_PAID_OPTION_ITEM = 7
export const MAX_FAQ_ITEM = 7
export const TOOLBAR = [
  ['font', ['bold', 'italic', 'underline', 'strikethrough']],
  ['para', ['ul', 'ol', 'paragraph']],
  ['insert', ['link']],
  ['misc', ['undo', 'redo']],
  ['countbutton', ['countText']],
]
export const THUMB_ACCEPT_FILE_TYPE = '.png, .jpg, .jpeg'
export const THUMB_MAX_FILE_SIZE = 5 /*MB*/
export const SKILL_MAX_PRICE = 2200000
export const MAX_LENGTH_OUTLINE = 2000

const getFileExtFromBlob = (blobType: string) => {
  const regex = /[^/]*$/g
  const found = blobType.match(regex)
  if (found?.length && found.length > 0) {
    return `.${found[0]}`
  }
  return '.png'
}
export const imgUrlToFile = (imgUrl: string, fileName?: string) => {
  return new Promise((resolve) => {
    fetch(imgUrl)
      .then((res) => {
        res.blob().then((blob) => {
          const file = new File([blob], (fileName || 'GgjImage') + getFileExtFromBlob(blob.type), {type: blob.type})
          resolve({file: file, url: imgUrl})
        })
      })
      .catch(() => {
        resolve({file: undefined, url: imgUrl})
      })
  })
}
export const SkillType = {
  DRAFT: 0,
  SALE: 1,
  PAUSE: 2,
  CLOSE: 3,
}
export enum SkillInputName {
  SERVICE_CATEGORY_LARGE_ID = 'serviceCategoryLargeId',
  SERVICE_CATEGORY_MIDDLE_ID = 'serviceCategoryMiddleId',
  TITLE = 'title',
  CATCHCOPY = 'catchcopy',
  OUTLINE = 'outline',
  FAQS = 'faqs',
  LIMIT = 'limit',
  PRICE = 'price',
  PAID_OPTIONS = 'paidOptions',
  DELIVERY_DAYS = 'deliveryDays',
}
export const nsTran = 'mypage@create-edit-skill'
export const skillAvatarUrl = '/img/v3/skijan/mypage/display/skill/'
