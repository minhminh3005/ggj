import {
  useTheme,
  Button,
  Typography,
  Dialog,
  Pagination,
  useMediaQuery,
  Stack,
  PaginationItem, Box,
} from '@mui/material'
import {ChevronLeft} from '@mui/icons-material'
import {css, SerializedStyles} from '@emotion/react'
import {useTranslation} from 'next-i18next'
import {ChangeEvent, ElementType, useEffect, useState} from 'react'

import FieldItem from './FieldItem'
import SkillItem from './SkillItem'
import CareerItem from './CareerItem'
import QualificationItem from './QualificationItem'

// store import
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {
  ns,
  actions,
  TUserSettingMode,
  IPortfolio,
  IUserSkill,
  IUserCareer,
  IUserSelfIntro,
  ISpecialty,
  IUserQualification,
} from 'store/usersSlice'
import LoadMoreButton from './LoadMoreButton'
import EditIcon from '../icons/EditIcon'
import {
  CAREER, CLOSED, EDIT,
  getImgUrlFromJSON,
  getYoutubeLink,
  INTRO,
  isImageItem,
  MY_SKILL, PORTFOLIO,
  QUALIFICATION,
  SPECIALTY, VIEW
} from '../edit/const'
import {nsUserProfile} from '../../../../common/constant'
import GgjLazyRenderComp from '../../../commons/GgjLazyRenderComp'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'

interface IFieldSection<T> {
  data: T[]
  component: ElementType
  type: TUserSettingMode
  collapsedSize?: number
}

// TODO: An - Create Portfolio first -  mock DB is in Notion: Create SKill Service

const Title = ({name, type}: { name: string; type: TUserSettingMode }) => {
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state[ns]?.mode || VIEW)
  const showEditForm: boolean = useAppSelector((state)=>state[ns]?.showEditForm)
  const settingMode = useAppSelector(
    (state) => state[ns]?.settingMode || 'settingMode'
  )
  const theme = useTheme()
  const tabletToPc = useMediaQuery(`${theme.breakpoints.up('md')}`)

  const showSetting = async() => {
    if(showEditForm) await dispatch(actions.setShowEditForm(false))
    dispatch(actions.setSettingMode(type))
    if (settingMode === type && settingMode !== CLOSED)
      dispatch(actions.setSettingMode(CLOSED))
    else dispatch(actions.setSettingMode(type))
  }

  return (
    <div
      css={css`
        width: 100%;
        display: flex;
        justify-content: ${type === INTRO && mode !== EDIT
      ? tabletToPc
        ? 'flex-start'
        : 'center'
      : 'space-between'};
        min-height: 30px;
        word-break: break-word;
      `}
    >
      <Typography variant="h6">{name}</Typography>
      {mode === EDIT && (
        <div
          css={css`
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            background: ${theme.palette.smoke.dark};
            border-radius: 4px;
            width: 32px;
            height: 32px;
            box-shadow: 0 3px 6px #00000029;
            cursor: pointer;
          `}
          onClick={showSetting}
        >
          <EditIcon css={css`width: 32px; height: 32px`}/>
        </div>
      )}
    </div>
  )
}

const NoData = ({text}: { text: string }) => {
  const theme = useTheme()
  return (
    <div
      css={css`
        height: 33px;
        display: flex;
        margin-top: 10px;
        align-items: center;
        justify-content: center;
        background: ${theme.palette.canvas.light};
        border-radius: 7px;
        color: ${theme.palette.jade.light};
      `}
    >
      <Typography variant="body2">{text}</Typography>
    </div>
  )
}

export const CustomDivider = () => (
  <div
    css={css`
      margin: 10px 0;
      border: 1px solid #f2f2f2;
    `}
  />
)

const IntroContent = ({content}:{content: string}) => {
  return (
    <Typography
      variant="body2"
      css={css`
                color: #444444;
                word-break: break-all;
                white-space: pre-wrap;
                margin-top: 24px;
                line-height: 2;
              `}
    >
      {content}
    </Typography>
  )
}

