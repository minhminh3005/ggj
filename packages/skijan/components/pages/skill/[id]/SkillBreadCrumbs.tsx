import GgjBreadcrumbs, {nsGgjBreadcrumbs} from 'components/commons/GgjBreadcrumbs'
import {IGgjCategoriesLarge, IGgjCategoriesMiddle, nsCommonCategories} from 'common/categories'
import {useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs, State as SkillSliceState} from 'store/skillSlice'
import {useTranslation} from 'next-i18next'
import menuData from 'components/layouts/common/menu-data.json'
import {useMemo} from 'react'


export default function SkillBreadCrumbs(props: {className?: string}) {
  const { t } = useTranslation([nsCommonCategories, nsGgjBreadcrumbs])
  const skillCategory = useAppSelector(state => (state[skillDetailSliceNs] as SkillSliceState).apiResObj?.category)
  const pc = useMemo(() => {
    const largeId = skillCategory?.large
    const middleId = skillCategory?.middle
    const largeObject = (menuData as Array<IGgjCategoriesLarge>).filter(item => item.id === largeId)[0] as IGgjCategoriesLarge
    const middleObject = largeObject.sub.filter(item => item.id === middleId)[0] as IGgjCategoriesMiddle
    return {
      large: largeObject.sub.map(item => item.id),
      middle: [middleObject.id, ...(middleObject.smallIds ?? [])],
    }
  }, [skillCategory?.large, skillCategory?.middle])

  const data = ([
    {
      title: t('HOME', {ns: nsGgjBreadcrumbs}),
      url: '/',
    },
    skillCategory?.large
      ? {
        title: t(`${skillCategory.large}`, {ns: nsCommonCategories}),
        url: {
          pathname: '/search',
          query: { pc: pc.large.toString() },
        },
      }
      : null
    ,
    skillCategory?.middle
      ? {
        title: t(`mid_${skillCategory.middle}`, {ns: nsCommonCategories}),
        url: {
          pathname: '/search',
          query: { pc: pc.middle.toString() },
        },
      }
      : null
    ,
    skillCategory?.small
      ? {
        title: t(`mid_${skillCategory.small}`, {ns: nsCommonCategories}),
        url: {
          pathname: '/search',
          query: { pc: skillCategory?.small },
        },
      }
      : null
    ,
    {
      title: t('1', {ns: nsGgjBreadcrumbs}),
    },
  ]).filter(Boolean) as Array<{title: string, url?: string}>
  return (
    <div className={props.className}>
      <GgjBreadcrumbs data={data}/>
    </div>
  )
}
