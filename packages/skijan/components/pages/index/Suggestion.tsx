import {css} from '@emotion/react'
import {Card, CardMedia} from '@mui/material'
import {memo} from 'react'
import {useTranslation} from 'next-i18next'
import GgjSlide from 'components/commons/GgjSlide'
import Link from 'next/link'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'

const nsTran = 'surface@index'

interface AdvertisingProps {
  id: number
  url: string
  imageUrl: string
  content?: string
  title?: string
}

interface DataSuggestionProps<T> {
  url: T
  imageUrl: T
}

const ItemComponent = ({data}: { data: DataSuggestionProps<string> }) => {
  return (
    <Card>
      <Link href={data.url} passHref>
        <a>
          <div css={css`
            position: relative;
            padding-bottom: 100%;
            overflow: hidden;
          `}>
            <CardMedia
              component="img"
              image={data.imageUrl}
              css={css`
                position: absolute;
                width: 100%;
                left: 50%;
                height: auto;
                top: 50%;
                transform: translate(-50%, -50%);
              `}
            />
          </div>
        </a>
      </Link>
    </Card>
  )
}
const LazyItemSuggestion = ({data}: { data: DataSuggestionProps<string> }) => {
  return (
    <GgjLazyRenderComp
      alwaysShow={false}
      component={ItemComponentHOC}
      componentProps={{data: data}}
      minHeight={185}
    />
  )
}
const ItemComponentHOC = memo(ItemComponent)
const Suggestion = ({listFeatured}: { listFeatured: AdvertisingProps[] }) => {
  const {t} = useTranslation(nsTran)
  return (
    <section css={css`margin-top: 64px;
      width: 100%;`}>
      <GgjSlide
        id="suggestion"
        title={t('36')}
        list={listFeatured}
        showNavBtn={true}
        component={LazyItemSuggestion}
        minHeight={185}
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
              slidesPerView: 2.5,
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
export default memo(Suggestion)
