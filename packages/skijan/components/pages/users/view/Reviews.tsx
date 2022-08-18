import {SelectChangeEvent, Typography, useTheme, Stack, Select, MenuItem, Button, NoSsr} from '@mui/material'
import {css} from '@emotion/react'
import React, {useEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import GgjSort from 'components/commons/GgjSort'
import GgjReviewBox from 'components/commons/GgjReviewBox'
import {ISkillReviews, ns, getReviews} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {loadingOffHandler, loadingOnHandler} from '../../../../contexts/LoadingContext'
import {toastHandler} from '../../../../contexts/ToastContext'
import menu from '../../../layouts/common/menu-data.json'
import {nsCommonCategories} from 'common/categories'
import {nsUserProfile} from '../../../../common/constant'
import {KeyboardArrowDown} from '@mui/icons-material'

const useDidMountEffect = (fn: () => void, deps: any) => {
  const didMount = useRef(false)
  useEffect(() => {
    if (didMount.current) {
      return fn()
    }
    didMount.current = true
  }, deps)
}

const Reviews = () => {
  const {t} = useTranslation([nsUserProfile, nsCommonCategories])
  const theme = useTheme()
  const [page, setPage] = useState(1)
  const [star, setStar] = useState('0')
  const [lcId, setLcId] = useState('0')
  const userId = useAppSelector((state) => state[ns]?.user.id)
  const [data, setData] = useState<ISkillReviews>({
    data: [],
    pagingMeta: {
      page: 1,
      hasNextPage: false,
      hasPreviousPage: false,
      limit: 10,
      totalPage: 0,
      totalItem: 1
    }
  })

  const options = [{id: '0', name: t('0', {ns: nsCommonCategories})}, ...menu.map(item => ({
    id: item.id.toString(),
    name: t(`${item.id}`, {ns: nsCommonCategories})
  }))]

  const handleChange = (event: SelectChangeEvent) => {
    setLcId(event.target.value as string)
  }

  useEffect(() => {
    loadingOnHandler()
    const fetchData = async () => {
      try {
        const req = await getReviews(userId, lcId, 1, star)
        if (req.error) {
          toastHandler({type: 'error'})
          return
        }
        setData(req)
      } catch (e) {
        toastHandler({type: 'error'})
      } finally {
        loadingOffHandler()
      }
    }
    fetchData()
  }, [])

  useDidMountEffect(() => {
    loadingOnHandler()
    const fetchData = async () => {
      try {
        const req = await getReviews(userId, lcId, page, star)
        if (req.error) {
          toastHandler({type: 'error', message: req.message})
          return
        }
        setData((prevData) => (
          {
            ...prevData,
            data: [...prevData.data, ...data.data],
            pagingMeta: data.pagingMeta
          }
        ))
      } catch (e) {
        toastHandler({type: 'error'})
      } finally {
        loadingOffHandler()
      }
    }
    fetchData()
  }, [page])

  useDidMountEffect(() => {
    loadingOnHandler()
    const fetchData = async () => {
      try {
        const req = await getReviews(userId, lcId, 1, star)
        if (req.error) {
          toastHandler({type: 'error', message: req.message})
          return
        }
        setData(req)
        setPage(1)
      } catch (e) {
        toastHandler({type: 'error'})
      } finally {
        loadingOffHandler()
      }
    }
    fetchData()
  }, [star, lcId])

  return (
    <>
      <div
        css={css`
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          width: 100%;
          margin-bottom: 18px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            margin-bottom: 48px;
          }
        `}
      >
        <div
          css={css`
            display: flex;
            width: 100%;
            align-items: center;
            justify-content: space-between;
            gap: 35px;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              width: auto;
              gap: 40px;
            }
          `}
        >
          <div
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <Typography
              css={css`
                font-size: 18px;
                font-weight: bold;
              `}
            >
              評価
            </Typography>
            <Typography
              variant="caption"
              css={css`
                margin-left: 12px;
                font-weight: bold;
              `}
            >
              {t('total-items', {total: data.pagingMeta.totalItem})}
            </Typography>
          </div>
          <Select
            css={css`
              font-size: 12px;
              width: 170px;
            `}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={lcId}
            displayEmpty
            onChange={handleChange}
          >
            {options.map((item) => (
              <MenuItem
                key={item.id}
                css={css`
                  font-size: 12px;
                  height: 48px;

                  &.Mui-selected {
                    color: ${theme.palette.primary.main};
                  }

                  &:hover {
                    color: ${theme.palette.primary.main};
                    background-color: rgba(73, 108, 220, 0.08);
                  }
                `}
                value={item.id}
              >
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </div>
        <div
          css={css`
            margin-top: 18px;
            margin-left: 0;
            @media (min-width: ${theme.breakpoints.values.md}px) {
              margin-top: 0;
              margin-left: 16px;
            }
          `}
        >
          <GgjSort selected={star} handler={setStar}/>
        </div>
      </div>
      <div css={css`
        border-bottom: 1px solid #e6e6e6;
        margin: 18px 0;
        @media (min-width: ${theme.breakpoints.values.md}px) {
          display: none;
        }
      `}
      />
      {
        data.data.length == 0 ? (
          <NoSsr>
            <div
              css={css`
              text-align: center;
              padding-top: 12px;
            `}
            >
              <Typography
                variant="subtitle1"
                css={css`
                color: #b4b4b4;
              `}
              >
                {t('72')}
              </Typography>
            </div>
          </NoSsr>
        ) : (
          <Stack spacing={4} css={css`padding-bottom: ${theme.spacing(3)}`}>
            {data.data.length !== 0 && data.data.map((review, index) => (
              <GgjReviewBox data={review} key={index}/>
            ))}
            {
              page < data.pagingMeta.totalPage && (
                <div
                  css={css`
                    display: flex;
                    justify-content: center;
                  `}
                >
                  <Button
                    startIcon={
                      <KeyboardArrowDown
                        css={css`
                          color: ${theme.palette.primary.light};
                        `}
                      />
                    }
                    onClick={() => setPage((prev) => prev + 1)}
                  >
                    <Typography
                      css={css`
                        color: ${theme.palette.smoke.dark};
                      `}
                      variant="caption"
                    >
                      {t('see')}
                    </Typography>
                  </Button>
                </div>
              )
            }
          </Stack>
        )
      }
    </>
  )
}

export default Reviews
