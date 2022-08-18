import React, {useEffect} from 'react'
import {css} from '@emotion/react'
import {Button, Typography} from '@mui/material'
import Drawer from '@mui/material/Drawer'
import {useTheme} from '@mui/material/styles'
import Stack from '@mui/material/Stack'

// store
import {useAppSelector, useAppDispatch} from 'store/hooks'
import {
  ns,
  actions,
  TUserSettingMode,
  IPortfolio,
  deleteItem
} from 'store/usersSlice'

// setting components
import Intro from 'components/pages/users/edit/Intro'
import Career from 'components/pages/users/edit/Career'
import CorrespondenceFields from 'components/pages/users/edit/CorrespondenceFields'
import Portfolio from 'components/pages/users/edit/Portfolio'
import Qualification from 'components/pages/users/edit/Qualification'
import Schedule from 'components/pages/users/edit/Schedule'
import Skill from 'components/pages/users/edit/Skill'
import {ChevronLeft} from '@mui/icons-material'
import UserDialog from './UserDialog'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'
import {CAREER, CLOSED, MY_SKILL, PORTFOLIO, QUALIFICATION, SPECIALTY, HEADER_FORM} from './const'

const types = {
  schedule: {
    text: '19',
    content: <Schedule/>,
  },
  intro: {
    text: '20',
    content: <Intro/>,
  },
  specialty: {
    text: '21',
    content: <CorrespondenceFields/>,
  },
  mySkill: {
    text: '22',
    content: <Skill/>,
  },
  career: {
    text: '23',
    content: <Career/>,
  },
  qualification: {
    text: '24',
    content: <Qualification/>,
  },
  portfolio: {
    text: '25',
    content: <Portfolio/>,
  },
  closed: {
    text: '',
    content: <div/>,
  },
}

const DrawerHeader = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const {t} = useTranslation(nsUserProfile)
  const settingMode = useAppSelector(
    (state) => state[ns]?.settingMode
  ) as TUserSettingMode

  const handleDrawerClose = () => {
    dispatch(actions.setSettingMode(CLOSED))
    dispatch(actions.setShowEditForm(false))
  }

  return (
    <Button
      id="uu"
      onClick={handleDrawerClose}
      css={css`
        display: flex;
        align-items: center;
        background: white;
        min-height: ${HEADER_FORM};
        height: ${HEADER_FORM};
        border-radius: 0;
        width: 100%;
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          background: ${theme.palette.smoke.light};
        }
      `}
    >
      <ChevronLeft
        css={css`
          color: ${theme.palette.jade.dark};
        `}
      />
      <Stack
        direction="row"
        justifyContent="center"
        css={css`
          width: calc(100% - 50px);
        `}
      >
        <Typography
          variant="h6"
          css={css`
            color: ${theme.palette.jade.dark};
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              color: ${theme.palette.smoke.dark};
            }
          `}
        >
          {t(types[settingMode].text)}
        </Typography>
      </Stack>
    </Button>
  )
}

const DrawerBody = () => {
  const theme = useTheme()
  const settingMode = useAppSelector(
    (state) => state[ns]?.settingMode
  ) as TUserSettingMode
  const show: boolean = useAppSelector((state)=>state[ns].showEditForm)

  useEffect(() => {
    if(!show) return
    // TODO: An - scroll smoothly
    const element = document.getElementById('drawer')
    if(element) element.scrollIntoView()
  }, [show])

  return (
    <div
      id="drawer"
      css={css`
        padding: ${theme.spacing(3)};
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          padding: ${theme.spacing(5)};
        }
      `}
    >
      {types[settingMode].content}
    </div>
  )
}

function EditForm() {
  // const {t} = useTranslation(nsUserProfile)
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const settingMode = useAppSelector((state) => state[ns]?.settingMode)
  const title = useAppSelector((state) => state[ns]?.userDialog.title)
  const description = useAppSelector((state) => state[ns]?.userDialog.description)
  const closeText = useAppSelector((state) => state[ns]?.userDialog.closeText)
  const okText = useAppSelector((state) => state[ns]?.userDialog.okText)
  const editItem = useAppSelector((state) => state[ns]?.editItem)
  const portfolioSelected: IPortfolio = useAppSelector((state) => state[ns]?.portfolioSelected)

  const handleClose = () => {
    dispatch(actions.setUserDialog({
      title: '',
      description: '',
      closeText: '',
      okText: '',
      mode: ''
    }))
  }

  const handleOk = async () => {
    if (editItem.id !== undefined || (settingMode === PORTFOLIO && portfolioSelected.id !== undefined)) {
      try {
        loadingOnHandler()
        const id = settingMode === PORTFOLIO ? portfolioSelected.id : editItem.id
        const res = await deleteItem(id, settingMode)
        if (res.error) {
          toastHandler({type: 'error'})
          return
        }
        switch (settingMode) {
        case CAREER:
          dispatch(actions.setCareers(res.data))
          break
        case SPECIALTY:
          dispatch(actions.setSpecialty(res.data))
          break
        case MY_SKILL:
          dispatch(actions.setMySkills(res.data))
          break
        case QUALIFICATION:
          dispatch(actions.setQualifications(res.data))
          break
        case PORTFOLIO:
          dispatch(actions.setPortfolios(res.data))
          dispatch(actions.selectPortfolio(0))
          break
        default:
          break
        }
        dispatch(actions.setShowEditForm(false))
        // toastHandler({type: 'success', message: t(`delete-${settingMode}-success`)})
      } catch (e) {
        toastHandler({type: 'error'})
      } finally {
        loadingOffHandler()
      }
    }
    handleClose()
  }

  return (
    <Drawer
      anchor="right"
      open={settingMode !== CLOSED}
      variant="persistent"
      // transitionDuration={400}
      css={css`
        position: relative;
        background: #1b6d85;

        .MuiDrawer-paper {
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: scroll;

          &::-webkit-scrollbar {
            width: 5px;
            cursor: pointer;

            &-track {
              background: #ebebeb;
              border-radius: 4px;
            }

            &-thumb {
              background: #d6d6d6;
              border-radius: 7px;
              cursor: pointer;
            }
          }

          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            width: 420px;
            background: #ebebeb;
          }
        }
      `}
    >
      <div id="drawerDialog">
        <DrawerHeader/>
        <DrawerBody/>
        <UserDialog
          open={Boolean(title)}
          title={title}
          description={description}
          closeText={closeText}
          okText={okText}
          parentId="drawerDialog"
          onClose={handleClose}
          onOk={handleOk}
        />
      </div>
    </Drawer>
  )
}

export default EditForm
