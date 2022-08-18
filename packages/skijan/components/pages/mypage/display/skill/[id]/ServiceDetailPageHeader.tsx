import {css} from '@emotion/react'
import Typography from '@mui/material/Typography'
import {useTheme} from '@mui/material/styles'
import NavigateButtons from './NavigateButtons'
import {ns as storeNs} from 'store/mypage/display/skill/skillDetailSlice'
import {useAppSelector} from 'store/hooks'

export default function ServiceDetailPageHeader() {
  const theme = useTheme()
  const skillTitle = (useAppSelector(state => state[storeNs]?.data.infoSkillDetail.title))
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        margin-bottom: ${theme.spacing(3)};
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin-bottom: ${theme.spacing(4)};
        }
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          min-height: 44px;
          margin-bottom: ${theme.spacing(2)};
        }
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: center;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding-right: ${theme.spacing(2)};
          }
        `}
      >
        <Typography
          variant="h6"
          title={skillTitle}
          css={css`
          font-size: 16px;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            font-size: 20px;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: pre-wrap;
            word-break: break-word;
          }
        `}
        >{skillTitle}</Typography>
      </div>
      {/* button */}
      <NavigateButtons
        css={css`
          max-height: 48px;
          display: none;
          margin-left: auto;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            display: flex;
          }
        `}
      />
    </div>
  )
}
