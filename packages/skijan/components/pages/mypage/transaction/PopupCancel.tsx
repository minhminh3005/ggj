import React, {useCallback, useState} from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import Typography from '@mui/material/Typography'
import CloseIcon from '@mui/icons-material/Close'
import Image from 'next/image'
import DialogContent from '@mui/material/DialogContent'
import { Stack, useMediaQuery } from '@mui/material'
import AgreeIllustration from './Images/agreeIllustration.png'
import InqueryIllustration from './Images/inqueryIllustration.png'
import {useAppSelector} from '../../../../store/hooks'
import {ns} from '../../../../store/transactionSlice'
import {SKILL_SALES_STATUS, nsTransaction} from './const'
import {useRouter} from 'next/router'
import {useTranslation} from 'next-i18next'

interface DialogTitleProps {
  children?: React.ReactNode
  onClose: () => void
}

const BootstrapDialogTitle = (props: DialogTitleProps) => {
  const { children, onClose, ...other } = props
  const theme = useTheme()

  return (
    <Stack
      direction={'row'}
      alignItems={'center'}
      justifyContent={'space-between'}
      css={css`
        padding: 14px ${theme.spacing(3)};
        @media (min-width: ${theme.breakpoints.values.md}px) {
          padding: 14px ${theme.spacing(3)} 14px ${theme.spacing(4)};
        }
      `}
      {...other}
    >
      {children}
      <CloseIcon
        onClick={onClose}
        css={css`
          color: ${theme.palette.jade.light};
          cursor: pointer;
        `}
      />
    </Stack>
  )
}

export const PopupCancel = () => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const router = useRouter()
  const {t} = useTranslation(nsTransaction)
  const isMobile = useMediaQuery(
    `(max-width: ${theme.breakpoints.values.md}px)`
  )
  const salesStatus =useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus || SKILL_SALES_STATUS.PROGRESS_STATUS)
  const goToInquiry = useCallback(async () => {
    await router.push('/inquiry')
  }, [router])

  if(salesStatus >SKILL_SALES_STATUS.SELLER_COMPLETE_STATUS)   return null

  function handleClose() {
    setOpen(false)
  }

  function openCancelModal() {
    setOpen(true)
  }


  return (
    <div>
      <Typography
        css={css`
          text-decoration: underline;
          text-align: center;
          cursor: pointer;
          margin-top: 2px;
        `}
        variant="subtitle2"
        onClick={openCancelModal}
      >
        {t('59')}
      </Typography>
      <Dialog fullScreen={isMobile} onClose={handleClose} open={open}>
        <BootstrapDialogTitle onClose={handleClose}>
          <Typography variant="h6">{t('60')}</Typography>
        </BootstrapDialogTitle>

        <DialogContent
          css={css`
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: ${theme.spacing(4)};
            @media (min-width: ${theme.breakpoints.values.md}px) {
              min-width: 500px;
              max-height: 504px;
            }
          `}
          dividers
        >
          <Typography
            css={css`
              letter-spacing: 0.29px;
            `}
            variant="body1"
          >
            {t('61')}
          </Typography>
          <Typography
            variant="h6"
            css={css`
              color: ${theme.palette.primary.main};
              margin-top: ${theme.spacing(3)};
              margin-bottom: ${theme.spacing(4)};
              letter-spacing: 0.36px;
            `}
          >
            {t('62')}
          </Typography>

          <div
            css={css`
              height: 200px;
              width: 200px;
            `}
          >
            <Image
              alt="AgreeIllustration"
              src={AgreeIllustration}
              css={css`
                height: 100%;
                width: 100%;
              `}
            />
          </div>

          <Typography
            css={css`
              letter-spacing: 0.25px;
              text-align: center;
              margin-top: ${theme.spacing(2)};
              margin-bottom: ${theme.spacing(2)};
              @media (min-width: ${theme.breakpoints.values.md}px) {
                margin-bottom: unset;
              }
            `}
            variant="body2"
          >
            {t('63')}
          </Typography>

          <Typography
            css={css`
              letter-spacing: 0.25px;
              text-align: center;
            `}
            variant="body2"
          >
            {t('64')}
            <br />
            {t('65')}
          </Typography>

          <Typography
            css={css`
              color: ${theme.palette.primary.main};
              letter-spacing: 0.36px;
              border-top: 1px solid ${theme.palette.smoke.light};
              width: 100%;
              text-align: center;
              margin-top: ${theme.spacing(5)};
              padding-top: 25px;
              cursor: pointer;
              font-weight: 500;
              margin-bottom: ${theme.spacing(4)};
              @media (min-width: ${theme.breakpoints.values.md}px) {
                margin-bottom: ${theme.spacing(3)};
              }
            `}
            variant="h6"
            onClick={goToInquiry}
          >
            {t('66')}
          </Typography>

          <div
            css={css`
              height: 150px;
              width: 150px;
            `}
          >
            <Image
              alt="InqueryIllustration"
              src={InqueryIllustration}
              css={css`
                height: 100%;
                width: 100%;
              `}
            />
          </div>

          <Typography
            css={css`
              text-align: center;
              margin-top: ${theme.spacing(2)};
            `}
            variant="subtitle2"
          >
            {t('67')}
          </Typography>
        </DialogContent>
      </Dialog>
    </div>
  )
}
