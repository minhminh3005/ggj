import http from 'common/http'

type UploadParameter = {
  url: string,
  fd: FormData,
  errorHandler?: (e: unknown) => void,
  cb?: () => void,
}
export default async function upload<T>(input: UploadParameter): Promise<(T | undefined)> {
  const {
    url,
    fd,
    errorHandler,
    cb,
  } = input
  try {
    // TODO: Binh, handle retry when upload failed.
    const res: T = await http.post(url, fd)
    cb && cb()
    return res
  } catch(e) {
    errorHandler && errorHandler(e)
    console.log(e)
  }
}

/**
 * Check file extension.
 * @param file to check
 * @param exts extension that accept file extension, ex: '.png, .jpeg'
 * @returns {(...args: any) => void}
 */
export function checkExtension(file: File, exts: string): boolean {
  if(!file) return false
  const ext = file.name.split('.')
  return exts.indexOf(`.${ext[ext.length - 1].toLowerCase()}`) !== -1
}

/**
 * Check file extension.
 * @param file to check
 * @param maxSize max size of file, in MB unit
 * @returns {(...args: any) => void}
 */
export function checkFileSize(file: File, maxSize: number): boolean {
  if(!file) return false
  // convert to MB
  return file.size / 1024 / 1024 < maxSize
}
