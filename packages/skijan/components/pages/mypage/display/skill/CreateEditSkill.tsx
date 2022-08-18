import {handleReplaceImages, removeImages, uploadImages} from 'components/commons/GgjUploadImagesOrYoutube'
import ButtonGroup from 'components/pages/mypage/display/skill/input/ButtonGroup'
import DeliverySection from 'components/pages/mypage/display/skill/input/DeliverySection'
import PriceSection from 'components/pages/mypage/display/skill/input/PriceSection'
import ServiceSection from 'components/pages/mypage/display/skill/input/ServiceSection'
import SkillThumbnail from 'components/pages/mypage/display/skill/input/SkillThumbnail'
import SupportSection from 'components/pages/mypage/display/skill/input/SupportSection'
import {useCallback, useEffect, useMemo, useRef} from 'react'
import {FormProvider, useForm} from 'react-hook-form'
import {useAppSelector} from 'store/hooks'
import {ns, SkillFormValue} from 'store/mypage/display/skill/skillInputSlice'
import {SkillContextProvider} from './input/SkillContextProvider'
import {ImageTypes, YoutubeTypes} from '../../../../commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import {css, Global} from '@emotion/react'
import {useTheme} from '@mui/material/styles'

function CreateEditSkill() {
  const theme = useTheme()
  const product = useAppSelector(state => state[ns].product)
  const cloneId = useAppSelector(state => state[ns].cloneData.id)
  const cloneUrl = useAppSelector(state => state[ns].cloneData.url)
  const isDisableAllInput = useAppSelector(state => state[ns].isDisableAllInput)
  const methods = useForm<SkillFormValue>({
    reValidateMode: 'onSubmit',
    defaultValues: {
      ...product
    },
    shouldFocusError: false,
  })

  // upload banners and youtube state
  const value = useMemo(() => (product.url || cloneUrl || ''), [product.url, cloneUrl])
  const lstImages = useRef<Array<ImageTypes | YoutubeTypes>>([])
  const lstRemoveImages = useRef<Array<ImageTypes>>([])

  const handleChangeListImages = useCallback((listImages: Array<ImageTypes | YoutubeTypes>) => {
    lstImages.current = listImages
  }, [lstImages])

  const handleRemoveListImages = useCallback((listImageRemove: Array<ImageTypes>) => {
    lstRemoveImages.current = listImageRemove
  }, [lstRemoveImages])

  const handleUploadListImages = useCallback(async (skillId: number) => {
    let banners: Array<ImageTypes | YoutubeTypes>  = [],
      isError = false

    // upload banners
    if (lstImages.current?.length || lstRemoveImages.current?.length) {
      const result = await handleReplaceImages(
        `skijan/mypage/display/skill/banner/${skillId}`,
        lstImages.current,
        uploadImages,
        !!cloneId,
        undefined,
        `skijan/skill/banner/${skillId}`
      )
      isError = !!result.error
      banners = result.error ? [] : result.lstImages
    }

    // remove banners
    if (lstRemoveImages.current?.length && !isError) {
      const newArray = lstRemoveImages.current.map((p: ImageTypes) => p.number as string)
      const result = await removeImages(
        `skijan/mypage/display/skill/banner/${skillId}`,
        newArray
      )
      if (result?.error) {
        console.log(result.error)
      }
    }

    return {
      bannersUrl: !isError ? JSON.stringify(banners) : product.url,
      isUploadBannersFail: isError,
    }
  }, [lstImages, lstRemoveImages, cloneId, product.url])


  useEffect(() => {
    if(cloneId) {
      methods.reset(product)
    }
  }, [product])

  useEffect(() => {
    let imagesObject: Array<ImageTypes | YoutubeTypes>
    try {
      imagesObject = JSON.parse(value)
    } catch (e) {
      imagesObject = []
    }
    handleChangeListImages(imagesObject)
  }, [value])

  return (
    <FormProvider {...methods}>
      <SkillContextProvider>
        <fieldset disabled={isDisableAllInput} css={css` position: relative; `}>
          <Global styles={css` #BodyWrapper {
            width: 100%;
            @media (min-width: ${theme.breakpoints.values.lg}px){ width: unset;}}`}
          />
          <SkillThumbnail/>
          <ServiceSection
            handleChangeListImages={handleChangeListImages}
            handleRemoveListImages={handleRemoveListImages}
            value={value}
          />
          <SupportSection/>
          <PriceSection/>
          <DeliverySection/>
          {!isDisableAllInput && <ButtonGroup handleUploadListImages={handleUploadListImages}/>}
        </fieldset>
      </SkillContextProvider>
    </FormProvider>
  )
}

export default CreateEditSkill
