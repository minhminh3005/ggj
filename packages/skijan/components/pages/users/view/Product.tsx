import { css } from '@emotion/react'
import { Favorite, FavoriteBorder } from '@mui/icons-material'
import { IconButton, Rating, Typography, useTheme, Avatar } from '@mui/material'
import testImage from 'components/commons/users/test.png'
import { useState } from 'react'

const Product = ({ title, price }: { title: string; price: string }) => {
  // TODO: Minh - GgjProductBox
  const theme = useTheme()
  const [favorite, setFavorite] = useState(false)
  const [value] = useState<number | null>(4.5)
  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        box-shadow: 0px 3px 6px #00000029;
        border-radius: 10px;
        padding: ${theme.spacing(3)};
      `}
    >
      <div
        css={css`
          background: transparent;
          position: relative;
        `}
      >
        <img
          alt="test"
          src={testImage.src}
          css={css`
            width: 100%;
            height: 100%;
            object-fit: contain;
            border-radius: 10px;
          `}
        />
        <div
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            position: absolute;
            top: -8px;
            left: -10px;
            border-radius: ${theme.spacing(3)};
            height: ${theme.spacing(5)};
            width: 50px;
            background: ${theme.palette.ruby.main};
          `}
        >
          <Typography variant="body2">Sale</Typography>
        </div>

        <IconButton
          aria-label="delete"
          css={css`
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            top: 5px;
            right: 5px;
            width: ${theme.spacing(5)};
            height: ${theme.spacing(5)};
            background: #ffffff;
            border-radius: 50%;
            opacity: 0.8;
          `}
          onClick={() => setFavorite(!favorite)}
        >
          {favorite ? (
            <Favorite
              css={css`
                color: ${theme.palette.ruby.main};
              `}
            />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>
      </div>
      <div
        css={css`
          padding: 8px 8px 10px;
        `}
      >
        <div css={css``}>
          <Typography
            title={title}
            component="span"
            variant="subtitle1"
            css={css`
              font-weight: bold;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              text-overflow: ellipsis;
              min-height: 56px;
            `}
          >
            {title}
          </Typography>
        </div>

        <div
          css={css`
            min-height: 56px;
          `}
        >
          <div
            css={css`
              display: flex;
              gap: 4px;
              align-items: center;
              flex-wrap: wrap;
            `}
          >
            <Typography
              variant="body1"
              css={css`
                min-height: 24px;
                color: ${theme.palette.ruby.main};
              `}
            >
              {price}
            </Typography>
            <Typography
              variant="body2"
              css={css`
                color: ${theme.palette.jade.light};
                text-decoration: line-through;
              `}
            >
              ￥100,000
            </Typography>
          </div>
        </div>
        <div
          css={css`
            margin-top: auto;
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
              value={value}
            />
            <Typography variant="caption" component="span">
              4.5
            </Typography>
          </div>
          <div>
            <Avatar>H</Avatar>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Product
