import {useTheme} from '@mui/material/styles'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import GgjKeepAliveTabs from 'components/commons/GgjKeepAliveTabs'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import { ns } from '../const'
import {TabPanelSkillService, TRowData} from './TabPanel'
import {useMemo} from 'react'
import {useAppSelector} from 'store/hooks'
import {
  getSkillServiceDetailTab,
  onSaleListSelector, TSkillDetail
} from 'store/mypage/display/skill/skillDetailSlice'
import {useRouter} from 'next/router'

export default function SkillTabs() {
  const { t } = useTranslation(ns)
  const theme = useTheme()
  const saleListInitData = useAppSelector(onSaleListSelector) as unknown as TRowData[]
  const router = useRouter()
  const id = parseInt(`${router.query.id}`)

  const data = useMemo(() => {
    return [
      {
        title: t('on-sale'),
        tabContent: (
          <GgjLazyRenderComp
            component={TabPanelSkillService}
            componentProps={{
              page: 1,
              tabIdx: 1,
              loadDataFn: async (page: number) => {
                const res = await getSkillServiceDetailTab(id, page)
                const data = res.data as TSkillDetail['buyersSkillDetail'] ?? null
                return data ? data?.data : []
              },
              initData: saleListInitData,
              emptyDescriptionText: t('empty-text-1'),
            }}
            minHeight={200}
          />
        ),
      },
      {
        title: t('cancel'),
        tabContent: (
          <GgjLazyRenderComp
            component={TabPanelSkillService}
            componentProps={{
              page: 0,
              tabIdx: 2,
              loadDataFn: async (page: number) => {
                const res = await getSkillServiceDetailTab(id, page, 2)
                const data = res.data as TSkillDetail['buyersSkillDetail'] ?? null
                return data ? data?.data : []
              },
              initData: [],
              emptyDescriptionText: t('empty-text-2'),
            }}
            minHeight={200}
          />
        ),
      },
      {
        title: t('complete'),
        tabContent: (
          <GgjLazyRenderComp
            component={TabPanelSkillService}
            componentProps={{
              page: 0,
              tabIdx: 3,
              loadDataFn: async (page: number) => {
                const res = await getSkillServiceDetailTab(id, page, 3)
                const data = res.data as TSkillDetail['buyersSkillDetail'] ?? null
                return data ? data?.data : []
              },
              initData: [],
              emptyDescriptionText: t('empty-text-3'),
            }}
            minHeight={200}
          />
        ),
      },
    ]
  }, [])
  return <GgjKeepAliveTabs
    data={data}
    css={
      css`
        z-index: 9;
        padding-bottom: 100px;
        .MuiTabs-flexContainer {
          border-bottom: 1px solid #E1E1E1;
        }
        .MuiTab-root {
          width: calc(100% / 3);
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            width: inherit;
          }
        }
        .MuiTabs-root {
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            top: 0;
            //position: sticky;
            background: #fff;
            z-index: 10;
          }
        }
        .KeepAliveTabs-tab-ctn {
          margin-top: ${theme.spacing(2)};
        }
      `}
  />
}
