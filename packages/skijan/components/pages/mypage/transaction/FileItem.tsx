import React, {useEffect, useRef, useState} from 'react'
import {css} from '@emotion/react'
import SvgItem from './SvgItem'
import {useTheme} from '@mui/material/styles'
import {IconButton, Stack, Typography} from '@mui/material'
import {DOWNLOAD, IMG_TYPES} from './const'

export interface IFile {
  ext: string
  name: string
  url?: string
  imgSrc?: string
  fileType?: string
  colorIcon: string
  colorBgIcon: string
  colorText: string
  btnMode?: string
  onClickDownloadIcon?: () => void
  onClickFileItem?: () => void
}

const FileItem = (item: IFile) => {
  const theme = useTheme()
  const name = item.name
  const ext = name.slice(name.length - 7)
  const myRef = useRef<HTMLInputElement>(null)
  const [isTruncate, setIsTruncate] = useState(false)

  useEffect(() => {
    if(!myRef.current) return
    if(myRef.current.clientWidth < myRef.current.scrollWidth) {
      setIsTruncate(true)
    }
  }, [])

  return (
    <Stack direction={'row'} justifyContent={'space-between'} alignItems={'center'}>
      <Stack onClick={item.onClickFileItem} direction={'row'} alignItems={'center'} css={css`overflow: hidden; cursor: pointer;`}>
        <div css={css`background: ${!IMG_TYPES.includes(item.ext) || !IMG_TYPES.includes(item.fileType as string) ? item.colorBgIcon : 'white' };
              min-width: 40px;
              height: 40px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 10px;
              margin-right: ${theme.spacing(2)};`}>
          <SvgItem ext={item.ext} imgSrc={item.imgSrc || item.url} width={25} height={25} color={item.colorIcon} />
        </div>
        {
          item.url
            ?
            <div css={css`
                display: flex;
                flex-direction: row;
                overflow: hidden;
            `}>
              <Typography
                ref={myRef}
                component={IMG_TYPES.includes(item.fileType as string) ? 'span' : 'a'}
                href={item.url} download={item.name}
                variant="subtitle1" css={css`
                  text-overflow: ellipsis;
                  max-width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  color: ${item.colorText};
                  text-decoration: unset;
                  text-decoration-color: unset;
              `}>
                {name}
              </Typography>
              {
                isTruncate && <Typography variant="subtitle1" css={css`white-space: nowrap;color: ${item.colorText};`}>{ext}</Typography>
              }
            </div>
            :
            <div css={css`
                display: flex;
                flex-direction: row;
                overflow: hidden;
            `}>
              <Typography
                ref={myRef}
                variant="subtitle1" css={css`
                  text-overflow: ellipsis;
                  max-width: 100%;
                  white-space: nowrap;
                  overflow: hidden;
                  color: ${item.colorText};
                  text-decoration: unset;
                  text-decoration-color: unset;
              `}>
                {name}
              </Typography>
              {
                isTruncate && <Typography variant="subtitle1" css={css`white-space: nowrap;color: ${item.colorText};`}>{ext}</Typography>
              }
            </div>
        }
      </Stack>
      {item.btnMode &&
          <IconButton onClick={item.onClickDownloadIcon} aria-label={item.btnMode} component="span">
            { item.btnMode === DOWNLOAD
              ?
              <a href={item.url} download={item.name}><SvgItem ext={item.btnMode} width={20} height={20} color={item.colorText} /></a>
              :
              <SvgItem ext={item.btnMode} width={20} height={20} color={item.colorText} />
            }
          </IconButton>
      }
    </Stack>
  )
}
FileItem.defaultProps = {
  ext: '', name: '', url: '', colorIcon: '', colorBgIcon: '', colorText: '',btnMode: '', onClick: undefined
}

export default FileItem
