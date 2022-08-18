import { Divider, IconButton, InputAdornment, InputBase, Stack, useMediaQuery } from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from '@mui/icons-material/Search'
import { useTheme } from '@mui/material/styles'

import React, {useEffect, useRef, useState} from 'react'
import { useRouter } from 'next/router'
import { css } from '@emotion/react'
import {buildQueryString} from 'common/utils'
import {useTranslation} from 'next-i18next'
import {SQ, allParams} from './consts'

function SearchInput({isCallFromNavbar, closeModal}:{isCallFromNavbar?: boolean, closeModal?: () => void}) {
  const { t } = useTranslation('common@nav-bar')
  const theme = useTheme()
  const router = useRouter()
  const [keyword, setKeyword] = useState(isCallFromNavbar? '' : router.query[SQ]? router.query[SQ] as string : '')
  const matches = useMediaQuery(`(max-width:${theme.breakpoints.values.lg}px)`)
  const inputRef = useRef<HTMLInputElement>()
  useEffect(() => {
    if (!(router.query[SQ] as string || '').trim() || isCallFromNavbar) {
      setKeyword('')
      return
    }
    setKeyword(router.query[SQ] as string)
  }, [router.query[SQ]])
  useEffect(() => {
    if (isCallFromNavbar && router.route == '/search') return
    matches && setKeyword((document.getElementById('ggj-search-desktop') as HTMLInputElement)?.value)
  }, [matches])

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault()
    inputRef.current?.blur()
    if(!keyword?.length) {
      router.push('/search').then(() => {
        isCallFromNavbar && closeModal && closeModal()
      })
      return
    }
    buildQueryString(router, {[SQ]: keyword}, allParams, '/search', {shallow: true})
    if(isCallFromNavbar) {
      closeModal && closeModal()
    }
  }

  return (
    <div css={css`
      background-color: #9F9F9F29;
      border-radius: 10px;
      width: 100%;
    `}>
      <form onSubmit={onSubmit} action="">
        <InputBase
          inputRef={inputRef}
          placeholder={t('Header-1')}
          css={css`
            padding: 2px ${theme.spacing(2)} 2px ${theme.spacing(3)}
          `}
          fullWidth
          id={'ggj-search-mobile' + (isCallFromNavbar? '-navbar' : '')}
          value={keyword || ''}
          onChange={(e) => {
            setKeyword(e.target.value)
          }}
          inputProps={{
            maxLength: 200
          }}
          endAdornment={
            <>
              {keyword && <>
                <InputAdornment position="start">
                  <IconButton size="small" aria-label="Back" onClick={() => setKeyword('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
                <Divider orientation="vertical" flexItem css={css`margin-right: ${theme.spacing(2)}`} />
              </>}
              <IconButton size="small" aria-label="Back" onClick={onSubmit}>
                <SearchIcon />
              </IconButton>
            </>
          }
        />
      </form>
    </div>
  )
}

const MobileInputSearch = ({backBtnClick, isCallFromNavbar}: {backBtnClick: () => void, isCallFromNavbar?: boolean}) => {
  return <Stack
    spacing={3} p={3}
    direction="row"
    css={css`
      align-items: center;
      background-color: white;
    `}>
    <IconButton aria-label="Back" onClick={backBtnClick} css={css`padding: 0`}>
      <ChevronLeftIcon color="primary" />
    </IconButton>
    <SearchInput isCallFromNavbar={isCallFromNavbar} closeModal={backBtnClick}/>
  </Stack>
}

export default React.memo(MobileInputSearch)
