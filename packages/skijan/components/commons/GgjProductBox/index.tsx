import {css} from '@emotion/react'
import {memo} from 'react'
import {Avatar, Card, CardContent, CardMedia, Rating, Typography, useMediaQuery, useTheme,} from '@mui/material'
import {formatNumber} from 'common/number'
import Link from 'next/link'
import {GgjFavoriteButton, nsGgjFavoriteButton, preOnFavoriteType} from '../GgjFavoriteButton'
import {Theme} from '@mui/system'
export const breakPointMobile =(theme:Theme)=>{
  return `(min-width:340px) and (max-width:${theme.breakpoints.values.lg - 1}px)`
}
export const nsGgjProductBox = [nsGgjFavoriteButton]

export interface IGgjSKillItem {
  skillId: number
  userId: number
  title: string
  price: number
  isSpecialDiscount: number
  specialDiscountPrice: number
  reviewStar: number
  isFavorite: number
  imageUrl?: string
}

export interface IGgjProductProps {
  data: IGgjSKillItem
  preOnFavorite: preOnFavoriteType
}

const DesktopBox = ({data, preOnFavorite}: IGgjProductProps) => {
  const theme = useTheme()
  return (
    <Card
      css={css`
        width: 100%;
        border-radius: 10px;
      `}
    >
      <CardContent
        css={css`
          position: relative;

          :last-child {
            padding-bottom: 16px;
          }
        `}
      >
        <Link href={`/skill/${data.skillId}`} passHref>
          <div css={css`
            height: 100%;
            cursor: pointer;
            padding-bottom: 100%;
            position: relative;
          `}>
            <CardMedia
              component="img"
              image={`${data.imageUrl ? data.imageUrl : `/img/v3/skijan/skill/${data.skillId}?noDefaultImg=0`}`}
              css={css`
                height: 100%;
                position: absolute;
                inset: 0;
                object-position: center center;
                border-radius: 10px;
              `}
            />
          </div>
        </Link>
        {Boolean(data.isSpecialDiscount) && Boolean(data.specialDiscountPrice) && (
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              position: absolute;
              top: 8px;
              left: 8px;
              border-radius: 16px;
              height: 32px;
              width: 50px;
              background: ${theme.palette.ruby.main};
            `}
          >
            <Typography variant="body2">Sale</Typography>
          </div>
        )}
        <div css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 20px;
          right: 20px;
          width: 32px;
          height: 32px;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.8;
        `}
        >
          <GgjFavoriteButton
            id={data.skillId}
            preOnFavorite={preOnFavorite}
            isFavorite={data.isFavorite === 1}
          />
        </div>
        <Link href={`/skill/${data.skillId}`} passHref>
          <a css={css`text-decoration: none`}>
            <Typography
              title={data.title}
              component="span"
              variant="subtitle1"
              css={css`
                cursor: pointer;
                //font-weight: bold;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 50px;
                margin-top: 16px;
              `}
            >
              {data.title}
            </Typography>
          </a>
        </Link>
        <div>
          <div
            css={css`
              display: flex;
              gap: 4px;
              align-items: center;
              flex-wrap: wrap;
            `}
          >
            {!!data.isSpecialDiscount && (
              <Typography
                variant="body1"
                css={css`
                  min-height: 24px;
                  color: ${theme.palette.ruby.main};
                `}
              >
                ￥{formatNumber(data.specialDiscountPrice)}
              </Typography>
            )}
            <Typography
              variant="body2"
              css={css`
                min-height: 24px;
                color: ${theme.palette.jade.light};
                text-decoration: ${data.isSpecialDiscount == 1
      ? 'line-through'
      : 'none'};
              `}
            >
              ￥{formatNumber(data.price ? data.price : 0)}
            </Typography>
          </div>
        </div>
        <div
          css={css`
            margin-top: 8px;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              gap: 6px;
              align-items: flex-start;
            `}
          >
            <Rating
              readOnly
              precision={0.5}
              name="simple-controlled"
              size="small"
              value={data.reviewStar}
            />
            <Typography variant="caption" component="span">
              {!!data.reviewStar && formatNumber(data.reviewStar)}
            </Typography>
          </div>
          <Link href={`/users/${data.userId}`} passHref>
            <a css={css`text-decoration: none;`}>
              <Avatar
                src={`/img/v3/skijan/users/avatar/${data.userId}?noDefaultImg=0`}
                css={css`
                  width: 40px;
                  height: 40px;
                `}
              />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

const MobileBox = ({data, preOnFavorite}: IGgjProductProps) => {
  const theme = useTheme()
  return (
    <Card
      css={css`
        width: 100%;
        border-radius: 10px;
        box-shadow: 0 2px 1px -1px rgb(221 221 221 / 20%), 0px 1px 1px 0px rgb(221 221 221 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
        //box-shadow: 0px 2px 1px -1px rgb(204 204 204 / 20%), 0px 1px 1px 0px rgb(204 204 204 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%);
      `}
    >
      <CardContent
        css={css`
          position: relative;
          padding: 6px;

          :last-child {
            padding-bottom: 8px;
          }
        `}
      >
        <Link href={`/skill/${data.skillId}`} passHref>
          <div css={css`
            height: 100%;
            cursor: pointer;
            padding-bottom: 100%;
            position: relative;
          `}>
            <CardMedia
              component="img"
              image={`${data.imageUrl ? data.imageUrl : `/img/v3/skijan/skill/${data.skillId}?noDefaultImg=0`}`}
              css={css`
                height: 100%;
                inset: 0;
                object-fit: cover;
                position: absolute;
                border-radius: 10px;
                object-position: center center;
              `}
            />
          </div>
        </Link>
        {!!data.specialDiscountPrice && (
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
              color: #fff;
              position: absolute;
              top: 8px;
              left: 8px;
              border-radius: 16px;
              height: 32px;
              width: 50px;
              background: ${theme.palette.ruby.main};
            `}
          >
            <Typography variant="body2">Sale</Typography>
          </div>
        )}
        <div css={css`
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 8px;
          right: 8px;
          width: 25px;
          height: 25px;
          background: #ffffff;
          border-radius: 50%;
          opacity: 0.8;
        `}
        >
          <GgjFavoriteButton
            id={data.skillId}
            preOnFavorite={preOnFavorite}
            isFavorite={data.isFavorite === 1}
          />
        </div>
        <Link href={`/skill/${data.skillId}`} passHref>
          <a css={css`text-decoration: none`}>
            <Typography
              title={data.title}
              component="span"
              variant="subtitle1"
              css={css`
                cursor: pointer;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                text-overflow: ellipsis;
                min-height: 40px;
                margin: 8px 0 4px 0;
                font-size: 14px;
                font-weight: normal;
              `}
            >
              {data.title}
            </Typography>
          </a>
        </Link>
        <div>
          <div
            css={css`
              display: flex;
              gap: 4px;
              align-items: center;
              flex-wrap: wrap;
            `}
          >
            {!!data.isSpecialDiscount && (
              <Typography
                variant="body1"
                css={css`
                  min-height: 24px;
                  font-size: 16px;
                  color: ${theme.palette.ruby.main};
                  font-weight: 500;
                `}
              >
                ￥{formatNumber(data.specialDiscountPrice)}
              </Typography>
            )}
            <Typography
              variant="body2"
              css={css`
                min-height: 24px;
                font-size: 16px;
                font-weight: 500;
                color: ${theme.palette.jade.light};
                text-decoration: ${data.isSpecialDiscount == 1
      ? 'line-through'
      : 'none'};
              `}
            >
              ￥{formatNumber(data.price ? data.price : 0)}
            </Typography>
          </div>
        </div>
        <div
          css={css`
            margin-top: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
          `}
        >
          <div
            css={css`
              display: flex;
              gap: 0;
              align-items: flex-start;
            `}
          >
            <Rating
              readOnly
              precision={0.5}
              name="simple-controlled"
              size="small"
              value={data.reviewStar}
              max={1}
              css={css`
                margin-top: 0;
              `}
            />
            <Typography variant="caption" component="span" css={css`margin-left: 0; font-size: 12px`}>
              {!!data.reviewStar && `(${formatNumber(data.reviewStar)})`}
            </Typography>
          </div>
          <Link href={`/users/${data.userId}`} passHref>
            <a css={css`text-decoration: none;`}>
              <Avatar
                src={`/img/v3/skijan/users/avatar/${data.userId}?noDefaultImg=0`}
                css={css`
                  width: 25px;
                  height: 25px;
                `}
              />
            </a>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
const GgjProductBox = ({data, preOnFavorite}: IGgjProductProps) => {
  const theme = useTheme()
  // @ts-ignore
  const breakPoint = useMediaQuery(breakPointMobile(theme))
  if (breakPoint)
    return <MobileBox data={data} preOnFavorite={preOnFavorite}/>
  return <DesktopBox data={data} preOnFavorite={preOnFavorite}/>
}
export default memo(GgjProductBox)
