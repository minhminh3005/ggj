import {css} from '@emotion/react'
import EditIcon from '@mui/icons-material/Edit'
import Typography from '@mui/material/Typography'
import {useTheme} from '@mui/material/styles'
import Button, {ButtonProps} from '@mui/material/Button'
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows'
import LaunchOutlinedIcon from '@mui/icons-material/LaunchOutlined'
import {WithConditionalCSSProp} from '@emotion/react/types/jsx-namespace'
import {useTranslation} from 'next-i18next'
import {ns} from './const'
import { ns as storeNs } from 'store/mypage/display/skill/skillDetailSlice'
import {useRouter} from 'next/router'
import Link from 'next/link'
import {
  ChangeStatusBtn,
} from '../ChangeStatusBtn'
import ModalConfirmChangeStatus, {
  ModalConfirmChangeStatusNS,
  useModalConfirmChangeStatus
} from '../ChangeStatusBtn/ModalConfirmChangeStatus'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import skillDetailSlice from 'store/mypage/display/skill/skillDetailSlice'
import {STATUS_MAP, SaleStatusType, STATUS_MAP_REVERSE} from '../skill-common-types'

function CustomButton(props: ButtonProps) {
  const theme = useTheme()
  return <Button
    {...props}
    css={css`
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: ${theme.spacing(2)};
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        padding: 0;
        flex-direction: row;
        &:not(:last-child) {
          margin-right: ${theme.spacing(4)};
        }
      }
      .MuiTypography-root {
        font-size: 14px;
      }
      .MuiButton-startIcon {
        background: #496CDC14;
        height: 44px;
        width: 44px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 10px;
        margin: 0 0 ${theme.spacing(2)} 0;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          margin: 0 ${theme.spacing(2)} 0 0;
        }
      }
    `}
  >
    {props.children}
  </Button>
}

export default function NavigateButton(props: WithConditionalCSSProp<'div'>) {
  const theme = useTheme()
  const {t} = useTranslation([ns, ModalConfirmChangeStatusNS])
  const router = useRouter()
  const dispatch = useAppDispatch()
  const onClickEdit = () => router.push(`/mypage/display/skill/edit?id=${router.query.id}`)
  const storeStatusType = useAppSelector(state => state[storeNs]?.data.infoSkillDetail.statusType)
  const {
    openModal,
    setOpenModal,
    modalProps,
    setModalProp,
    calcModalState,
    onSubmitStatus,
    setCurrentItem,
    newStatusType,
    setNewStatusType,
  } = useModalConfirmChangeStatus()
  const handleSelectItem = (val: SaleStatusType) => {
    setModalProp(calcModalState(STATUS_MAP_REVERSE[storeStatusType] ?? 0, val, t)) // get init value
    setNewStatusType(STATUS_MAP[val])
    setCurrentItem({id: parseInt(`${router.query.id}`), statusType: STATUS_MAP[val]})
    setOpenModal(true)
  }
  const handleSubmitStatus = async () => {
    const {isError} = await onSubmitStatus()
    !isError && dispatch(skillDetailSlice.actions.setStatusType(newStatusType))
  }
  return (
    <div
      {...props}
      css={css`
        display: flex;
        justify-content: space-around;
        @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
          justify-content: flex-start;
        }
      `}
    >
      <ChangeStatusBtn
        statusTypeInitValue={storeStatusType}
        css={css`margin-bottom: ${theme.spacing(1)}`}
        Button={CustomButton}
        handleSelectItem={handleSelectItem}
        ButtonProps={{
          css: css`
            white-space: nowrap;
            color: ${theme.palette.jade.light};
          `,
          startIcon: <DesktopIcon isActive={storeStatusType === STATUS_MAP['sale']}/>,
        }}
      />
      {
        storeStatusType !== STATUS_MAP['close'] && <CustomButton
          css={css`
          white-space: nowrap;
          color: ${theme.palette.jade.light};
        `}
          startIcon={<EditIcon/>}
          onClick={onClickEdit}
        >
          <Typography>{t('5')}</Typography>
        </CustomButton>
      }
      {
        storeStatusType !== STATUS_MAP['draft'] && <Link href={`/skill/${router.query.id}`} passHref>
          <a css={css`text-decoration: none;`}>
            <CustomButton
              css={css`
                white-space: nowrap;
                color: ${theme.palette.jade.light};
              `}
              startIcon={<LaunchOutlinedIcon/>}
            >
              <Typography>{t('15')}</Typography>
            </CustomButton>
          </a>
        </Link>
      }
      <ModalConfirmChangeStatus
        open={openModal}
        setOpen={setOpenModal}
        onSubmit={handleSubmitStatus}
        {...modalProps}
      />
    </div>
  )
}

function DesktopIcon(props: { isActive?: boolean }) {
  const {isActive} = props
  const theme = useTheme()
  return <div css={css`
    position: relative;
    height: 24px;
    width: 24px;
  `}>
    <div
      css={css`
        position: absolute;
        background: ${isActive ? theme.palette.primary.main : 'gray'};
        height: 8px;
        width: 8px;
        bottom: -1px;
        right: 1px;
        border: 1px solid #fff;
        border-radius: 100px;
      `}
      color="inherit"
    />
    <DesktopWindowsIcon/>
  </div>
}
