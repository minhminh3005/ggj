import {css} from '@emotion/react'
import {Avatar, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import MarginIcon from '@mui/icons-material/Margin'
import HttpsIcon from '@mui/icons-material/Https'
import MailOutlineIcon from '@mui/icons-material/MailOutline'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import HowToRegIcon from '@mui/icons-material/HowToReg'
import {memo, useMemo} from 'react'
import {useAppSelector} from 'store/hooks'
import Link from 'next/link'
import {ns as skillDetailSliceNs, State as SkillDetailState} from 'store/skillSlice'
import Divider from '@mui/material/Divider'
import {useTranslation} from 'next-i18next'
import Button from '@mui/material/Button'

import {skillDetailNsTran as nsTran} from 'components/pages/skill/[id]/const'

interface DataButtonProps {
  title: string;
  status: boolean;
}

const themeCustom = {
  color: {
    black: '#3F3F3F',
    green: '#A6B8EE',
  }
}
const SellerInfo = () => {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const nickName = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.nickName ?? '')
  const selfIntroduce = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.selfIntroduce ?? '')
  const imageUrl = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.imageUrl ?? '')
  const sellerId = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.sellerId ?? '')
  const identityStatus = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.identityStatus ?? '')
  const isNda = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.isNda ?? '')
  const isIdentityStatusConfirmed = useMemo(() => identityStatus === 1,[identityStatus])

  return (
    <section
      css={css`
        width: 100%;
        margin: 0 0 32px 0;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-bottom: 48px;
        }
      `}
    >
      <Typography
        variant="h6"
        css={css`
          color: ${themeCustom.color.black};
          margin: 0 auto;
          width: 100%;
        `}
        component="h2"
      >
        {t('3')}
      </Typography>
      <Stack
        justifyContent="flex-start"
        alignItems="center"
        direction="column"
        css={css`
          width: 100%;
          border-radius: 0.65rem;
          max-height: 468px;
          margin: 16px auto 0 auto;
          border: 1px solid ${theme.palette.divider};
          padding: 24px 8px 13px 8px;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            padding: 24px 11px 13px 11px  ;
          }
        `}
      >
        <div css={css`padding: 0 16px;
          width: 100%;`}>
          <Typography
            className="ggj-wt"
            variant="h6"
            component="p"
            css={css`
              width: 100%;
              color: ${themeCustom.color.black};
              cursor: pointer;
            `}
          >
            {nickName}
          </Typography>
          <div
            css={css`
              display: flex;
              width: 100%;
              margin: 8px 0 16px 0;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                margin: 16px 0 32px 0;
              }`}
          >
            <Avatar css={css`background: gray;
              width: 80px;
              height: 80px;
              margin-right: ${theme.spacing(4)};`} src={imageUrl}/>
            <div css={css`
              display: flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
            `}>
              <IdentityOrDNALabel active={Boolean(isIdentityStatusConfirmed)} icon={<HowToRegIcon/>} title={isIdentityStatusConfirmed ? t('identity-1') : t('identity-!1')}/>
              <IdentityOrDNALabel active={Boolean(isNda)} icon={<HttpsIcon/>} title={isNda === 1 ? t('NDA-1') : t('NDA-!1')} css={css`margin-bottom: 9px`}/>
            </div>
          </div>
          <div css={css`width: 100%;`}>
            <Typography
              className="ggj-wt ggj-wt-l-6"
              css={css`
                  width: 100%;
                  color: ${theme.palette.jade.light};
                  line-height: 24px;
                  margin-bottom: 8px;
                  cursor: pointer;
                `}
              variant="subtitle1"
              component="p"
            >
              {selfIntroduce}
            </Typography>
          </div>

          {/*link to user detail*/}
          <Stack
            justifyContent="flex-end"
            alignItems="center"
            direction="row"
            css={css`
              width: 100%;
              margin: auto 0 19px 0;
              cursor: pointer;
            `}
          >
            <Link href={`/users/${sellerId ?? ''}`} passHref>
              <Typography
                css={css`
                  color: ${theme.palette.primary.main};
                  margin-right: 4.59px;
                `}
                variant="subtitle2"
                component="p"
              >{t('8')}
                <ArrowForwardIosIcon css={css`font-size: 0.8rem;color: ${theme.palette.primary.main}`}/>
              </Typography>
            </Link>
          </Stack>
          <Divider/>
        </div>

        {/*coming soon button*/}
        <ComingSoonButtons/>
      </Stack>
    </section>
  )
}

function ComingSoonButtons() {
  const {t} = useTranslation(nsTran)
  const theme = useTheme()
  const identityStatus = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.identityStatus ?? '')
  const isNda = useAppSelector(state => (state[skillDetailSliceNs] as SkillDetailState).apiResObj?.sellerInfo?.isNda ?? '')
  const isIdentityStatusConfirmed = useMemo(() => identityStatus === 1,[identityStatus])
  return (
    <Stack justifyContent="space-between" alignItems="center" direction="row" css={css`
      margin-top: 7px;
      padding: 8px 14px;
      position: relative;
      height: 64px;
      width: 100%;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        padding: 0.5rem;
      }
    `}>
      <CustomButton title={t('1')} status={Boolean(isNda)} indexButton={0}/>
      <CustomButton title={t('2')} status={Boolean(isIdentityStatusConfirmed)} indexButton={2}/>
      <Typography variant="caption" css={css`
        color: white;
        position: absolute;
        top: 50%;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        opacity: 0.45;
        z-index: 10;
        border-radius: 10px;
        justify-content: center;
        background-color: black;
        left: 50%;
        transform: translate(-50%, -50%);`}>Comming soon...</Typography>
    </Stack>
  )
}

function IdentityOrDNALabel({
  icon,
  title,
  active,
  className
}: { icon: JSX.Element, title: string, active: boolean, className?: string }) {
  const theme = useTheme()
  const myCss = css`
    width: 100%;

    .MuiSvgIcon-root {
      color: ${theme.palette.smoke.light};
      font-size: 1rem;
    }

    .text {
      color: ${theme.palette.jade.light};
      margin-left: 8px;
    }

    &.active {
      .MuiSvgIcon-root {
        color: ${theme.palette.primary.main};
        font-size: 1rem;
      }
    }
  `
  return (
    <Stack
      direction="row"
      css={myCss}
      className={className + (active ? ' active' : '')}>
      {icon}
      <Typography className="text" variant="subtitle2" component="p">{title}</Typography>
    </Stack>
  )
}

function CustomButton({status, indexButton, title}: DataButtonProps & { indexButton: number }) {
  const theme = useTheme()
  const Icon = indexButton === 0 ? MailOutlineIcon : MarginIcon

  const containerCss = css`
    height: 44px;
    width: 100%;
    border-radius: 10px;
    border-color: ${theme.palette.primary.main};
    color: ${theme.palette.primary.main};
    &.Mui-disabled {
      border-color: ${themeCustom.color.green};
      color: ${themeCustom.color.green};
    }
    &:first-of-type {
      margin-right: 10px;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        margin-right: 20px;
      }
    }
  `
  return (
    <Button variant="outlined" css={containerCss} startIcon={<Icon />} disabled={!status}>
      {title || ''}
    </Button>
  )
}

export default memo(SellerInfo)
