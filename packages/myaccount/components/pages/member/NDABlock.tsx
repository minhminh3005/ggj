import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import Grid from '@mui/material/Grid'
import NextImage, { ImageProps } from 'next/image'

// mui icon
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'

// business icon
import UserCheck from 'components/icons/UserCheck'
import badge_illustration from './assets/badge_illustration.png'
import driver_license_1 from './assets/driver_license_1.png'
import driver_license_2 from './assets/driver_license_2.png'
import health_insurance_card_1 from './assets/health_insurance_card_1.png'
import health_insurance_card_2 from './assets/health_insurance_card_2.png'
import passport_1 from './assets/passport_1.png'
import passport_2 from './assets/passport_2.png'
import resident_register_card from './assets/resident_register_card.png'

// other library import
import { useState } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'

const nsTran = 'components@member'

export default function NDABlock(props: { identity: number, children?: JSX.Element }) {
  const theme = useTheme()
  const identity = [0, 1, 2, 3].includes(props.identity) ? props.identity : 0
  const { t } = useTranslation(nsTran)
  return <div>
    <div css={css`
      display: flex;
      align-items: center;
      margin-bottom: ${theme.spacing(2)}
    `}>
      <UserCheck
        css={css`
          margin-right: 4px;
          fill: ${identity === 1 ? theme.palette.primary.main : ''};
        `}
      />
      <Typography
        variant="body2"
        css={css`
          margin-top: 4px;
          color: ${identity === 2 || identity === 3 ? theme.palette.error.main : ''};
        `}
      >
        <strong>{t(`NDABlock-1-${identity}`)}</strong>
      </Typography>
    </div>
    <Typography variant="body2" mb={2}>{t('NDABlock-2')}</Typography>
    <HelpModal/>
    <Typography variant="body1" mb={3}>{t('NDABlock-4')}</Typography>
    <div css={css`
      background: #FAFAFA;
      padding: ${theme.spacing(3)} ${theme.spacing(2)};
      margin-bottom: ${theme.spacing(4)};
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        padding: ${theme.spacing(3)};
      }
    `}>
      <Typography variant="body2" mb={1}>
        <span css={css`margin-right: 2px;`}>●</span>
        <span>{t('NDABlock-5')}</span>
      </Typography>
      <Typography variant="body2" mb={1}>
        <span css={css`margin-right: 2px;`}>●</span>
        <span>{t('NDABlock-6')}</span>
      </Typography>
      <Typography variant="body2" mb={1}>
        <span css={css`margin-right: 2px;`}>●</span>
        <span>{t('NDABlock-7')}</span>
      </Typography>
      <Typography variant="body2" mb={2}>
        <span css={css`margin-right: 2px;`}>●</span>
        <span>{t('NDABlock-8')}</span>
      </Typography>
      <Typography variant="caption" component="div">{t('NDABlock-9')}</Typography>
      <Typography variant="caption" component="div">{t('NDABlock-10')}</Typography>
    </div>
    { props.children }
  </div>
}

