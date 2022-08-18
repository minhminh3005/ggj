import GgjReviewSummary from 'components/commons/GgjReviewSummary'
import GgjReviewBox from 'components/commons/GgjReviewBox'
import {useAppSelector} from 'store/hooks'
import Button from '@mui/material/Button'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import {getSkillReview, ns as skillDetailSliceNs, State as StoreSkillState, TAPIResObject} from 'store/skillSlice'
import TreasureHuntIllustration from 'components/pages/skill/treasure_hunt.png'
import { css } from '@emotion/react'
import {useState} from 'react'
import {useRouter} from 'next/router'
import {useTheme} from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import {useTranslation} from 'next-i18next'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import { toastHandler } from 'contexts/ToastContext'
import Link from 'next/link'

type FilterType = '0'|'1'|'2'|'3'|'4'|'5'
import Image from 'next/image'
import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'
import GgjSort from '../../../commons/GgjSort'

export default function ProductReview(props: { className?: string }) {
  const { t } = useTranslation(nsTran)
  const isHaveSkillReview = useAppSelector(state => {
    return Boolean(state[skillDetailSliceNs].apiResObj?.skillReview ?? null)
  })
  const avgReviewStars = useAppSelector(state => {
    return (state[skillDetailSliceNs].apiResObj?.skillReview?.avgReviewStars ?? 0)
  })
  const noReview = useAppSelector(state => {
    return (state[skillDetailSliceNs].apiResObj?.skillReview?.noReview ?? 0)
  })
  const reviewRequirementDetails = useAppSelector(
    state => {
      return (state[skillDetailSliceNs] as StoreSkillState).apiResObj?.skillReview?.reviewRequirementDetails ?? []
    })
  if(!isHaveSkillReview) return <></>
  return (
    <div className={props.className}>
      <Typography variant="h6" mb={4} component="h2">{t('34')}</Typography>
      <GgjReviewSummary data={{
        reviewStars: avgReviewStars,
        count: noReview, // number of review
        reviewDetails: Object.values(reviewRequirementDetails)
          .sort((a, b) => a.priority - b.priority)
          .map(i => ({reviewType: i.name, reviewStars: i.avgReviewStars}))
      }}/>
      <ReviewList/>
    </div>
  )
}

function ReviewList() {
  const topReviewsInit = useAppSelector(state => (state[skillDetailSliceNs] as StoreSkillState).apiResObj?.skillReview.topReviews ?? [])
  const [topReviews, setTopReviews] = useState(topReviewsInit)
  const [inProcess, setInProcess] = useState(false)
  const [currentFilter, setCurrentFilter] = useState<FilterType>('0')
  const router = useRouter()
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const onChangeFilter = async (val: FilterType): Promise<{error?: number}> => {
    try {
      type ListReview = TAPIResObject['skillReview']['topReviews']
      setInProcess(true)
      loadingOnHandler()
      const {data, error} = await getSkillReview(router?.query?.id as string, val) as unknown as {data: { data: ListReview }, error: string}
      if (error) {
        // do something with error
        toastHandler({ message: t('ECI500'), type: 'error' })
        return {error: 1}
      }
      setTopReviews(data.data)
    } catch(e) {
      console.log(e)
      toastHandler({ message: t('ECI500'), type: 'error' })
    } finally {
      setInProcess(false)
      loadingOffHandler()
    }
    return {}
  }

  const handleChange = async (val: FilterType) => {
    const {error} = await onChangeFilter(val)
    !error && setCurrentFilter(val)
  }

  return (
    <div css={css`margin-top: ${theme.spacing(5)};margin-bottom: ${theme.spacing(6)}`}>
      <div css={css`margin-bottom: 24px`}><GgjSort selected={currentFilter} handler={handleChange} disabled={inProcess} /></div>
      {
        topReviews && topReviews.length > 0
          ? <>
            {topReviews.map((review, index) => (
              <GgjReviewBox
                key={index}
                data={review}
                css={css`margin-bottom: ${theme.spacing(4)}`}
              />
            ))}
            <SeeMoreReviewButton />
          </>
          : <EmptyUI/>
      }
    </div>
  )
}

function SeeMoreReviewButton() {
  const router = useRouter()
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <Link href={`/skill/${router.query.id}/review`} passHref>
      <a css={css`text-decoration: none;display: block;margin-top: ${theme.spacing(5)};`}>
        <Button
          size="large"
          variant="outlined"
          endIcon={<ChevronRightIcon />}
          fullWidth css={css`border-radius: 10px; height: 44px;`}
        >{t('37')}</Button>
      </a>
    </Link>
  )
}


function EmptyUI() {
  const { t } = useTranslation(nsTran)
  return <div css={css`display: flex; justify-content: center;align-items: center;flex-direction: column`}>
    <Image
      src={TreasureHuntIllustration}
      alt=""
      width={326}
      height={326}
      layout="intrinsic"
      css={css`object-fit: contain; max-width: 80%;`}
    />
    <Typography>{t('35')}</Typography>
  </div>
}
