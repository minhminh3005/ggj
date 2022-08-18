import {css} from '@emotion/react'
import {CheckCircle, Edit} from '@mui/icons-material'
import {IconButton, Stack, Typography} from '@mui/material'
import {useTranslation} from 'next-i18next'
import {IBankInfo} from 'store/bankSlice'
import {nsBankTran} from '../../../pages/bank'

const BankCard = ({show, data}: { show: () => void; data: IBankInfo }) => {
  const {t} = useTranslation(nsBankTran)
  return (
    <>
      {data.accountNumber && (
        <div
          css={css`
            display: flex;
            align-items: flex-start;
          `}
        >
          <CheckCircle/>
          <Typography
            variant="caption"
            title={data.bankType == 1 ? t('set') : t('dot-title')}
            className="ggj-wt"
            css={css`
              min-height: 22px;
              margin-left: 10px;
            `}
          >
            {data.bankType == 1 ? t('set') : t('dot-title')}
          </Typography>
        </div>
      )}
      <div
        css={css`
          background: transparent linear-gradient(122deg, #626262 0%, #626262 0%, #222222 100%) 0% 0% no-repeat padding-box;
          box-shadow: 0px 3px 6px #00000029;
          border-radius: 15px;
          height: 160px;
          width: 100%;
          max-width: 240px;
          color: #fafafa;
          margin-top: 8px;
        `}
      >
        <Stack
          css={css`
            height: 100%;
          `}
        >
          <Stack
            justifyContent="space-between"
            direction="row"
            css={css`
              padding: 24px 24px 0px 24px;
            `}
          >
            <div css={css`display: flex`}>
              <Typography variant="body2" title={data.bankName} css={css`
                max-width: 112px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;`}
              >
                {
                  Object.keys(data).length !== 0 ? data.bankType == 1
                    ? data.bankName
                      ? data.bankName
                      : t('common-bank')
                    : t('dot-acc') : t('common-bank')
                }
              </Typography>
              <Typography variant="body2">{t('bank')}</Typography>
            </div>
            <IconButton
              size="small"
              css={css`
                background: #fafafa;
              `}
              onClick={show}
            >
              <Edit
                css={css`
                  color: #222222;
                `}
              />
            </IconButton>
          </Stack>
          <div
            css={css`
              padding: 24px;
              margin-top: auto;
            `}
          >
            {data?.bankType ? (
              data.bankType == 1 ? (
                <>
                  <div
                    css={css`
                      display: inline-flex;
                      gap: 8px;
                    `}
                  >
                    <div css={css`display: flex`}>
                      <Typography variant="body2" title={data.bankBranchName} css={css`
                        max-width: 56px;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;`}
                      >{data.bankBranchName}</Typography>
                      <Typography variant="body2">{t('branch')}</Typography>
                    </div>
                    <Typography variant="body2">{data.accountType == 1 ? t('acc-text-1') : t('acc-text-2')}</Typography>
                    <Typography variant="body2">{data.accountNumber}</Typography>
                  </div>
                  <Typography
                    variant="body2"
                    css={css`
                      margin-top: 8px;
                      max-width: 196px;
                      white-space: nowrap;
                      overflow: hidden;
                      text-overflow: ellipsis;
                    `}
                  >
                    {data.accountHolder}
                  </Typography>
                </>
              ) : (
                <Typography variant="body2">
                  {data.accountNumber.replace(/^(.{4})(.{4})(.{4})(.{4})$/, '$1-$2-$3-$4')}
                </Typography>
              )
            ) : (
              <>
                <div
                  css={css`
                    display: inline-flex;
                    gap: 8px;
                  `}
                >
                  <Typography variant="body2">— {t('branch')}</Typography>
                  <Typography variant="body2">— 0000000</Typography>
                </div>
                <Typography
                  variant="body2"
                  css={css`
                    margin-top: 8px;
                  `}
                >
                  {t('taro')}
                </Typography>
              </>
            )}
          </div>
        </Stack>
      </div>
    </>
  )
}

export default BankCard