const Intro = ({data}: { data: IUserSelfIntro }) => {
  const {t} = useTranslation(nsUserProfile)
  const lines = (data.content || '').split('\n').length || 0

  return (
    <>
      <Title name={data.title ? data.title : data.content ? '' : t('intro-title')} type={INTRO}/>
      {!data.content ? (
        <NoData text={t('46')}/>
      ) : (
        data.content.length > 150 || lines > 3 ?
          <>
            <LoadMoreButton name={t('see')} collapsedSize={78}>
              <IntroContent content={data.content}/>
            </LoadMoreButton>
          </>
          :
          <IntroContent content={data.content}/>
      )
      }
    </>
  )
}

const FieldSection = <T, >({data, component, type}: IFieldSection<T>) => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const El = component

  if(data.length > 3) {
    const me: T[] = JSON.parse(JSON.stringify(data))
    return (
      <>
        <Title name={t(`${type}-title`)} type={type}/>
        <CustomDivider/>
        {me.splice(0,3).map((item, index) => (
          <El data={item} key={`${index}`}/>
        ))}
        <LoadMoreButton name={t('see')} cssCustom={css`margin-top: ${theme.spacing(3)}!important;`}>
          {me.map((item, index) => (
            <div css={css`margin-top: ${theme.spacing(4)};`} key={`${index}`}>
              <El data={item} />
            </div>
          ))}
        </LoadMoreButton>
      </>
    )
  }

  return (
    <>
      <Title name={t(`${type}-title`)} type={type}/>
      {data.length == 0 ? (
        <NoData text={t('46')}/>
      ) : (
        <>
          <CustomDivider/>
          {data.map((item, index) => (
            <El data={item} key={`${index}`}/>
          ))}
        </>
      )}
    </>
  )
}

const PortfolioContainer = ({data}: { data: IPortfolio[] }) => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  return (
    <>
      <Title name={t('portfolio-title')} type={PORTFOLIO}/>
      {data.length == 0 ? (
        <NoData text={t('46')}/>
      ) : (
        <>
          <div css={css`
            @media only screen and (max-width: ${theme.breakpoints.values.md}px) {
              display: none;
            }
          `}>
            <CustomDivider/>
          </div>
          <div
            css={css`
              margin-top: 20px;
              display: grid;
              gap: 16px;
              grid-template-columns: repeat(2, 1fr);
              @media (min-width: ${theme.breakpoints.values.md}px) {
                grid-template-columns: repeat(3, 1fr);
              }
            `}
          >
            {data.map((item, index) => (
              <Portfolio
                key={`${index}`}
                item={item}
                itemIndex={index}
              />
            ))}
          </div>
        </>
      )}
    </>
  )
}

const PortfolioImage = (item: IPortfolio) => {
  const imgSrc = getImgUrlFromJSON(item)

  return (
    <img src={imgSrc} alt=""
      css={css`
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: cover;
        object-position: center;
      `}
    />
  )
}

const Portfolio = ({item, itemIndex}: { item: IPortfolio, itemIndex: number }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <div
        onClick={handleClickOpen}
        css={css`
          position: relative;
          overflow: hidden;
          cursor: pointer;
          box-shadow: 0 3px 6px #00000029;
          padding-top: 100%;
        `}
      >
        <GgjLazyRenderComp
          component={PortfolioImage}
          componentProps={{
            id: item.id,
            url: item.url,
            title: item.title,
            content: item.content,
            priority: item.priority
          }}
          minHeight={'100px'}
        />
        {
          !isImageItem(item) &&
          <>
            <Box color="primary" aria-label="upload avatar" component="span" css={css`
            position: absolute;
            top: calc(50% - ${theme.spacing(5)}/2);
            left: calc(50% - ${theme.spacing(5)}/2);
            text-align: center;
            background: #C2C3BC;
            border-radius: 50%;
            border: none;
            width: ${theme.spacing(5)};
            height: ${theme.spacing(5)};
            color: #FFFFFF;
            display: flex;
            align-items: center;
            justify-content: center;
          `}>
              <PlayArrowIcon css={css`
              width: 20px;
              height: 20px;`}/>
            </Box>
          </>
        }
      </div>
      {
        open && <PortfolioDialog open={open} itemIndex={itemIndex} handleClose={handleClose}/>
      }
    </>
  )
}


