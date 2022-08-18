import { css } from '@emotion/react'
import { useTranslation } from 'next-i18next'
import {
  Modal, Stack, Typography
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { ns, actions } from 'store/mypage/display/skill/skillInputSlice'
import { GgjContainButton, GgjOutlineButton } from 'components/commons/GgjButton'
import { memo } from 'react'
import {ggjDebounce} from '../../../../../../common/utils'
import {nsTran} from 'components/pages/mypage/display/skill/input/const'

function ModalConfirmPublishSkill (props: {
  handleSubmitSkill: (isPublish: boolean) => void
}) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const isShowConfirmModal = useAppSelector(state => state[ns].isShowConfirmModal)
  const {handleSubmitSkill} = props

  const onSubmit = () => {
    handleSubmitSkill(true)
  }
  const onCloseModal = () => {
    dispatch(actions.setIsShowConfirmModal(false))
  }

  return (
    <Modal
      open={isShowConfirmModal}
      aria-labelledby="modal-modal-title-withdraw-failed"
      aria-describedby="modal-modal-description-withdraw-failed"
    >
      <Stack css={css`
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: 4px;
        background: #fff;
        min-height: 140px;
        width: 280px;
        max-width: 95vw;
        max-height: 95vh;
        outline: none;
        @media screen and (min-width: ${theme.breakpoints.values.md}px) {
          width: 500px;
        }
      `}>
        <Typography variant="body1" p={4} pb={0} flexGrow={1}>
          <strong>{ t('46') }</strong>
        </Typography>
        <Stack p={4} direction="row" spacing={4} justifyContent={{ xs: 'center', md: 'flex-end' }}>
          <GgjOutlineButton
            variant="outlined"
            fullWidth
            size="large"
            css={css`
              width: 108px;
              height: 42px;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
            onClick={onCloseModal}
          >{ t('47') }</GgjOutlineButton>
          <GgjContainButton
            fullWidth
            size="large"
            css={css`
              width: 108px;
              height: 42px;
              white-space: nowrap;
              text-overflow: ellipsis;
            `}
            onClick={ggjDebounce(onSubmit)}
          >{ t('48') }</GgjContainButton>
        </Stack>
      </Stack>
    </Modal>
  )
}

export default memo(ModalConfirmPublishSkill)
