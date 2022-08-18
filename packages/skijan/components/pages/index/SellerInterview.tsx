import {css} from '@emotion/react'
import {useTheme} from '@mui/material/styles'
import GgjSlide from 'components/commons/GgjSlide'
import {Card, CardContent, Tooltip, Typography} from '@mui/material'
import {memo} from 'react'
import {useTranslation} from 'next-i18next'
import Link from 'next/link'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'

const nsTran = 'surface@index'

interface AdvertisingProps {
  id: number
  url: string
  imageUrl: string
  nameCate?: string
  title?: string
}

const ItemComponent = ({data}: { data: AdvertisingProps }) => {
  const theme = useTheme()
  return (
    <Card css={css`
      padding: 16px 16px 0 16px;
      background-color: ${theme.palette.jade.light};`}>
      <Link href={data.url} passHref>
        <a css={css`
          cursor: pointer;
          text-decoration: none;`}>
          <CardContent css={css`padding: unset;`}>
            <div css={css`
              position: relative;
              padding-bottom: 100%;
              border-radius: 5px;
              overflow: hidden;
            `}>
              <img
                src={data.imageUrl}
                alt="Image-Seller-Interview-Skjian"
                css={css`
                  position: absolute;
                  width: 100%;
                  left: 50%;
                  height: auto;
                  top: 50%;
                  transform: translate(-50%, -50%);
                `}/>
            </div>
            <div css={css`min-height: 44px;
              margin-top: 8px`}>
              <Tooltip placement="bottom-start" title={data?.nameCate || ''}>
                <div className="ggj-wt">
                  <span
                    css={css`
                      color: white;
                      font-size: 12px;
                      cursor: pointer;
                      padding: 0.25rem;
                      border-radius: 16px;
                      background: ${theme.palette.jade.dark} 0% 0% no-repeat padding-box;
                    `}>{data?.nameCate || ''}</span>
                </div>
              </Tooltip>
              <Tooltip placement="bottom-start" title={data?.title || ''}>
                <Typography className="ggj-wt ggj-wt-l-2" css={css`
                  width: 100%;
                  margin-top: 8px;
                  line-height: 24px;
                  color: white;`} variant="subtitle1">{data?.title || ''}</Typography>
              </Tooltip>
            </div>
          </CardContent>
        </a>
      </Link>
    </Card>
  )
}
const ItemComponentHOC = memo(ItemComponent)
const LazyItemSellerInterview = ({data}: { data: AdvertisingProps }) => {
  return (
    <GgjLazyRenderComp
      alwaysShow={false}
      component={ItemComponentHOC}
      componentProps={{data: data}}
      minHeight={291}
    />
  )
}
const SellerInterview = ({listInterview}: { listInterview: AdvertisingProps[] }) => {
  const {t} = useTranslation(nsTran)
  return (
    <section css={css`width: 100%;
      margin-top: 16px;`}>
      <GgjSlide
        id="interview"
        title={t('41')}
        list={listInterview}
        showNavBtn={false}
        component={LazyItemSellerInterview}
        minHeight={291}
        slideProps={{
          spaceBetween: 24,
          centeredSlides: false,
          breakpoints: {
            0: {
              slidesPerView: 1.2
            },
            375: {
              slidesPerView: 1.5,
            },
            475: {
              slidesPerView: 2,
            },
            600: {
              slidesPerView: 2.8,
            },
            768: {
              slidesPerView: 3.4,
            },
            960: {
              slidesPerView: 3,
            },
            1024: {
              slidesPerView: 3.2,
            },
            1280: {
              slidesPerView: 4.2,
            },
            1440: {
              slidesPerView: 5,
            },
          },
        }}
      />
    </section>
  )
}
export default memo(SellerInterview)
