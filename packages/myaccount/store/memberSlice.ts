import { MapSexType, MemberFormData, TMemberInfo } from 'components/pages/member/member.typing'
import { loadingOffHandler, loadingOnHandler } from 'contexts/LoadingContext'
import http, { appendGgjHeader } from 'common/http'
import upload from 'common/upload'
import { toastHandler } from 'contexts/ToastContext'
import { NextRequest } from 'next/server'
import { TGgjRes } from 'app'

export async function getMemberInfo(req: NextRequest): Promise<TGgjRes<TMemberInfo>> {
  return (await http.get<TGgjRes<TMemberInfo>>('/api/myaccount/v1/member', { headers: appendGgjHeader({ req }) })).data
}

export async function processMemberDataAndPost(
  {
    data,
    memberIdentityFile,
    resetFiles,
    t,
  } : {
    data: MemberFormData,
    memberIdentityFile: FileList | null,
    resetFiles: () => void
    t: (s: string) => string
  }
) {
  loadingOnHandler()

  // process data prepare for upload
  if(memberIdentityFile) {
    const fd = new FormData()
    const file = (memberIdentityFile[0]) || null
    fd.append('file', file, file.name)
    const endProcess = () => {
      toastHandler({ message: t('update-identity-failed'), type: 'error' })
      loadingOffHandler()
    }
    try {
      type ResUpload = { data: { res: { ok: boolean } } } | undefined
      const uploadResult: ResUpload = await upload<ResUpload>({url: '/api/v3/member/user/identity', fd})
      if(!uploadResult?.data?.res.ok) {
        endProcess()
        return
      }
    } catch(e) {
      endProcess()
      console.error(e)
      return
    }
  }

  // process data before post
  const postData: Omit<TMemberInfo, 'prefectures' | 'identity' | 'id'> = {
    ...data,
    sexType: MapSexType[data.sexType],
    birthday: data.birthday ? data.birthday : null,
    isCorporation: data.isCorporation === 'true',
    isTransaction: Boolean(data.isTransaction),
  }
  if(!postData.isCorporation) {
    postData.corporateName = ''
    postData.registrationNumber = ''
  }

  // post
  try {
    const { error } = (await http.post('/api/myaccount/v1/member', postData)).data
    if(error) {
      toastHandler({ message: t('update-info-failed'), type: 'error' })
    } else {
      toastHandler({ message: t('update-info-success'), type: 'success' })
      resetFiles()
    }
  } catch(e) {
    toastHandler({ message: t('update-info-failed'), type: 'error' })
  }
  loadingOffHandler()
}


export const checkNicknameApi = async ({nickName}: {nickName: string}) => {
  // TODO: HUYNH add cancel request
  const {data} = await http.post('/api/myaccount/v1/nick-name/status', {nickName})
  return data
}