const PortfolioDialog = ({
  open,
  handleClose,
  itemIndex
}: {
  open: boolean
  itemIndex: number | 0
  handleClose: () => void
}) => {

  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const [page, setPage] = useState(1)
  const portfolios: IPortfolio[] = useAppSelector((state) => state[ns]?.portfolios)
  const [currentData, setCurrentData] = useState<IPortfolio>(portfolios[0])
  const [availableItem, setAvailableItem] = useState<Array<number>>([])
  const {t} = useTranslation(nsUserProfile)
  const imgSrc = getImgUrlFromJSON(currentData)

  useEffect(() => {
    const items = portfolios.map(item => item.priority)
    setAvailableItem(items)
  }, [portfolios])

  useEffect(() => {
    const item = portfolios.find(itm => itm.priority === page) as IPortfolio
    if(!item) return
    setCurrentData(item)
  }, [page])

  useEffect(() => {
    const item = portfolios.find((itm, idx) => idx === itemIndex) as IPortfolio
    if(!item) return
    setPage(item.priority)
  }, [itemIndex])

  return (
    <Dialog
      fullScreen={fullScreen}
      open={open}
      onClose={handleClose}
      css={css`
        .MuiPaper-root {
          max-width: 816px;
          width: 100%;
          border-radius: 0;
        }
      `}
    >
      {fullScreen && (
        <Button
          css={css`
            display: flex;
            justify-content: start;
            color: ${theme.palette.text.primary};
            padding: 15px;
          `}
          onClick={handleClose}
        >
          <ChevronLeft/>
          <Typography
            variant="body1"
            css={css`
              margin: 0 auto;
            `}
          >
            {t('47')}
          </Typography>
        </Button>
      )}
      <div
        css={css`
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 24px;
          position: sticky;
          top: 0;
          z-index: 1;
          background: ${theme.palette.common.white};
          background-color: ${theme.palette.common.white};
          @media (min-width: ${theme.breakpoints.values.md}px) {
            padding-top: 30px;
            padding-bottom: 24px;
            background: ${theme.palette.canvas.light};
          }
        `}
      >
        <Pagination
          count={10}
          page={page}
          variant="outlined"
          shape="rounded"
          siblingCount={5}
          onChange={(event: ChangeEvent<unknown>, value: number) => {
            setPage(value)
          }}
          renderItem={(item) => (
            <PaginationItem
              css={
                !availableItem.some(itm => itm === item.page)
                  ?
                  css`
                  opacity: 0.38;
                  pointer-events: none;
                  cursor: default;
                `
                  : ''
              }
              {...item}
            />
          )}
          css={css`
            .MuiPagination-ul {
              row-gap: 10px;
            }

            .MuiPaginationItem-root {
              border-radius: 7px;
              border: solid 1px ${theme.palette.smoke.dark};
              color: ${theme.palette.jade.light};
              background-color: #ffffff;
            }

            .Mui-selected {
              color: ${theme.palette.canvas.light};
              background-color: ${theme.palette.jade.light} !important;
            }

            .MuiPaginationItem-previousNext,
            .MuiPaginationItem-previousNext {
              color: #ffffff;
              background-color: ${theme.palette.smoke.dark};
              border: solid 1px ${theme.palette.smoke.dark};
            }
          `}
        />
      </div>
      <div
        css={css`
          display: grid;
          gap: 20px;
          grid-template-areas: 'dialog-2' 'dialog-1' 'dialog-3';
          padding: 36px 16px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            gap: 24px 34px;
            grid-template-rows: auto 1fr;
            grid-template-columns: repeat(2, 1fr);
            padding: 75px 48px 103px 78px;
            grid-template-areas: 'dialog-1 dialog-2' 'dialog-1 dialog-3';
          }
        `}
      >
        <div
          css={css`
            width: 100%;
            height: 100%;
            overflow: hidden;
            position: relative;
            grid-area: dialog-1;
            padding-top: 100%;
            max-height: 328px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              align-items: center;
            }
          `}
        >
          {
            isImageItem(currentData) ? (
              <img src={imgSrc} alt="" css={css`
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        object-fit: cover;
                        object-position: center;
                      `}
              />
            )
              : (
                <div css={css`
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    width: 100%;
                    height: 100%;
                `}>
                  <iframe
                    width="100%"
                    height="100%"
                    src={getYoutubeLink(currentData)}
                    frameBorder="0"
                  />
                </div>
              )
          }
        </div>
        <div
          css={css`
            grid-area: dialog-2;
          `}
        >
          <Typography variant="h6" css={css`
            white-space: pre-wrap;
            word-break: break-all;`}>
            {currentData.title}
          </Typography>
        </div>
        <div
          css={css`
            grid-area: dialog-3;
          `}
        >
          <Typography variant="caption" css={css`
            white-space: pre-wrap;
            word-break: break-all;
          `}>
            {currentData.content}
          </Typography>
        </div>
      </div>
      {!fullScreen && (
        <div
          css={css`
            display: flex;
            justify-content: flex-end;
            padding-right: 32px;
            padding-bottom: 23px;
            position: sticky;
            bottom: 0;
            background-color: ${theme.palette.common.white};
          `}
        >
          <Button onClick={handleClose}>
            <Typography
              css={css`
                color: ${theme.palette.primary.main};
              `}
              variant="subtitle1"
            >
              {t('48')}
            </Typography>
          </Button>
        </div>
      )}
    </Dialog>
  )
}

