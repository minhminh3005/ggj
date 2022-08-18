import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'

// other library import
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
const nsTran = 'components@member'

export default function ConfirmSubmitModal(props: { handleClose: (val: boolean) => void, onSubmit: () => void, open: boolean }) {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const closeModal = () => props.handleClose(false)
  return <>
    <Modal
      open={props.open}
      onClose={closeModal}
      aria-labelledby="modal-modal-contract-note"
      aria-describedby="modal-modal-description-contract-note"
    >
      <div css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        background: #fff;
        min-height: 234px;
        width: 280px;
        max-width: 95vw;
        max-height: 95vh;
        outline: none;
        display: flex;
        flex-direction: column;
        @media only screen and (min-width: ${theme.breakpoints.values.md}) {
          width: 500px;
          min-height: 200px;
        }
      `}>
        <div css={css`
          display: flex;
          justify-content: space-between;
          width: 100%;
          padding: ${theme.spacing(3)};
        `}>
          <strong>{t('ConfirmSubmitModal-1')}</strong>
          <IconButton size='small' css={css`transform: translateY(-2.5px);`} onClick={closeModal}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </div>
        <div css={css`
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 100%;
          padding: ${theme.spacing(3)};
          padding-top: 0;
          flex-grow: 1;
          overflow: auto;
        `}>
          <div>
            <span>{t('ConfirmSubmitModal-2')}</span>
          </div>
          <div css={css`
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              justify-content: flex-end;
            }
          `}>
            <Button
              variant="outlined"
              fullWidth={true}
              size="large"
              css={css`
                margin: 2px;
                width: 108px;
                height: 42px;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
              onClick={closeModal}
            >{t('ConfirmSubmitModal-3')}</Button>
            <Button
              variant="contained"
              fullWidth={true}
              size="large"
              css={css`
                margin: 2px;
                width: 108px;
                height: 42px;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
              onClick={props.onSubmit}
            >{t('ConfirmSubmitModal-4')}</Button>
          </div>
        </div>
      </div>
    </Modal>
  </>
}
