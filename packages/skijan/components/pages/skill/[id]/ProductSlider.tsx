import { memo } from 'react'
import GgjSlide from 'components/commons/GgjSlide'
import GgjProductBox from 'components/commons/GgjProductBox'
import {useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs, TAPIResObject} from 'store/skillSlice'
import {useTheme} from '@mui/material/styles'
import { css } from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {nsCommonCategories} from 'common/categories'

const slideProps = {
  // spaceBetween: 24,
  centeredSlides: false,
  breakpoints: {
    0: {
      slidesPerView: 1.2,
      spaceBetween: 6,
    },
    375: {
      slidesPerView: 2.1,
      spaceBetween: 6,
    },
    475: {
      slidesPerView: 2.2,
      spaceBetween: 6,
    },
    600: {
      slidesPerView: 3.2,
      spaceBetween: 6,
    },
    960: {
      slidesPerView: 2.4,
      spaceBetween: 24,
    },
    1024: {
      slidesPerView: 2.6,
      spaceBetween: 24,
    },
  },
}

import {skillDetailNsTran} from 'components/pages/skill/[id]/const'

const nsTran = [skillDetailNsTran, nsCommonCategories]

function ProductSlider() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const skillsRelatedSeller = useAppSelector(
    state => {
      const list = (state[skillDetailSliceNs].apiResObj?.skillsRelatedSeller ?? []) as TAPIResObject['skillsRelatedSeller']
      return list.map(item => ({...item, userId: item.sellerId}))
    },
    (left, right) => left.length === right.length
  )
  const skillsRelatedCategory = useAppSelector(
    state => {
      const list = (state[skillDetailSliceNs].apiResObj?.skillsRelatedCategory ?? []) as TAPIResObject['skillsRelatedCategory']
      return list.map(item => ({...item, userId: item.sellerId}))
    },
    (left, right) => left.length === right.length
  )
  const nickName = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.sellerInfo.nickName ?? []) as TAPIResObject['skillsRelatedCategory']
  const middleCategoryId = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.category.middle ?? []) as TAPIResObject['skillsRelatedCategory']
  const baseSlideConfig = {
    showNavBtn: true,
    component: GgjProductBox,
    slideProps: slideProps,
  }
  return (
    <div css={css`max-width: calc(100vw - 32px)`}> {/* fix max width mobile */}
      {skillsRelatedSeller.length > 0 && <GgjSlide
        id="product-seller"
        css={css`
          .swiper-wrapper {
          padding: 0 2px;
          }
        `}
        title={<><span css={css`color: ${theme.palette.primary.main}`}>{nickName}</span><span>{t('36')}</span></>}
        list={skillsRelatedSeller.map(item => ({...item, userId: item.sellerId}))}
        {...baseSlideConfig}
      />}
      {skillsRelatedCategory.length > 0 && <GgjSlide
        id="product-cate"
        css={css`
          .swiper-wrapper {
            padding: 0 2px;
          }
        `}
        title={<><span css={css`color: ${theme.palette.primary.main}`}>{t(`mid_${middleCategoryId}`, {ns: nsCommonCategories})}</span><span>{t('36')}</span></>}
        list={skillsRelatedCategory.map(item => ({...item, userId: item.sellerId}))}
        {...baseSlideConfig}
      />}
    </div>
  )
}
export default memo(ProductSlider)