const Profile = ({cssExtend}: { cssExtend?: SerializedStyles }) => {
  const theme = useTheme()
  const {t} = useTranslation(nsUserProfile)
  const userSelfIntroduce: IUserSelfIntro = useAppSelector((state) => state[ns]?.userSelfIntroduce)
  const careers: IUserCareer[] = useAppSelector((state) => state[ns]?.careers)
  const mySkills: IUserSkill[] = useAppSelector((state) => state[ns]?.mySkills)
  const portfolios: IPortfolio[] = useAppSelector((state) => state[ns]?.portfolios)
  const specialty: ISpecialty[] = useAppSelector((state) => state[ns]?.specialty)
  const qualifications: IUserQualification[] = useAppSelector((state) => state[ns]?.qualifications)
  const mode = useAppSelector(
    (state) => state[ns]?.mode || 'mode'
  )
  return (
    <>
      {
        (userSelfIntroduce.content ||
          userSelfIntroduce.title ||
          careers.length !== 0 ||
          mySkills.length !== 0 ||
          portfolios.length !== 0 ||
          specialty.length !== 0 ||
          qualifications.length !== 0 || mode == EDIT) ? (
            <div
              css={css`
              display: grid;
              grid-row-gap: 40px;
              grid-column-gap: 75px;
              grid-template-areas: 'column-1' 'column-3' 'column-2';
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                grid-template-columns: repeat(5, 1fr);
                grid-template-rows: auto 1fr;
                grid-template-areas: 'column-1 column-1 column-1 column-3 column-3' 'column-2 column-2 column-2 column-3 column-3';
              }
              ${cssExtend}
            `}
            >
              <div
                css={css`
                grid-area: column-1;
              `}
              >
                <Intro data={userSelfIntroduce}/>
              </div>
              <div
                css={css`
                grid-area: column-2;
              `}
              >
                <PortfolioContainer data={portfolios}/>
              </div>
              <div
                css={css`
                grid-area: column-3;
              `}
              >
                <Stack spacing={4}>
                  <FieldSection data={specialty} component={FieldItem} type={SPECIALTY}/>
                  <FieldSection data={mySkills} component={SkillItem} type={MY_SKILL}/>
                  <FieldSection data={careers} component={CareerItem} type={CAREER}/>
                  <FieldSection data={qualifications} component={QualificationItem} type={QUALIFICATION}/>
                </Stack>
              </div>
            </div>
          ) : (
            <div
              css={css`
              text-align: center;
            `}
            >
              <Typography
                variant="subtitle1"
                css={css`
                color: #b4b4b4;
              `}
              >
                {t('no-data')}
              </Typography>
            </div>
          )}
    </>
  )
}

export default Profile
