import {ArrowForwardIos} from '@mui/icons-material'
import {IconButton, Typography, useTheme, Tooltip} from '@mui/material'
import {marginBottom, nsTran} from 'pages/mypage/sales'
import {IProduct} from './interfaces'
import {css} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {formatNumber} from 'common/number'
import Link from 'next/link'
import noDataImg from './img/noImg.png'

interface IBoxItem {
  masterTitle: string
  item: IProduct
}

const BoxItem = ({masterTitle, item}: IBoxItem) => {
  const theme = useTheme()
  const {t} = useTranslation(nsTran)
  const hasData = Object.keys(item).length !== 0
  return (
    <div>
      {item.date && (
        <Typography variant="subtitle1" css={marginBottom}>
          {t('date-format', {
            year: new Date(item.date).getFullYear(),
            month: new Date(item.date).getMonth() + 1,
          })}
        </Typography>
      )}
      <div
        css={css`
          display: flex;
          align-items: flex-start;
          width: 100%;
        `}
      >
        <div css={css`
          display: flex;
          position: relative;
          overflow: hidden;
          border-radius: 10px;
          width: 56px;
          height: 56px;
          margin-right: 8px;
        `}
        >
          <img
            alt={`${hasData && item.titleProduct ? item.titleProduct : ''}`}
            src={hasData && item.imageUrl ? item.imageUrl : noDataImg.src }
            css={css`
              max-width: 100%;
              max-height: 100%;
              object-fit: cover;
            `}
          />
        </div>
        <div
          css={css`
            flex: 1;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: space-between;
              flex-direction: column;
            `}
          >
            <Tooltip title={`${hasData && item.titleProduct ? item.titleProduct : ''}`}>
              <Typography
                component="span"
                variant="subtitle1"
                css={css`
                  overflow: hidden;
                  text-overflow: ellipsis;
                  min-height: 24px;
                  width: 100%;
                  white-space: normal;
                  display: -webkit-box;
                  -webkit-line-clamp: 1;
                  -webkit-box-orient: vertical;
                `}
              >
                {hasData && item.titleProduct ? item.titleProduct : t('no-data-title')}
              </Typography>
            </Tooltip>
            {
              hasData && <Typography variant="caption">
                {masterTitle === t('hit-product')
                  ? `${formatNumber(item.totalSales)}${t('piece')}`
                  : `${t('currency')}${formatNumber(
                    item.totalProfit
                  )}`}
              </Typography>
            }
          </div>

        </div>
        {
          hasData && (
            <IconButton
              css={css`&:hover {
                background-color: transparent;
              }`}
            >
              <Link href={`/mypage/display/skill/${item.productId}`} passHref>
                <a>
                  <ArrowForwardIos
                    css={css`
                      height: 12px;
                      width: 12px;
                      color: ${theme.palette.smoke.dark}
                    `}
                  />
                </a>
              </Link>
            </IconButton>
          )
        }
      </div>
    </div>
  )
}

export default BoxItem
