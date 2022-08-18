import { css } from '@emotion/react'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import Link from 'next/link'

export const nsFooter = 'common@footer'

const FooterLink = (props: { href: string, title: string }) => {
  const theme = useTheme()
  return (
    <Link href={props.href} passHref>
      <a
        target="_blank"
        title={props.title}
        rel="noopener noreferrer"
        css={css`
        text-decoration: none;
        color: ${theme.palette.text.primary}
        `}
      >
        <Typography variant="body2" mb={3}>{props.title}</Typography>
      </a>
    </Link>
  )
}


export function Footer() {
  const theme = useTheme()
  const { t } = useTranslation(nsFooter)
  return <div
    css={css`
      width: 100%;
      background: ${theme.palette.canvas.dark};
      padding: ${theme.spacing(6)} ${theme.spacing(3)} 0 ${theme.spacing(3)};
      margin-bottom: ${theme.spacing(1)};
      color: #222222DE;
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        margin-bottom: 0;
        padding: ${theme.spacing(6)} ${theme.spacing(4)} 0 ${theme.spacing(4)};
      }
    `}
  >
    <Stack
      divider={<Divider flexItem />}
      direction={{ xs: 'column', lg: 'row' }}
      spacing={2}
      justifyContent="space-between"
    >
      <Stack pt={2} pb={6}>
        <Typography variant="body2" mb={3}><strong>{t('Footer-1')}</strong></Typography>
        <FooterLink title={t('Footer-2')} href='https://corp.gogojungle.co.jp' />
        {/*<Typography variant="body2" mb={3}>{t('Footer-3')}</Typography>*/}
      </Stack>
      <Stack pt={2} pb={6}>
        <Typography variant="body2" mb={3}><strong>{t('Footer-5')}</strong></Typography>
        <FooterLink title={t('Footer-6')} href='/guide' />
        <FooterLink title={t('Footer-7')} href='/faq' />
        <FooterLink title={t('Footer-8')} href='/inquiry' />
      </Stack>
      <Stack pt={2} pb={6}>
        <Typography variant="body2" mb={3}><strong>{t('Footer-9')}</strong></Typography>
        <FooterLink title={t('Footer-12')} href='/terms/service' />
        <FooterLink title={t('Footer-13')} href='/terms/seller' />
        <FooterLink title={t('Footer-14')} href='/terms/operation' />
        <FooterLink title={t('Footer-15')} href='/terms/policy' />
        <FooterLink title={t('Footer-16')} href='/tokushou' />
      </Stack>
    </Stack>
    <Divider />
    <Stack css={css`
      padding-top: ${theme.spacing(3)};
      padding-bottom: ${theme.spacing(3)};
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        padding-top: ${theme.spacing(4)};
        padding-bottom: ${theme.spacing(5)};
      }
    `}>
      <Typography variant="caption">© {new Date().getFullYear()} GogoJungle, Inc.</Typography>
    </Stack>
  </div>
}
