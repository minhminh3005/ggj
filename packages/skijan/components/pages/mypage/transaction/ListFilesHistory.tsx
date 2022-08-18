import {css} from '@emotion/react'
import {Typography, useTheme, Stack} from '@mui/material'
import FileItem from './FileItem'
import {DOWNLOAD, IMAGE, SKILL_SALES_STATUS, nsTransaction} from './const'
import { AttachmentProps,ns } from 'store/transactionSlice'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import { useCallback, useMemo } from 'react'
import {actions as actionImageViewer } from 'components/commons/GgjChatImageViewer'
import GgjLazyRenderComp from '../../../commons/GgjLazyRenderComp'
import {useTranslation} from 'next-i18next'

export interface FileTypes {
  name: string,
  fileType: string,
  url: string | undefined,
  ext: string | undefined,
}

export const ListFilesHistory = () => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const dispatch = useAppDispatch()
  const attachment: AttachmentProps<string>[] = useAppSelector((state) => state[ns]?.DETAIL_listFiles || [])
  const salesStatus = useAppSelector((state) => state[ns]?.DETAIL_transactionInfo?.salesStatus || SKILL_SALES_STATUS.PROGRESS_STATUS)
  const imagesList = useMemo(() =>  attachment.filter(item => item.fileType === IMAGE).map(e => {
    return {
      name: e.fileName,
      url: e.url
    }
  }), [attachment])
  const findImageIndex = useCallback((url : string) => imagesList.map(itm => itm.url).indexOf(url), [imagesList])
  const handleClickFileItem = (item : AttachmentProps<string>) => {
    if(item.fileType === IMAGE) {
      const clickedImageIndex = findImageIndex(item.url || '')
      dispatch(actionImageViewer.setFirstViewingImageIndex(clickedImageIndex === -1 ? 0 : clickedImageIndex))
      dispatch(actionImageViewer.setViewingImages(imagesList))
    }
  }
  return <div>
    <Typography variant="h6">{t('57')}</Typography>
    <Stack direction="column" css={css`
      background: ${theme.palette.canvas.light};
      border: 1px solid ${theme.palette.divider};
      border-radius: 10px;
      margin-top: ${theme.spacing(3)};
      padding: ${theme.spacing(3)} ${theme.spacing(2)} ${theme.spacing(3)} ${theme.spacing(3)};
      gap: ${theme.spacing(3)};
      max-width: calc(100vw - 32px);
      @media only screen and (min-width: ${theme.breakpoints.values.lg}px) {
        max-width: 100%;
      }
    `}>
      {
        (
          !attachment?.length
          ||
          salesStatus === SKILL_SALES_STATUS.SELLER_CANCEL
          ||
          salesStatus === SKILL_SALES_STATUS.BUYER_CANCEL
        )
          ?
          <Typography variant="subtitle1" css={css`color: ${theme.palette.smoke.dark}`}>
            {t('58')}
          </Typography>
          :
          <>
            {attachment?.length > 0 && attachment.map((item: AttachmentProps<string>, index) => (
              <GgjLazyRenderComp
                key={index}
                component={FileItem}
                minHeight={40}
                componentProps={{
                  ext: item.ext,
                  url: item.url,
                  name: item.fileName,
                  fileType: item.fileType,
                  colorIcon: theme.palette.common.white,
                  colorBgIcon: theme.palette.primary.main,
                  colorText: salesStatus <= SKILL_SALES_STATUS.BUYER_COMPLETE_STATUS ? theme.palette.jade.light : '',
                  btnMode: DOWNLOAD,
                  onClickFileItem: () => handleClickFileItem(item),
                }}
              />
            ))}
          </>
      }
    </Stack>
  </div>
}
