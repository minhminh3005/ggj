import { css } from '@emotion/react'
import { Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'
import useMediaQuery from '@mui/material/useMediaQuery'
import { ItemMessage } from '../../../layouts/common/Information'
import { ns } from 'store/appSlice'
import { useAppSelector } from 'store/hooks'
import { ItemProps } from 'pages/information'
export const nsTran = 'surface@information'
const InformationCommon = ({type}: {type: 'information' | 'notification'}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const informationList = useAppSelector((state) => state[ns].informationList || {})
  return (
    <section>
      <Stack
        css={css`
          max-width: 100%;
          margin: 0 auto;
          width: 100%;
          display: none;  
        `}
        justifyContent="flex-start"
        alignItems="center"
        direction="column"
      >
        <Stack
          css={css`
            width: 100%;
            position: relative;
            height: 48px;
            margin: 0;
            border-bottom: 1px solid #f6f6f6;
            box-shadow: #f6f6f6 0px 3px 6px, #f6f6f6 0px 3px 6px;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: 40px 0 48px;
              position: static;
              height: unset;
              border-bottom: unset;
              box-shadow: unset;
            }`}
          justifyContent={useMediaQuery(`(max-width:${theme.breakpoints.values.lg}px)`) ? 'center' : 'space-between'}
          alignItems="center"
          direction="row">
          <Typography
            css={css`
            text-align: center;
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              text-align: unset;
            }`} variant={useMediaQuery(`(max-width:${theme.breakpoints.values.lg}px)`) ? 'subtitle1' : 'h5'}>
            {t('6')}
          </Typography>
          <Typography
            css={css`
              margin: 10px 16px 0 0;
              color: ${theme.palette.primary.main};
              cursor: pointer;
              position: absolute;
              top: 0;
              right: 0;
              @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
                margin-right: 32px;
              }
              @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
                position: static;
                margin-right: unset;
                margin: unset;
              }`} variant={useMediaQuery(`(max-width:${theme.breakpoints.values.lg}px)`) ? 'subtitle1' : 'h5'}>
            {t('7')}
          </Typography>
        </Stack>
        <Stack
          css={css`
            width: 100%;
            margin-top: 8px;
            max-width: 360px;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              max-width: 668px;
              margin-top: 24px;
            }
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin-top: unset;
              margin: 0 auto;
              max-width: unset;
            }`}
          direction="column"
          justifyContent="flex-start"
          alignItems="center">
          {informationList?.data?.length > 0 && informationList.data.map((valuesMessage: ItemProps, indexMessage: number) => {
            return (
              <Link
                href={`/${type === 'notification' ? 'notification' : 'information'}/${valuesMessage?.id || -1}`}
                key={valuesMessage?.id || -1}>
                <a css={css`
                      text-decoration: none;
                      cursor: pointer;
                      width: 100%;`}>
                  <ItemMessage
                    key={valuesMessage?.id}
                    indexMessage={indexMessage}
                    valuesMessage={valuesMessage}/>
                </a>
              </Link>
            )
          })}
        </Stack>
        <div
          css={css`
            display: none;
            justify-content: center;
            align-items: center;
            width: 100%;
            cursor: pointer;
            height: 44px;
            border: 1px solid ${theme.palette.primary.main};
            border-radius: 0.5rem;
            max-width: 440px;
            margin: 24px 0;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              display: flex;
            }
            @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
              margin: 20px 0;
              max-width: 504px;
            }`}>
          <Typography
            css={css`color: ${theme.palette.primary.main};`} variant="subtitle2">
            {t('8')}
          </Typography>
        </div>
      </Stack>
    </section>
  )
}
export default InformationCommon