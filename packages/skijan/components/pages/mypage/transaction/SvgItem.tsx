import React from 'react'
import Image from 'next/image'
import {css} from '@emotion/react'
import {IMG_TYPES} from './const'

export interface IFile {
  ext: string
  width: number
  height: number
  color: string
  imgSrc?: string
}

const icons = {
  pdf: require('components/pages/mypage/transaction/Images/pdf.svg'),
  zip: require('components/pages/mypage/transaction/Images/zip.svg'),
  mp3: require('components/pages/mypage/transaction/Images/mp3.svg'),
  mp4: require('components/pages/mypage/transaction/Images/mp4.svg'),
  jpg: require('components/pages/mypage/transaction/Images/img.svg'),
  png: require('components/pages/mypage/transaction/Images/img.svg'),
  other: require('components/pages/mypage/transaction/Images/file.svg'),
  down: require('components/pages/mypage/transaction/Images/download.svg'),
  cls: require('components/pages/mypage/transaction/Images/close.svg')
}

const checkType = (type: 'other') => {
  return icons[type] ? icons[type] : icons.other
}

const checkColor = (color: string) => {
  switch (color) {
  case '#496CDC' :
    return 'filter: invert(43%) sepia(65%) saturate(648%) hue-rotate(189deg) brightness(88%) contrast(97%)'
  case '#DB7048':
    return 'filter: invert(75%) sepia(35%) saturate(7206%) hue-rotate(330deg) brightness(92%) contrast(86%)'
  case '#626262':
    return 'filter: invert(40%) sepia(4%) saturate(2%) hue-rotate(0deg) brightness(93%) contrast(91%)'
  default:
    return 'filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(149deg) brightness(110%) contrast(100%)'
  }
}

const SvgItem = (item: IFile) => {
  if (IMG_TYPES.includes(item.ext) && item.imgSrc) {
    return <div css={css`width: 40px;
      height: 40px;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
      padding-bottom: calc(1 / 1 * 100%);
    `}>
      <img css={css`max-width: 100%;
        width: 100%;
        height: 100%;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        object-fit: cover;
        object-position: center`} src={item.imgSrc} alt=""/>
    </div>
  }
  return <Image loading="lazy" css={css`${checkColor(item.color)}`} width={item.width} height={item.height}
    src={checkType(item.ext as 'other')} alt=""/>
}

SvgItem.defaultProps = {
  ext: 'other', width: 20, height: 20, color: '#626262', imgSrc: ''
}

export default SvgItem
