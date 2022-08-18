import {css} from '@emotion/react'
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup, MenuItem,
  NoSsr, Select,
  Stack,
  Typography,
  useTheme,
} from '@mui/material'
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react'
import {useTranslation} from 'next-i18next'
import GgjProductBoxWrapper from 'components/commons/GgjProductBoxWrapper'
import {getSkillList, ISkillList, ns} from 'store/usersSlice'
import {useAppSelector} from 'store/hooks'
import {loadingOnHandler, loadingOffHandler} from 'contexts/LoadingContext'
import {nsCommonCategories} from '../../../../common/categories'
import menu from '../../../layouts/common/menu-data.json'
import {nsUserProfile} from '../../../../common/constant'
import {KeyboardArrowDown} from '@mui/icons-material'

const useDidMountEffect = (fn: () => void, deps: any) => {
  const didMount = useRef(false)
  useLayoutEffect(() => {
    if (didMount.current) {
      return fn()
    }
    didMount.current = true
  }, deps)
}

const Products = () => {
  const theme = useTheme()
  const {t} = useTranslation([nsUserProfile, nsCommonCategories])
  const userId = useAppSelector((state) => state[ns]?.user.id)
  const [selected, setSelected] = useState('0')
  const [data, setData] = useState<ISkillList>({
    data: [],
    pagingMeta: {
      hasNextPage: false,
      hasPreviousPage: false,
      limit: 20,
      page: 1,
      totalItem: 0,
      totalPage: 1,
    },
  })
  const [page, setPage] = useState(1)
  const [checked, setChecked] = useState(false)

  const options = [{id: '0', name: t('0', {ns: nsCommonCategories})}, ...menu.map(item => ({
    id: item.id.toString(),
    name: t(`${item.id}`, {ns: nsCommonCategories})
  }))]


  useEffect(() => {
    const fetchData = async () => {
      const data = await getSkillList(userId , {page: page, lci: selected})
      setData(data)
    }
    fetchData()
  }, [])

  useDidMountEffect(() => {
    loadingOnHandler()
    const fetchData = async () => {
      const data = await getSkillList(userId, {page: page, lci: selected})
      setData((prevData) => ({
        ...prevData,
        data: [...prevData.data, ...data.data],
        pagingMeta: data.pagingMeta,
      }))
      loadingOffHandler()
    }
    fetchData()
  }, [page])

  useDidMountEffect(() => {
    loadingOnHandler()
    const fetchData = async () => {
      const data = await getSkillList(userId, {page: 1, lci: selected, isSelling: checked ? '1' : '0'})
      setData(data)
      setPage(1)
      loadingOffHandler()
    }
    fetchData()
  }, [checked, selected])

  return (
    <>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        css={css`
          margin-bottom: 24px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            margin-bottom: 60px;
          }
        `}
      >
        <Stack
          direction="row"
          alignItems="center"
          css={css`
            flex-wrap: wrap;
          `}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing="12px"
          >
            <Typography
              css={css`
                font-size: 18px;
                font-weight: bold;
              `}
            >
              出品サービス
            </Typography>
            <Typography
              variant="caption"
              css={css`
                font-weight: bold;
              `}
            >
              {t('total-items', {total: data.pagingMeta.totalItem})}
            </Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            spacing={4}
            css={css`
              width: 100%;
              margin-top: 12px;
              @media (min-width: ${theme.breakpoints.values.md}px) {
                margin-top: 0;
                width: auto;
              }
            `}
          >
            <div
              css={css`
                margin-left: 0;
                @media (min-width: ${theme.breakpoints.values.md}px) {
                  margin-left: 25px;
                }
              `}
            >
              <Select
                css={css`
                  font-size: 12px;
                  width: 170px;
                `}
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={selected}
                displayEmpty
                onChange={(e)=>setSelected(e.target.value as string)}
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
            <FormGroup>
              <FormControlLabel
                css={css`
                  .MuiFormControlLabel-label {
                    font-size: 12px;
                  }
                `}
                control={
                  <Checkbox
                    checked={checked}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setChecked(event.target.checked)
                    }}
                  />
                }
                label={`${t('only-purchase')}`}
              />
            </FormGroup>
          </Stack>
        </Stack>
      </Stack>
      {data.data.length == 0 ? (
        <NoSsr>
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
              {t('no-listing-data')}
            </Typography>
          </div>
        </NoSsr>
      ) : (
        <>
          <GgjProductBoxWrapper
            list={data.data
              .filter((item) => item.statusType !== 3)
              .map((item) => {
                return {
                  skillId: item.skillId,
                  statusType: item.statusType,
                  userId: item.userId,
                  title: item.title,
                  price: item.price,
                  isSpecialDiscount: item.isSpecialDiscount,
                  specialDiscountPrice: item.specialDiscountPrice,
                  reviewStar: item.reviewStar,
                  isFavorite: item.favorite,
                }
              })}
          />
          {page < data.pagingMeta.totalPage && (
            <div
              css={css`
                display: flex;
                justify-content: center;
                padding-bottom: ${theme.spacing(3)};
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
          )}
        </>
      )}
    </>
  )
}

export default Products
