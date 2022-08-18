import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'next-i18next'
import {useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs} from 'store/skillSlice'
import GgjCollapseText from 'components/commons/GgjCollapseText'
import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'

export default function ProductDescription({className}: {className?: string}) {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const outline = useAppSelector(state => state[skillDetailSliceNs].apiResObj?.generalInfoSkill.outline ?? '')

  if(!outline) return <></>

  return (
    <div css={css`
      padding: 0 0 24px 0;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        max-width: 592px;
      }
    `} className={className}>
      <GgjCollapseText
        collapseHeight={310}
        content={outline}
        closeTextDefault={t('ProductDescription-see-less')} // 折りたたむ
        openTextDefault={t('ProductDescription-see-more')} // すべて表示
        isOpen={false}
      />
    </div>
  )
}