function HelpModal() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const [open, setOpen] = useState(false)
  const closeModal = () => setOpen(false)
  return <>
    <div
      css={css`
        color: ${theme.palette.primary.main};
        display: inline-flex;
        align-items: center;
        margin-bottom: ${theme.spacing(4)};
        cursor: pointer;
      `}
      onClick={() => setOpen(true)}
    >
      <HelpOutlineIcon css={css`margin-right: 4px;`} sx={{ fontSize: 30 }} />
      <Typography variant="subtitle1" css={css`
        color: ${theme.palette.primary.main};
        margin-top: 1px;
        text-decoration: underline;
      `}>
        <strong>{t('NDABlock-3')}</strong>
      </Typography>
    </div>
    <Modal
      open={open}
      onClose={closeModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div css={css`
        position: absolute;
        top: 45%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        height: 60vh;
        width: 350px;
        max-height: 95vh;
        max-width: 95vw;
        outline: none;
        display: flex;
        flex-direction: column;
        border-radius: 5px;
        @media only screen and (min-width: ${theme.breakpoints.values.md}) {
          height: 400px;
          width: 500px;
        }
      `}>
        <div css={css`
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: ${theme.spacing(3)};
        `}>
          <strong>{t('NDABlock-HelpModal-1')}</strong>
          <IconButton size='small' css={css`transform: translateY(-2.5px);`} onClick={closeModal}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          padding-top: 0;
          flex-grow: 1;
          overflow: auto;
          &::-webkit-scrollbar {
            display: none;
          }
        `}>
          <div css={css`
            padding-left: ${theme.spacing(3)};
            padding-right: ${theme.spacing(3)};
            padding-bottom: ${theme.spacing(3)};
            padding-top: 0;
            padding-bottom: ${theme.spacing(4)};`}>
            <Typography>{t('NDABlock-HelpModal-2')}</Typography>
          </div>
          <div css={css`
            padding: 16px 24px 0 24px;
            width: 100%;
            position: relative;
            margin: 0 auto 32px auto;
            @media only screen and (min-width: 768px) {
              width: 232px;
              height: 242px;
              padding: 0;
            }
          `}>
            <NextImage src={badge_illustration} layout="responsive" width="696" height="726"/>
          </div>
          <div css={css`
            background: #9F9F9F;
            color: #fff;
            padding: ${theme.spacing(3)};
          `}><Typography>{t('NDABlock-HelpModal-3')}</Typography></div>
          <div css={css`padding: ${theme.spacing(3)};`}>
            <div css={css`margin-bottom: 10px;`}>
              <Typography variant="body1">{t('NDABlock-HelpModal-4')}</Typography>
            </div>
            <div>
              <Typography variant="caption" css={css`color: red;margin-bottom: 4px`}>{t('NDABlock-HelpModal-5')}</Typography>
            </div>
            <div>
              <Typography variant="caption" css={css`color: red;margin-bottom: 4px`}>{t('NDABlock-HelpModal-6')}</Typography>
            </div>
            <div css={css`margin-bottom: 8px;`}>
              <Typography component={'strong'}>{t('NDABlock-HelpModal-7')}</Typography>
            </div>
            <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} css={css`margin: 10px 0 16px 0`}>
              {/* 1 */}
              <Grid item xs={12} md={6} mb={1}>
                <NDADesCard {...{
                  title: t('NDABlock-HelpModal-8'),
                  subTitle: t('NDABlock-HelpModal-9'),
                  imgSrc1: driver_license_1,
                  imgSrc2: driver_license_2,
                }}/>
              </Grid>

              {/* 2 */}
              <Grid item xs={12} md={6} mb={1}>
                <NDADesCard {...{
                  title: t('NDABlock-HelpModal-10'),
                  subTitle: t('NDABlock-HelpModal-11'),
                  imgSrc1: health_insurance_card_1,
                  imgSrc2: health_insurance_card_2,
                }}/>
              </Grid>

              {/* 3 */}
              <Grid item xs={12} md={6} mb={1}>
                <NDADesCard {...{
                  title: t('NDABlock-HelpModal-12'),
                  subTitle: t('NDABlock-HelpModal-13'),
                  imgSrc1: passport_1,
                  imgSrc2: passport_2,
                  imgH2: '92',
                  minHeight: '177px',
                }}/>
              </Grid>

              {/* 4 */}
              <Grid item xs={12} md={6} mb={1}>
                <NDADesCard {...{
                  title: t('NDABlock-HelpModal-14'),
                  subTitle: t('NDABlock-HelpModal-14'),
                  imgSrc1: resident_register_card,
                  minHeight: '177px',
                }}/>
              </Grid>
            </Grid>
          </div>
          <div css={css`
            background: #9F9F9F;
            color: #fff;
            padding: ${theme.spacing(3)};
          `}><Typography>{t('NDABlock-HelpModal-15')}</Typography></div>
          <div css={css`padding: ${theme.spacing(3)};`}>
            <div css={css`margin-bottom: 10px;`}>
              <Typography variant="body1" css={css`margin-bottom: 4px;`}>{t('NDABlock-HelpModal-16')}</Typography>
            </div>
            <div css={css`margin-bottom: 10px;`}>
              <Typography variant="body1" css={css`margin-bottom: 4px;`}>{t('NDABlock-HelpModal-17')}</Typography>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  </>
}

function NDADesCard(
  props: {
    title: string,
    subTitle: string,
    imgSrc1: ImageProps['src']
    imgSrc2?: ImageProps['src']
    imgH1?: string
    imgW1?: string
    imgH2?: string
    imgW2?: string
    minHeight?: string
  }
) {
  const theme = useTheme()
  return <div
    css={css`
      background: #FAFAFA;
      padding: 16px;
      border-radius: 4px;
      margin-bottom: 16px;
      width: 100%;
      height: 180px;
    `}>
    <div css={css`margin-bottom: 4px;`}><strong>{props.title}</strong></div>
    <div css={css`margin-bottom: ${theme.spacing(3)};`}><Typography variant="body2">{props.subTitle}</Typography></div>
    <div css={css`
      display: flex;
      justify-content: space-between;
      img { max-width: 100%;max-height: 100% }
    `}>
      {
        props.imgSrc1 &&
        <div css={css`width: calc(50% - 8px);max-width: 88px;`}>
          <NextImage src={props.imgSrc1} layout="responsive" width={props.imgW1 || '88'} height={props.imgH1 || '58'}/>
        </div>
      }
      {
        props.imgSrc2 &&
        <div css={css`width: calc(50% - 8px);max-width: 88px;`}>
          <NextImage src={props.imgSrc2} layout="responsive" width={props.imgW2 || '88'} height={props.imgH2 || '58'}/>
        </div>
      }
    </div>
  </div>
}
