import React from 'react'
import { css } from '@emotion/react'
import { Chip, Typography } from '@mui/material'
import Image from 'next/image'
import EntryImg from './assets/entryIllustration.png'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { nsTranSurfaceSearchLayout } from 'components/layouts'

const KeywordsHistory = ({
  onSelect,
}: {
  onSelect?: (keyword: string) => void
}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTranSurfaceSearchLayout[1])
  const keywords = [
    {
      label: 'デザイン',
      value: '1',
    },
    {
      label: 'デザ',
      value: '2',
    },
    {
      label: 'デザイ',
      value: '3',
    },
    {
      label: 'デザイン 4',
      value: '4',
    },
  ]

  function handleChange(value: string) {
    onSelect && onSelect(value)
  }

  return (
    <div
      css={css`
        padding: 0 ${theme.spacing(3)};
      `}
    >
      <div
        css={css`
          display: flex;
          justify-content: space-between;
          margin-bottom: ${theme.spacing(3)};
        `}
      >
        <Typography variant="h6">{t('1')}</Typography>
        <Typography
          css={css`
            color: ${theme.palette.ruby.main};
          `}
          variant="subtitle2"
        >
          {t('2')}
        </Typography>
      </div>

      <div
        css={css`
          display: flex;
          flex-wrap: wrap;
        `}
      >
        {keywords.map(({ label, value }, index) => (
          <Chip
            onClick={() => handleChange(value)}
            key={index}
            css={css`
              background-color: #f1f3fc;
              border-radius: ${theme.spacing(3)};
              padding: 6px 12px;
              &:not(:last-child) {
                margin-right: ${theme.spacing(2)};
              }
              margin-bottom: ${theme.spacing(2)};
            `}
            label={label}
          />
        ))}
      </div>

      <div
        css={css`
          width: 100%;
          border: 1px solid #35477f;
          background: #22222280 0 0 no-repeat padding-box;
          border-radius: 10px;
          justify-content: center;
          align-items: center;
          padding-top: 10px;
          margin-top: 40px;
          position: relative;
          display: none;
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            display: flex;
          }
        `}
      >
        <Image
          css={css`
            position: absolute;
            z-index: -1;
          `}
          src={EntryImg}
          width="300px"
          height="88px"
          alt="Entry"
        />
        <Typography
          css={css`
            position: absolute;
            top: calc(50% - 14px);
            left: calc(50% - 62px);
            color: white;
            font-style: italic;
          `}
          variant="subtitle1"
        >
          {t('3')}
        </Typography>
      </div>
    </div>
  )
}

export default React.memo(KeywordsHistory)
