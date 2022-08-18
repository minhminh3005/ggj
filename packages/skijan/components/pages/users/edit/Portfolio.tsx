import React, {useEffect} from 'react'
import {css} from '@emotion/react'
import {Button, Pagination, PaginationItem, Typography} from '@mui/material'
import TrashIcon from '../icons/TrashIcon'
import PortfolioIntro, {IFormValues} from './PortfolioIntro'
import LabelMaxItem from './LabelMaxItem'
import {
  ImageTypes,
  UploadTypes,
  YoutubeTypes
} from '../../../commons/GgjUploadImagesOrYoutube/UploadImagesOrYoutubeContext'
import {UploadImageOrYoutube} from './UploadImageOrYoutube'
import {useAppDispatch, useAppSelector} from '../../../../store/hooks'
import {
  actions,
  createPortfolio,
  updatePortfolio,
  IPortfolio,
  ns,
  deletePortfolioImage
} from '../../../../store/usersSlice'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import {handleReplaceImages, uploadImages} from '../../../commons/GgjUploadImagesOrYoutube'
import {isImageItem} from './const'
import {useTheme} from '@mui/material/styles'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

function Portfolio() {
  const value = ''
  const theme = useTheme()
  const dispatch = useAppDispatch()
  let lstRemoveImages: Array<ImageTypes> = []
  const [page, setPage] = React.useState(1)
  const dataItem: IPortfolio = useAppSelector((state) => state[ns]?.portfolioSelected)
  const portfolios: IPortfolio[] = useAppSelector((state) => state[ns]?.portfolios)
  let lstImages: Array<ImageTypes|YoutubeTypes> = []
  const {t} = useTranslation(nsUserProfile)
  const availableItem = portfolios.map(itm => itm.priority)
  useEffect(() => {
    dispatch(actions.selectPortfolio(1))
  },[])

  const handleChange = (listImages:Array<ImageTypes|YoutubeTypes>) => {
    lstImages = listImages
  }

  const handleRemove = (listImageRemove: Array<ImageTypes>) => {
    lstRemoveImages = listImageRemove
    console.log('lstRemoveImages', lstRemoveImages)
  }

  const onChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value)
    dispatch(actions.selectPortfolio(value))
    dispatch(actions.onResetYoutubeLink(true))
    if(lstImages.length) dispatch(actions.setIsRevokeImg(true))
  }

  const onDeletePortfolio = async() => {
    dispatch(actions.setUserDialog({
      title: t('6'),
      description: t('7'),
      closeText: t('8'),
      okText: t('9'),
      mode: '',
    }))
  }

  const onSubmit = async (data: IFormValues) => {
    const { title, content } = data
    loadingOnHandler()

    const itm: IPortfolio = {
      id: dataItem.id,
      title: title.trim(),
      content: content.trim(),
      url: dataItem.url,
      priority: page
    }

    let result: IPortfolio[] = [itm]

    if(lstImages.length && lstImages[0].type == UploadTypes.Youtube) {
      itm.url = JSON.stringify(lstImages[0])
    }

    // CHECK CREATE PORTFOLIO
    if(!dataItem.id) {
      const res = await createPortfolio(itm)
      result = res.data
      if (res.error) {
        handleError()
        return
      }
    }

    // CHECK DELETE FILE
    const portfolio = portfolios.find((item: IPortfolio) => item.id === itm.id)
    if(!lstImages.length && portfolio && isImageItem(portfolio) && itm.url === '' && itm.url !== portfolio.url) {
      // DELETE IMAGE PORTFOLIO
      await deletePortfolioImage(portfolio)
    }

    // CHECK UPLOAD FILE
    if(lstImages.length && lstImages[0].type == UploadTypes.Image) {
      await handleUpload(result)
    } else if(dataItem.id) {
      // UPDATE PORTFOLIO
      await onUpdatePortfolio(itm)
    } else {
      await handleSuccess(result)
    }
    dispatch(actions.setIsRevokeImg(true))
  }

  const onUpdatePortfolio = async (item: IPortfolio) => {
    const resUpdate = await updatePortfolio(item)
    if (resUpdate.error) await handleError()
    else {
      await handleSuccess(resUpdate.data)
      dispatch(actions.setIsRevokeImg(true))
    }
  }
  const handleUpload = async (list: Array<any>) => {
    const item = list.find((itm: any) => itm.priority === page)
    if(!item) return
    try {
      const result = await handleReplaceImages(`skijan/users/portfolio/${item.id}`, lstImages, uploadImages, false,true)
      if (!result.error) {
        // UPLOAD IMAGE SUCCESS
        const imageUrl = `${result.lstImages[0].imageUrl}`
        item.url = JSON.stringify({imageUrl})
        // UPDATE PORTFOLIO
        await onUpdatePortfolio(item)
      } else {
        // UPLOAD IMAGE FAIL
        handleError()
        return
      }
    } catch {
      handleError()
      return
    }
  }

  const handleError = () => {
    toastHandler({type: 'error'})
    loadingOffHandler()
  }

  const handleSuccess = async (list: Array<any>) => {
    // toastHandler({
    //   type: 'success',
    //   message: t('49')
    // })
    dispatch(actions.setPortfolios(list))
    dispatch(actions.selectPortfolio(page))
    loadingOffHandler()
  }

  return (
    <>
      <div css={css`background: ${theme.palette.divider};
        border-top: solid 1px #fefefe;
        margin: -16px -16px 40px -16px;
        @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
          margin: -32px -32px 36px -32px;
          padding: 21px 28px 20px 28px;
        }
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}>
        <div css={css`padding: 16px 16px 0 16px;
          @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
            padding: 0;
          }
        `}>
          <LabelMaxItem max={10}/>
        </div>
        <Pagination count={10} variant="outlined" shape="rounded"  page={page}
          onChange={onChangePage}
          css={css`
            margin-top: 21px;
            margin-bottom: 21px;
            display: flex;
            justify-content: center;
            .MuiPagination-ul {
              row-gap: 10px;
            }
            .MuiPaginationItem-root {
              width: 32px;
              height: 32px;
              border-radius: 7px;
              border: solid 1px ${theme.palette.smoke.dark};
              color: ${theme.palette.jade.light};
              background-color: #ffffff;
            }
            .Mui-selected {
              color: ${theme.palette.canvas.light};
              background-color: ${theme.palette.jade.light} !important;
            }
            .MuiPaginationItem-previousNext, .MuiPaginationItem-previousNext {
              color: #ffffff;
              background-color: ${theme.palette.smoke.dark};
              border: solid 1px ${theme.palette.smoke.dark};
            }
          `}
          renderItem={(item) => (
            <PaginationItem
              css={
                !availableItem.some(itm => itm === item.page)
                  ?
                  css`
                      border: none !important;
                    `
                  : ''
              }
              {...item}
            />
          )}
        />
      </div>
      <UploadImageOrYoutube
        acceptType='.png,.jpg,.jpeg' maxSize={5}
        onChange={handleChange} onRemove={handleRemove} value={value}
      />
      <PortfolioIntro onSubmit={onSubmit}/>
      {
        dataItem.id ?
          <div css={css`
            display: flex;
            justify-content: flex-end;
            margin-top: 21px
          `}>
            <Button
              onClick={onDeletePortfolio}
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
                {t('29')}
              </Typography>
            </Button>
          </div>
          : <></>
      }
    </>
  )
}

export default React.memo(Portfolio)
