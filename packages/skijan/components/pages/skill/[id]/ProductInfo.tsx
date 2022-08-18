import {css} from '@emotion/react'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import StarBorderIcon from '@mui/icons-material/StarBorder'
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined'
import BookOutlinedIcon from '@mui/icons-material/BookOutlined'
import {WithConditionalCSSProp} from '@emotion/react/types/jsx-namespace'
import {FC, useMemo} from 'react'
import {useTheme} from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import {useAppSelector} from 'store/hooks'
import {ns as skillDetailSliceNs} from 'store/skillSlice'
import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'
import {GgjSocialSharing} from 'components/commons/GgjSocialSharing'
import {useRouter} from 'next/router'

export default function ProductInfo(props: WithConditionalCSSProp<'div'>) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const router = useRouter()

  const totalSold = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.generalInfoSkill?.totalSold ?? 0))
  const soldLimit = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.paymentInfo?.limit ?? 0))
  const noReview = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.skillReview?.noReview ?? 0))
  const avgReviewStars = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.skillReview?.avgReviewStars ?? 0))
  const totalFavorite = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.generalInfoSkill?.totalFavorite ?? 0))
  const remainSkills = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.generalInfoSkill?.remainSkills ?? 0))
  const catchcopy = useAppSelector(state => (state[skillDetailSliceNs].apiResObj?.generalInfoSkill?.catchcopy ?? 0))

  const isSoldOut = useMemo(() => {
    return Math.round(remainSkills/soldLimit*100) <= 10 // in percent
  }, [remainSkills, soldLimit])

  return (
    <div
      css={css`
        padding: 24px 24px 12px 24px;
        border-radius: 10px;
        box-shadow: ${theme.shadows[1]};
      `}
      {...props}
    >
      <Typography variant="body1" className="ProductInfo-tt" component="h2">{catchcopy}</Typography>
      <Divider css={css`margin-top: 7px;margin-bottom: ${theme.spacing(3)};`}/>

      {/* avgReviewStars */}
      <RowInfo
        icon={StarBorderIcon}
        text={t('ProductInfo-2', {num: noReview, avg: avgReviewStars})}
        css={css`
          color: ${theme.palette.jade.light};
          svg {
            fill: ${theme.palette.secondary.main};
          }
        `}
      />

      {/*totalSold*/}
      <RowInfo
        icon={HandshakeOutlinedIcon}
        text={t('ProductInfo-3', {num: totalSold})}
        css={css`
          color: ${theme.palette.jade.light};
          svg {
            fill: ${theme.palette.primary.main};
          }
        `}
      />

      {/*totalFavorite*/}
      <RowInfo
        icon={FavoriteBorderOutlinedIcon}
        text={t('ProductInfo-4', {num: totalFavorite})}
        css={css`
          color: ${theme.palette.jade.light};
          svg {
            fill: ${theme.palette.ruby.main};
          }
        `}
      />

      {/*remainSkills*/}
      <RowInfo
        icon={BookOutlinedIcon}
        text={t(isSoldOut ? 'ProductInfo-remain-sold-out' : 'ProductInfo-remain', {num: remainSkills})}
        css={css`
          color: ${isSoldOut ? theme.palette.ruby.main : ''};
          svg {
            fill: ${theme.palette.jade.light};
          }
        `}
      />

      <GgjSocialSharing skillId={parseInt(`${router.query.id}`)} css={css`justify-content: center; button {&:not(:last-child) { margin-right: 4px; ]}}`}/>
    </div>
  )
}

function RowInfo(props: { icon: FC, text: string } & WithConditionalCSSProp<'div'>) {
  const { icon: Icon, text } = props
  const theme = useTheme()
  return <Typography
    css={css`
      display: flex;
      align-items: center;
      height: 24px;
      margin-bottom: ${theme.spacing(3)};
      &:last-child {
        margin-bottom: ${theme.spacing(0)};
      }
    `}
    {...props}
  >
    <Icon css={css`margin-right: 18px`}/><span>{text}</span>
  </Typography>
}
