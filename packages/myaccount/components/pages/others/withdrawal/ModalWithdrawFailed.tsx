import { css } from '@emotion/react'
import {
  Button, Modal, Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { useAppDispatch, useAppSelector } from '../../../../store/hooks'
import { actions, ns } from '../../../../store/others/withdrawalSlice'
const nsTran = 'components@withdrawal'



function ModalWithdrawFailed () {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const isOpenModal = useAppSelector(state => state[ns].isOpenModal)

  const handleClick = () => {
    dispatch(actions.setIsOpenModal(false))
  }

  return (
    <Modal
      open={Boolean(isOpenModal)}
      aria-labelledby="modal-modal-title-withdraw-failed"
      aria-describedby="modal-modal-description-withdraw-failed"
    >
      <Stack css={css`
        position: absolute;
        top: 20%;
        left: 50%;
        transform: translate(-50%, -20%);
        border-radius: 4px;
        background: #fff;
        min-height: 173px;
        width: 280px;
        max-width: 95vw;
        max-height: 95vh;
        outline: none;
        @media screen and (min-width: ${theme.breakpoints.values.md}px) {
          width: 500px;
          min-height: 200px;
        }
      `}>
        <Typography variant="body1" p={4} pt={{xs: 3, md: 4}}>
          <strong>{ t('17') }</strong>
        </Typography>
        <Stack justifyContent="space-between" px={4} pt={0} pb={3} flexGrow={1}>
          <Typography variant="subtitle2" mb={3}>
            { t('18') }
          </Typography>
          <Stack alignItems={{ xs: 'center', md: 'flex-end' }}>
            <Button
              variant="contained"
              fullWidth
              size="large"
              css={css`
                width: 108px;
                height: 42px;
                white-space: nowrap;
                text-overflow: ellipsis;
              `}
              onClick={handleClick}
            >OK</Button>
          </Stack>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default ModalWithdrawFailed
