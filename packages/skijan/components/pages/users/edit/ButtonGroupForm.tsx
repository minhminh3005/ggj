import { css } from '@emotion/react'
import { Stack, Typography, Button } from '@mui/material'
import TrashIcon from '../icons/TrashIcon'
import ButtonForm from './ButtonForm'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {actions, IUserCareer, ns} from 'store/usersSlice'
import {useTheme} from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

const ButtonGroupFrom = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsUserProfile)
  const dataItem: IUserCareer = useAppSelector((state) => state[ns]?.editItem)

  const openConfirmModal = () => {
    dispatch(actions.setUserDialog({
      title: t('6'),
      description: t('7'),
      closeText: t('8'),
      okText: t('9'),
      mode: '',
    }))
  }
  return (
    <Stack direction="row" justifyContent={dataItem.id ? 'space-between' : 'flex-end'} mt={5} css={css`flex-wrap: wrap;`} >
      { dataItem.id &&
        <Button
          onClick={openConfirmModal}
          css={css`
            height: 38px;
            :hover {
              background: none;
            }
          `}
        >
          <TrashIcon
            css={css`
              width: 14px;
              height: 15px;
              color: ${theme.palette.ruby.main};
            `}
          />
          <Typography
            variant="caption"
            css={css`
              color: ${theme.palette.ruby.main};
              margin-left: 4px;
              text-decoration: underline;
            `}
          >
            {t('10')}
          </Typography>
        </Button>
      }
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
        <Button
          onClick={() => dispatch(actions.setShowEditForm(false))}
          variant="outlined"
          css={css`
            height: 38px;
            border-radius: 10px;
            width: 104px;
            color: ${theme.palette.smoke.dark};
            border: solid 1px ${theme.palette.smoke.dark};
            background: white;
            font-weight: 400;
          `}
        >
          {t('11')}
        </Button>
        <ButtonForm css={css`height: 38px; border-radius: 10px; width: 104px; font-weight: 400;`} />
      </Stack>
    </Stack>
  )
}
export default ButtonGroupFrom
