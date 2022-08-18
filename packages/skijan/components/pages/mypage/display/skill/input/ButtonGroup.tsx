import {css} from '@emotion/react'
import {Box, ButtonProps, Slide, Stack, useMediaQuery, useScrollTrigger} from '@mui/material'
import {CancelOutlined} from '@mui/icons-material'
import {useTheme} from '@mui/material/styles'
import {GgjContainButton, GgjOutlineButton, GgjTextButton} from 'components/commons/GgjButton'
import {useTranslation} from 'next-i18next'
import {memo, useContext, useEffect, useMemo, useState} from 'react'
import {FieldErrors, useFormContext,} from 'react-hook-form'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {
  actions,
  deleteAvatar,
  ns,
  postProductData,
  SkillFormValue,
  uploadBannersOrPublish,
  uploadThumb
} from 'store/mypage/display/skill/skillInputSlice'
import {rgba} from 'emotion-rgba'
import ModalConfirmEditCreateSkill from './ModalConfirmPublishSkill'
import {cloneDeep} from 'lodash'
import {ggjDebounce, scrollToElSmoothly} from 'common/utils'
import {Action, DispatchContext, ThumbImageContext} from './SkillContextProvider'
import {toastHandler} from '../../../../../../contexts/ToastContext'
import {loadingOffHandler, loadingOnHandler} from 'contexts/LoadingContext'
import {useRouter} from 'next/router'
import {nsTran, SkillInputName, SkillType} from 'components/pages/mypage/display/skill/input/const'
import {STATUS_MAP, STATUS_MAP_REVERSE} from '../skill-common-types'

const FAQS = SkillInputName.FAQS
const PAID_OPTIONS = SkillInputName.PAID_OPTIONS

type UploadListImagesResType = {
  bannersUrl: string,
  isUploadBannersFail: boolean
}

