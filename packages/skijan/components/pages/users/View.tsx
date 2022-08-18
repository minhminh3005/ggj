import { css } from '@emotion/react'
import { Hidden, Typography, useMediaQuery, useTheme } from '@mui/material'

import { useTranslation } from 'next-i18next'
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined'
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined'
import ReviewsOutlinedIcon from '@mui/icons-material/ReviewsOutlined'
import Profile from './view/Profile'
import Products from './view/Products'
import Reviews from './view/Reviews'
import Email from './view/Email'
import GgjLazyRenderComp from 'components/commons/GgjLazyRenderComp'
import GgjKeepAliveTabs from 'components/commons/GgjKeepAliveTabs'
import SkijanIcon from '../../icons/SkijanIcon'
import {nsUserProfile} from '../../../common/constant'

const View = () => {
  const theme = useTheme()
  const { t } = useTranslation(nsUserProfile)
  const mobileView = useMediaQuery(`${theme.breakpoints.down('md')}`)

  return (
    <GgjKeepAliveTabs
      tabsProps={{
        css: css`
          border-bottom: 1px solid #e6e6e6;
          margin-bottom: 47px;
          .MuiTab-textColorInherit {
            color: ${theme.palette.smoke.light};
          }
          .MuiTypography-root {
            line-height: 20px;
          }
          .Mui-selected {
            color: ${theme.palette.primary.main};
          }
          .MuiTabs-indicator {
            height: 3px;
          }
          .MuiButtonBase-root {
            min-height: 50px;
          }
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            margin-top: -47px;
          }
        `,
        indicatorColor: 'primary',
        textColor: 'inherit',
        centered: !mobileView,
        variant: mobileView ? 'fullWidth' : 'standard',
      }}
      data={[
        {
          title: t('profile'),
          tabContent: (
            <GgjLazyRenderComp css={css`padding-bottom: 50px`} component={Profile} minHeight={'50vh'} />
          ),
          minHeight: '100vh',
          tabProps: {
            css: css`
              width: 150px;
              min-width: auto;
              @media (max-width: ${theme.breakpoints.values.md}px) {
                width: auto;
              }
            `,
            icon: <BadgeOutlinedIcon />,
            iconPosition: 'start',
            label: (
              <Hidden mdDown>
                <Typography variant="body2" component="h3">{t('profile')}</Typography>
              </Hidden>
            ),
          },
        },
        {
          title: t('listing'),
          tabContent: (
            <GgjLazyRenderComp
              css={css`
                max-width: 800px;
                margin: 0 auto;
              `}
              component={Products}
              minHeight={'50vh'}
            />
          ),
          minHeight: '100vh',
          tabProps: {
            css: css`
              width: 150px;
              min-width: auto;
              @media (max-width: ${theme.breakpoints.values.md}px) {
                width: auto;
              }
            `,
            icon: <SkijanIcon />,
            iconPosition: 'start',
            label: (
              <Hidden mdDown>
                <Typography variant="body2" component="h3">{t('listing')}</Typography>
              </Hidden>
            ),
          },
        },
        {
          title: t('eval'),
          tabContent: (
            <GgjLazyRenderComp
              css={css`
                max-width: 800px;
                margin: 0 auto;
              `}
              component={Reviews}
              minHeight={'50vh'}
            />
          ),
          minHeight: '100vh',
          tabProps: {
            css: css`
              width: 150px;
              min-width: auto;
              @media (max-width: ${theme.breakpoints.values.md}px) {
                width: auto;
              }
            `,
            icon: <ReviewsOutlinedIcon />,
            iconPosition: 'start',
            label: (
              <Hidden mdDown>
                <Typography variant="body2" component="h3">{t('eval')}</Typography>
              </Hidden>
            ),
          },
        },
        {
          title: t('msg'),
          tabContent: (
            <GgjLazyRenderComp component={Email} minHeight={'50vh'} />
          ),
          minHeight: '110vh',
          tabProps: {
            css: css`
              width: 150px;
              min-width: auto;
              @media (max-width: ${theme.breakpoints.values.md}px) {
                width: auto;
              }
            `,
            icon: <EmailOutlinedIcon />,
            iconPosition: 'start',
            label: (
              <Hidden mdDown>
                <Typography variant="body2" component="h3">{t('msg')}</Typography>
              </Hidden>
            ),
          },
        },
      ]}
    />
  )
}

export default View
