import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

// other library import
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import Typography from '@mui/material/Typography'
import ErrorOutlineRoundedIcon from '@mui/icons-material/ErrorOutlineRounded'
import { useState } from 'react'

const nsTran = 'components@member'

export default function ContractNoteModal() {
  const theme = useTheme()
  const [openContractModal, setOpenContractModal] = useState<boolean>(false)
  const { t } = useTranslation(nsTran)
  const closeModal = () => setOpenContractModal(false)
  return <>
    <div
      css={css`
        color: ${theme.palette.error.main};
        display: inline-flex;
        align-items: center;
        margin-bottom: ${theme.spacing(3)};
      `}
      onClick={() => setOpenContractModal(true)}
    >
      <ErrorOutlineRoundedIcon css={css`margin-right: 4px;`} sx={{ fontSize: 30 }} />
      <Typography
        variant="caption"
        css={css`
          color: ${theme.palette.error.main};
          margin-top: 1px;
          text-decoration: underline;
          cursor: pointer;
        `}
      >{t('root-24')}</Typography>
    </div>
    <Modal
      open={openContractModal}
      onClose={closeModal}
      aria-labelledby="modal-modal-contract-note"
      aria-describedby="modal-modal-description-contract-note"
    >
      <div css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fff;
        height: 280px;
        width: 350px;
        max-height: 95vh;
        max-width: 95vw;
        outline: none;
        display: flex;
        flex-direction: column;
        border-radius: 4px;
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
          <strong>{t('ContractNoteModal-1')}</strong>
          <IconButton size='small' css={css`transform: translateY(-2.5px);`} onClick={closeModal}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div css={css`
          display: flex;
          flex-direction: column;
          width: 100%;
          padding: ${theme.spacing(3)};
          padding-top: 0;
          flex-grow: 1;
          overflow: auto;
        `}>
          <div>
            <div css={css`margin-bottom: ${theme.spacing(4)};color: red;`}>{t('ContractNoteModal-2')}</div>
            <div
              css={css`margin-bottom: ${theme.spacing(2)};`}
              dangerouslySetInnerHTML={{__html: t('ContractNoteModal-3') }} />
            <div
              css={css`margin-bottom: ${theme.spacing(2)};`}
              dangerouslySetInnerHTML={{__html: t('ContractNoteModal-4') }} />
            <div
              css={css`margin-bottom: ${theme.spacing(2)};`}
              dangerouslySetInnerHTML={{__html: t('ContractNoteModal-5') }} />
            <div
              css={css`margin-bottom: ${theme.spacing(2)};`}
              dangerouslySetInnerHTML={{__html: t('ContractNoteModal-6') }} />
            <div
              css={css`margin-bottom: ${theme.spacing(2)};`}
              dangerouslySetInnerHTML={{__html: t('ContractNoteModal-7') }} />
          </div>
        </div>
      </div>
    </Modal>
  </>
}