function ButtonGroup(props : {
  handleUploadListImages: (id: number) => Promise<UploadListImagesResType>
}) {
  const {handleUploadListImages} = props
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const breakPoint = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const isDesktop = useMemo(() => breakPoint, [breakPoint])
  const trigger = useScrollTrigger({
    target: undefined,
  })
  const [isReachedBottom, setIsReachedBottom] = useState(false)

  // redux store
  const dispatch = useAppDispatch()
  const statusType = useAppSelector(state => state[ns].product.statusType)
  const id = useAppSelector(state => state[ns].product.id)
  const isHasAvatar = useAppSelector(state => state[ns].product.isHasAvatar)
  const deletedFAQ = useAppSelector(state => state[ns].deletedFAQ)
  const deletedPaidOption = useAppSelector(state => state[ns].deletedPaidOption)
  const isShowRequiredThumbError = useAppSelector(state => state[ns].isShowRequiredThumbError)
  const isCallApiDeleteAvatar = useAppSelector(state => state[ns].isCallApiDeleteAvatar)
  // react context
  const {thumbImage, thumbRef} = useContext(ThumbImageContext)
  const contextDispatch = useContext(DispatchContext)
  const { handleSubmit } = useFormContext<SkillFormValue>()

  const openConfirmModal = () => {
    dispatch(actions.setIsShowConfirmModal(true))
  }
  const setThumbError = (isErr: boolean) => {
    if(!isErr && !isShowRequiredThumbError) return
    dispatch(actions.setIsShowRequiredThumbError(isErr))
  }
  const handleLeftButtonClick = () => {
    if(statusType !== SkillType.DRAFT) {
      handleCancelUpdate()
    } else {
      setThumbError(false)
      dispatch(actions.setIsPublishValidation(false))
      handleSubmitSkill()
    }
  }
  const handleRightButtonClick = async () => {
    if(statusType !== SkillType.DRAFT) {
      setThumbError(false)
      handleSubmitSkill()
    } else {
      dispatch(actions.setIsPublishValidation(true))
      openConfirmModal()
    }
  }
  const handleValidateThumb = () => {
    // state will pass validate : 1. has avatar  2. gonna upload avatar
    if((isHasAvatar && !isCallApiDeleteAvatar) || thumbImage) {
      return true
    }
    setThumbError(true)
    thumbRef?.current && scrollToElSmoothly({el: thumbRef.current})
    return false
  }
  const handleCancelUpdate = () => {
    const tabParam = String(STATUS_MAP_REVERSE[statusType])
    router.push({pathname: '/mypage/display/skill', query: {t: tabParam}})
  }

  /* Submit Function Flow
  *  1. Preprocess Data *****
  *  2. Submit Product Info
  *  3. Upload Thumb
  *  4. Upload Images and YT Link
  *  5. Update Product Info (bannerUrl, skillStatusType)
  * */
  const handleSubmitSkill = (isPublishing?: boolean) => {
    handleSubmit(
      (data: SkillFormValue) => onValidateSuccess(data, isPublishing),
      (errors) => onValidateFailed(errors, isPublishing)
    )()
  }

  const onValidateSuccess = async (data: SkillFormValue, isPublishing?: boolean) => {
    if(isPublishing) {
      await onPublishSkill(data)
    } else {
      await onSaveSkill(data)
    }
  }

  const onPublishSkill = async (data: SkillFormValue) => {
    try {
      dispatch(actions.setIsShowConfirmModal(false))
      if (!handleValidateThumb()) return
      loadingOnHandler()

      let isHasThumb = isHasAvatar || false,
        isAdvanceUpdateFail = false,
        isUploadThumbFail = false,
        isHasAnyError = false

      const productData = preprocessingData(data)
      // @ts-ignore
      const skillId = await dispatch(postProductData(productData, id))
      if(!skillId) {
        loadingOffHandler()
        toastHandler({message: t(`${id ? 'update' : 'create'}-skill-err`), type: 'error'})
        return
      } else {
        if(thumbImage) {
          // @ts-ignore
          isUploadThumbFail = await handleUploadThumb(skillId)
          isHasAnyError = isUploadThumbFail
          isHasThumb = isHasAvatar || !isUploadThumbFail
        }
        // @ts-ignore
        const {bannersUrl, isUploadBannersFail} = await handleUploadListImages(skillId)
        isHasAnyError = isHasAnyError || isUploadBannersFail
        const isChangedBanners = !isUploadBannersFail

        // api update product banner and statusType.
        if(isHasThumb || isChangedBanners) {
          const updateAdvancePayload = {
            url: bannersUrl || '[]',
            statusType: isHasThumb ? SkillType.SALE : SkillType.DRAFT
          }
          // @ts-ignore
          const bannerRes = await dispatch(uploadBannersOrPublish(updateAdvancePayload, skillId))
          isAdvanceUpdateFail = !!bannerRes.error
          isHasAnyError = isHasAnyError || isAdvanceUpdateFail
        }

        // handle after all api
        if(isHasAnyError) {
          loadingOffHandler()
          if(isAdvanceUpdateFail || !isHasThumb) {
            toastHandler({message: t('publish-fail-err'), type: 'error'})
          }
          if(isUploadThumbFail) {
            toastHandler({message: t('upload-thumb-err'), type: 'error'})
          }
          if(isUploadBannersFail) {
            toastHandler({message: t('upload-banners-err'), type: 'error'})
          }
          return
        }
        // success -> redirect to skill list
        loadingOffHandler()
        toastHandler({message: t(id ? 'update-success' : 'create-success'), type: 'success'})
        await router.push({pathname: '/mypage/display/skill', query: {t: STATUS_MAP_REVERSE[STATUS_MAP.sale]}})
      }
    } catch (e) {
      toastHandler({message: undefined, type: 'error'})
      console.log(e)
    }
  }
  const onSaveSkill = async(data: SkillFormValue) => {
    try {
      if (statusType === SkillType.SALE && !handleValidateThumb()) return
      loadingOnHandler()

      let isAdvanceUpdateFail = false,
        isUploadThumbFail = false,
        isDeleteThumbFail = false,
        isHasAnyError = false

      const productData = preprocessingData(data)
      // @ts-ignore
      const skillId = await dispatch(postProductData(productData, id))
      if(!skillId) {
        loadingOffHandler()
        toastHandler({message: t(`${id ? 'update' : 'create'}-skill-err`), type: 'error'})
        return
      } else {
        if(isCallApiDeleteAvatar) {
          // @ts-ignore
          const resDelete = await dispatch(deleteAvatar(skillId))
          isDeleteThumbFail = Boolean(resDelete?.error)
          isHasAnyError = isHasAnyError || isDeleteThumbFail
        }
        if(thumbImage) {
          // @ts-ignore
          isUploadThumbFail = await handleUploadThumb(skillId)
          isHasAnyError = isUploadThumbFail
        }
        // @ts-ignore
        const {bannersUrl, isUploadBannersFail} = await handleUploadListImages(skillId)
        isHasAnyError = isHasAnyError || isUploadBannersFail
        const isChangedBanners = !isUploadBannersFail

        // api update product banner and statusType.
        if(statusType === 1 || isChangedBanners) {
          const updateAdvancePayload = {
            url: bannersUrl || '[]',
            statusType: statusType
          }
          // @ts-ignore
          const bannerRes = await dispatch(uploadBannersOrPublish(updateAdvancePayload, skillId))
          isAdvanceUpdateFail = !!bannerRes.error
          isHasAnyError = isHasAnyError || isAdvanceUpdateFail
        }

        // handle after all api
        if(isHasAnyError) {
          loadingOffHandler()
          if(isUploadBannersFail || isAdvanceUpdateFail) {
            toastHandler({message: t('upload-banners-err'), type: 'error'})
          }
          if(isUploadThumbFail) {
            toastHandler({message: t('upload-thumb-err'), type: 'error'})
          }
          if(isDeleteThumbFail) {
            toastHandler({message: t('delete-thumb-err'), type: 'error'})
          }
          return
        }
        // success -> redirect to skill list
        loadingOffHandler()
        toastHandler({message: t(`${id ? 'update' : 'create'}-success`), type: 'success'})
        const tabParam = STATUS_MAP_REVERSE[statusType]
        await router.push({pathname: '/mypage/display/skill', query: {t: tabParam}})
      }

    } catch (e) {
      loadingOffHandler()
      toastHandler({message: undefined, type: 'error'})
      console.log(e)
    }
  }
  const onValidateFailed = (errors: FieldErrors<SkillFormValue>, isPublishing?: boolean) => {
    if(isPublishing) {
      dispatch(actions.setIsShowConfirmModal(false))
      if(!handleValidateThumb()) return
    }

    const getArrayInputName = (err: Array<any>) => {
      if(err.length < 0) return
      let index = 0
      for (let i = 0; i < err.length; i++) {
        if(err[i]) {
          index = i
          break
        }
      }
      const errNameArr = Object.keys(err[index]) || []
      if(errNameArr.length > 0) {
        return `${index}.${errNameArr[0]}`
      }
      return null
    }

    if(errors) {
      const fields =  Object.keys(errors||{})
      let element = null
      let eleName = ''

      if(fields.length) {
        switch (fields[0]) {
        case SkillInputName.OUTLINE:
          element = document.querySelector('.summer-note-editor')
          break
        case FAQS:
          eleName = getArrayInputName(errors[FAQS] || []) || ''
          if(eleName) {
            element = document.querySelector(`[name='${FAQS}.${eleName}']`)
          }
          break
        case PAID_OPTIONS:
          eleName = getArrayInputName(errors[PAID_OPTIONS] || []) || ''
          if(eleName) {
            element = document.querySelector(`[name='${PAID_OPTIONS}.${eleName}']`)
          }
          break
        default:
          element = document.querySelector(`[name=${fields[0]}]`)
        }
        scrollToElSmoothly({
          el: element as HTMLElement,
          focusEl: true,
          duration: 400,
        })
      }
    }
  }
  const preprocessingData = (data : SkillFormValue) => {
    const product = cloneDeep(data)

    // remove unused fields
    delete product.serviceCategoryLargeId
    delete product.url
    delete product.imageUrl

    // phase X. TODO: Remove after phase X
    delete product.estimateType
    delete product.estimateContent
    delete product.discountPrice
    delete product.discountStartAt
    delete product.discountEndAt

    product.faqs = product.faqs.concat(deletedFAQ)
    product.paidOptions = product.paidOptions.concat(deletedPaidOption)

    return product
  }

  const handleUploadThumb = async (id: number) => {
    // @ts-ignore
    const result = await dispatch(uploadThumb(thumbImage as File, id))
    // reset thumb image data
    contextDispatch({
      type: Action.UPDATE_THUMB_IMAGE,
      payload: null
    })
    return !!result.error
  }
  const handleCheckScrollBottom = () => {
    if(!isDesktop) {
      if((window.innerHeight + window.scrollY) >= document.body.scrollHeight) {
        setIsReachedBottom(true)
      } else {
        setIsReachedBottom(false)
      }
    }
  }

  useEffect(() => {
    router.prefetch('/mypage/display/skill')
    if(!isDesktop) {
      window.addEventListener('scroll', handleCheckScrollBottom)
    }
    return () => {
      window.removeEventListener('scroll', handleCheckScrollBottom)
    }
  }, [])


  return (
    <Slide
      appear={true}
      direction="up"
      in={isDesktop ? true : (isReachedBottom || trigger)}
    >
      <Box
        css={css`
          position: fixed;
          width: 100%;
          bottom: 0;
          left: 0;
          padding: 16px;
          background-color: ${theme.palette.common.white};
          z-index: 100;
          box-shadow: 0px -8px 8px -8px rgba(0,0,0,0.2);
          -webkit-box-shadow: 0px -8px 8px -8px rgba(0,0,0,0.2);
          -moz-box-shadow: 0px -8px 8px -8px rgba(0,0,0,0.2);
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding: 16px 0;
            position: sticky;
            margin-left: -16px;
            margin-right: -16px;
            width: unset;
          }
        `}>
        <Stack direction="row" flexWrap="wrap" justifyContent={{xs: 'space-around', md: 'center'}} spacing={{xs: 0, md: '100px'}} alignItems="center">
          <GgjOutlineButton
            onClick={ggjDebounce(handleLeftButtonClick)}
            variant="outlined"
            css={css`
              width: 40%;
              padding: 0;
              height: 44px;
              border-radius: 10px;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                width: 204px;
              }
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                width: 280px;
              }
            `}>
            {t(statusType === 0 ? '44' : '52')}
          </GgjOutlineButton>

          <GgjContainButton
            onClick={ggjDebounce(handleRightButtonClick)}
            css={css`
              width: 40%;
              padding: 0;
              height: 44px;
              border-radius: 10px;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                width: 204px;
              }
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                width: 280px;
              }
            `}>
            {t(statusType === 0 ? '45' : '53')}
          </GgjContainButton>
        </Stack>
        <ModalConfirmEditCreateSkill handleSubmitSkill={handleSubmitSkill}/>
      </Box>
    </Slide>
  )
}

export function TextButtonDelete(props: ButtonProps & {title: string}) {
  const { title, ...rest } = props
  const theme = useTheme()

  return (
    <GgjTextButton
      variant="text"
      startIcon={<CancelOutlined/>}
      css={css`
        color: ${theme.palette.error.main};
        &:hover,
        &:focus,
        &:active {
          color: ${theme.palette.error.main};
          background-color: ${rgba(theme.palette.error.main, 0.04)};
        }
        &:disabled {
          color: ${rgba(theme.palette.error.main, 0.5)};
        }
      `}
      {...rest}
    >
      { title }
    </GgjTextButton>
  )
}

export default memo(ButtonGroup)
