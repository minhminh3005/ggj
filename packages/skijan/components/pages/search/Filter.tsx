import React, { useEffect, useMemo, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import { css } from '@emotion/react'
import CloseIcon from '@mui/icons-material/Close'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import StarIcon from '@mui/icons-material/Star'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import { buildQueryString } from 'common/utils'
import {
  Button,
  Collapse,
  Dialog,
  FormControlLabel,
  List,
  ListItemButton,
  Radio,
  RadioGroup,
  Slider,
  Stack,
  Typography,
  Checkbox,
  FormGroup,
  SvgIcon,
  SvgIconProps,
  useMediaQuery
} from '@mui/material'
import {CategoryOutlined} from '@mui/icons-material'
import {SPC, SPD, SPR, SPP, SP, SQ, SPS} from './consts'

import getCategories, {nsCommonCategories} from 'common/categories'
import {rateColor} from '../../../theme.config'

const nsTran = 'surface@search'

interface RangeSliderProps {
  onRangeChange?: (value: number|number[]) => void
  value: number[]
}
interface FilterModalProps {
  visible: boolean
  children?: React.ReactNode | React.ReactElement
}
interface FilterProps {
  closeFilterModal?: () => void
}
interface FilterValues {
  [SPC]: string
  [SPD]: string
  [SPR]: string
  [SPP]: number | number[]
}
interface RadioGroupCustomProps {
  prefixIcon?: SvgIconProps,
  onChange: (value: string, field: string) => void,
  options: Array<{label: string, value: string}>,
  value: string,
  field: string,
}

const values = [
  '500',
  '5,000',
  '10,000',
  '30,000',
  '50,000',
  '100,000',
  '100,000+',
]
const STEP = 100 / (values.length - 1)
const maskValues = [500, 5000, 10000, 30000, 50000, 100000, 100001]
const defaultSPPValue = [0, 100]
const defaultFilterValuesLocal = {
  [SPC]: null,
  [SPD]: null,
  [SPR]: null,
  [SPP]: defaultSPPValue,
}

function getMaskValue(value: number) {
  return maskValues[value / STEP]
}

function getRealValue(value: number) {
  return maskValues.indexOf(value) * STEP
}

function RangeSlider({onRangeChange, value}: RangeSliderProps) {
  const router = useRouter()
  useEffect(() => {
    if (router.query[SPP] == undefined) {
      onRangeChange && onRangeChange(defaultSPPValue)
    }
  },[router.query])

  function handleChange(event: Event, newValue: number|number[]) {
    onRangeChange && onRangeChange(newValue)
  }

  function getMaskValue(value: number) {
    return values[value / STEP]
  }

  return (
    <>
      <Typography variant="body1">{`￥${getMaskValue(
        value[0] || 0,
      )}～￥${getMaskValue(value[1] || 0)}`}</Typography>
      <Slider step={STEP} value={value} onChange={handleChange} min={0} />
    </>
  )
}
const RangeSliderMemo = React.memo(RangeSlider, (
  prevProps: RangeSliderProps,
  nextProps: RangeSliderProps,
) => {
  return prevProps.value === nextProps.value
})
function RadioGroupCustom({prefixIcon, onChange, options, value, field}: RadioGroupCustomProps) {
  const router = useRouter()
  const { t } = useTranslation(nsTran)
  const [currentValue, setCurrentValue] = useState(value? value : '')
  useEffect(() => {
    if (router.query[field] == undefined) {
      setCurrentValue('')
    }
  },[router.query])
  return <>
    <Typography mb={4} variant="h6" component="h3">
      {t(`tit-${field}`)}
    </Typography>
    <RadioGroup
      value={currentValue}
      onChange={e => {
        onChange(e.target.value, field)
        setCurrentValue(e.target.value)
      }}
    >
      {options.map((item, index) => (
        <FormControlLabel
          key={index}
          value={item.value}
          control={<Radio />}
          label={
            <div css={css`
              display: flex;
              align-items: center;
            `}>
              {prefixIcon}
              {item.label}
            </div>
          }
        />
      ))}
    </RadioGroup>
  </>
}
const RadioGroupCustomMemo = React.memo(
  RadioGroupCustom,
  (prevProps: RadioGroupCustomProps, nextProps: RadioGroupCustomProps) => {
    return prevProps.value === nextProps.value
  },
)

function Categories({selectCate}:{selectCate: (value: string) => void}) {
  const theme = useTheme()
  const router = useRouter()
  const {t} = useTranslation(nsCommonCategories)
  const [currentLargeCategory, setCurrentLargeCategory ] = useState(0)
  const [isLargeExpanded, setIsLargeExpanded] = useState(false)
  const [isMidExpanded, setIsMidExpanded] = useState(false)
  const [currentMidCategory, setCurrentMidCategory] = useState(0)
  const categories = useMemo(() => {
    const cate = getCategories(true)
    cate.unshift({id: 0, name: t('0'), icon: CategoryOutlined, sub: []})
    return cate
  }, [])

  const iconStyle = css`
    color: ${theme.palette.jade.light};
    font-size: 26px;
  `
  useEffect(() => {
    if(!router.query[SPC]) {
      setCurrentLargeCategory(0)
      return
    }

    const currentQuery = (`${router.query[SPC] as string ?? ''}`).split(',')

    for (let i = 0, l = categories.length; i < l; i++) {
      const e = categories[i]
      const val = e.sub.some((e1, j) => {
        if (currentQuery[0] != String(e1.id)) return
        setCurrentLargeCategory(i)
        if([e1.id].concat(e1.smallIds || []).join() == currentQuery.join()) {
          // query is Mid + all Small
          setCurrentMidCategory(j)
        } else {
          setCurrentMidCategory(currentQuery.length == 1 ? j : 0)
        }
      })
      if (val) break
    }
  }, [router.query])

  function handleLargeCateClick(index: number) {
    if(!index) {
      selectCate('')
      return
    }
    const mid: Array<number> = []
    categories[index].sub.map((item) => {
      item.id != 0? mid.push(item.id) : ''
    })
    selectCate(mid.join(','))
  }

  function handleMidCateClick(index: number) {
    if(!index) {
      handleLargeCateClick(currentLargeCategory)
      return
    }
    const mid = categories[currentLargeCategory].sub[index]
    selectCate([mid.id].concat(mid.smallIds || []).join(','))
  }

  return (
    <>
      <>
        <ListItemButton
          onClick={() => setIsLargeExpanded(!isLargeExpanded)}
          component={Typography}
          variant="body1"
          css={css`
            border-bottom: 1px solid ${theme.palette.smoke.light};
            display: flex;
            justify-content: space-between;
            padding-left: 20px;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              padding-left: ${theme.spacing(4)};
            }
          `}
        >
          {t(`${categories[currentLargeCategory].id}`)}
          {isLargeExpanded
            ? <ExpandLess css={iconStyle}/>
            : <ExpandMore css={iconStyle}/>}
        </ListItemButton>

        <Collapse in={isLargeExpanded} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            {categories.map(({id, icon}, index) => {
              const Icon = icon as typeof SvgIcon
              return (
                <ListItemButton key={`lar${index}`}
                  onClick={() => {
                    setIsLargeExpanded(!isLargeExpanded)
                    setCurrentLargeCategory(index)
                    handleLargeCateClick(index)
                    setCurrentMidCategory(0)
                    setIsMidExpanded(false)
                  }}
                  css={css`
                    padding: 0 0 0 ${theme.spacing(3)};
                    height: ${theme.spacing(6)};
                  `}>
                  <div css={css`width: ${theme.spacing(4)};
                    margin-right: ${theme.spacing(3)};`}>
                    {icon && <Icon color="inherit" />}
                  </div>
                  <Typography variant="subtitle1" component="p" css={css`
                    border-bottom: 1px solid ${theme.palette.smoke.light};
                    height: ${theme.spacing(6)};
                    display: flex;
                    align-items: center;
                    flex: 1;
                  `}>
                    {t(`${id}`)}
                  </Typography>
                </ListItemButton>
              )
            })}
          </List>
        </Collapse>
      </>

      {!!currentLargeCategory && (
        <>
          <ListItemButton
            onClick={() => setIsMidExpanded(!isMidExpanded)}
            component={Typography}
            variant="subtitle1"
            css={css`
              border-bottom: 1px solid ${theme.palette.smoke.light};
              display: flex;
              justify-content: space-between;
              padding-left: ${theme.spacing(3)};
              @media (min-width: ${theme.breakpoints.values.lg}px) {
                padding-left: ${theme.spacing(4)};
              }
            `}
          >
            {
              t(`mid_${categories[currentLargeCategory].sub[currentMidCategory || 0].id}`,
                {largeId: t(`${categories[currentLargeCategory].id}`)})
            }
            {isMidExpanded
              ? <ExpandLess css={iconStyle}/>
              : <ExpandMore css={iconStyle}/>}
          </ListItemButton>

          <Collapse in={isMidExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {categories[currentLargeCategory]?.sub?.map(({id, name}, index) => (
                <ListItemButton key={`mid${name+index}`}
                  component={Typography}
                  variant="subtitle1"
                  onClick={() => {
                    setCurrentMidCategory(index)
                    setIsMidExpanded(!isMidExpanded)
                    handleMidCateClick(index)
                  }}
                  css={css`
                    padding: 0 0 0 ${theme.spacing(4)};
                    background-color: ${index == currentMidCategory? '#f5f5f5':''};
                    border-bottom: 1px solid ${theme.palette.smoke.light};
                    min-height: ${theme.spacing(6)};
                    display: flex;
                    padding: ${theme.spacing(2)} 0 ${theme.spacing(2)} ${theme.spacing(4)};
                    align-items: center;
                    flex: 1;
                  `}
                >
                  {t(`mid_${id}`, {largeId: t(`${categories[currentLargeCategory].id}`)})}
                </ListItemButton>
              ))}
            </List>
          </Collapse>
        </>
      )}
    </>
  )
}

export function FilterModal({visible, children}: FilterModalProps) {
  return (
    <Dialog
      fullScreen={true}
      open={visible}
    >
      {children}
    </Dialog>
  )
}

export interface IPRating {
  rating5: boolean,
  rating4: boolean,
  rating3: boolean,
  rating2: boolean,
  rating1: boolean,
}

const RatingCheckbox = ({onChange}: {onChange: (value: string, field: string) => void}) => {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const [prOptions, setPrOptions] = useState<IPRating>({
    rating5: false,
    rating4: false,
    rating3: false,
    rating2: false,
    rating1: false,
  })

  useEffect(() => {
    if(router.query[SPR]) {
      const prVal = (router.query[SPR] as string).split(',')
      setPrOptions({
        rating5: prVal.includes('5'),
        rating4: prVal.includes('4'),
        rating3: prVal.includes('3'),
        rating2: prVal.includes('2'),
        rating1: prVal.includes('1'),
      })
    } else {
      setPrOptions({
        rating5: false,
        rating4: false,
        rating3: false,
        rating2: false,
        rating1: false,
      })
    }

  }, [router.query])

  const handleChange = (location: number) => {
    const newValue = {
      ...prOptions,
      [`rating${location}`] : !prOptions[`rating${location}` as keyof IPRating]
    }
    setPrOptions(newValue)

    // Update value
    const prList = [] as Array<number>

    Object.keys(newValue).map((k, index) => {
      if(newValue[k as keyof IPRating]) prList.push(Object.keys(newValue).length - index)
    })

    onChange(prList.join(','), SPR)
  }

  return <>
    <Typography mb={4} variant="h6" component="h3">
      {t(`tit-${SPR}`)}
    </Typography>
    <FormGroup>
      {Object.keys(prOptions).map((key, idx) => {
        const location = Object.keys(prOptions).length - idx
        return (
          <FormControlLabel
            key={key}
            control={
              <Checkbox
                checked={prOptions[key as keyof IPRating]}
                onChange={()=>{handleChange(location)}}
              />
            }
            label={<Stack direction='row'>
              <StarIcon css={css`
                color: ${theme.palette.secondary.main};
                margin-right: 6px;
                color: ${rateColor};
              `}/>
              <Typography css={css`margin-top: 2px;`}>
                {location == 5? `${location}.0` : t(t('22'), {star: location})}
              </Typography>
            </Stack>}
          />
        )
      })}
    </FormGroup>
  </>
}
function Filter({
  closeFilterModal,
}: FilterProps) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const router = useRouter()
  const ppVal = router.query[SPP] as string
  const matches = useMediaQuery(`(min-width:${theme.breakpoints.values.lg}px)`)
  const [filterValuesLocal, setFilterValuesLocal] = useState<any>({
    ...router.query,
    [SPP]: ppVal && /^\d+,\d+$/.test(ppVal) ? ppVal.split(',').map(e => getRealValue(+e)) : defaultSPPValue
  })

  function getFilterValuesLocal(value: any, key: string) {
    setFilterValuesLocal((prevState: FilterValues) => {
      return {
        ...prevState,
        [key]: value,
      }
    })
  }

  const pdOptions = useMemo(() => [
    {
      label: `1${t('16')}`,
      value: '1we',
    },
    {
      label: `1${t('17')}`,
      value: '1mo',
    },
    {
      label: `3${t('17')}`,
      value: '3mo',
    },
    {
      label: `${t('27')}`,
      value: 'ab3mo',
    },
  ], [])

  function resetFilter() {
    setFilterValuesLocal(() => defaultFilterValuesLocal)
    buildQueryString(
      router,
      {},
      [SPC, SPD, SPR, SPP, SP, SPS],
      router.pathname,
      {shallow: true},
    )
  }

  function handleFilter() {
    const addParams = Object.assign({}, filterValuesLocal)
    const ppVal = getMaskValue(addParams[SPP][0]) + ',' + getMaskValue(addParams[SPP][1])
    // case user select price value full slider
    const listRemove = []
    if (ppVal == [maskValues[0], maskValues[maskValues.length - 1]].join()) {
      listRemove.push(SPP)
    }
    if (!addParams[SPC]?.length) listRemove.push(SPC)
    if (!addParams[SPR]?.length) listRemove.push(SPR)
    const keyword = (document.getElementById(`ggj-search-${matches?'desktop':'mobile'}`) as HTMLInputElement)?.value
    if (!keyword) listRemove.push(SQ)
    buildQueryString(
      router, {...addParams, [SPP]: ppVal, [SQ]: keyword},
      [SP, ...listRemove],
      router.pathname,
      {shallow: true},
    )

    closeFilterModal && closeFilterModal()
  }

  return (
    <div
      css={css`
        width: 100%;
        height: 100%;
        position: relative;
      `}
    >
      {/* modal header */}
      <div
        css={css`
          display: flex;
          width: 100%;
          align-items: center;
          padding: 14px ${theme.spacing(3)};
          background-color: ${theme.palette.common.white};
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            padding: 0;
          }
        `}
      >
        <Typography
          css={css`
            flex: 1;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              border-bottom: 1px solid ${theme.palette.smoke.light};
              padding: 14px ${theme.spacing(3)};
            }
          `}
          variant="h6"
          component="h2"
        >
          {t('11')}
        </Typography>
        <CloseIcon
          css={css`
            margin-left: auto;
            @media (min-width: ${theme.breakpoints.values.lg}px) {
              display: none;
            }
          `}
          onClick={closeFilterModal}
        />
      </div>
      {/* modal body */}
      <div
        css={css`
          height: calc(100% - 136px);
          overflow: auto;
          padding: 0 ${theme.spacing(3)} ${theme.spacing(4)};
          @media (min-width: ${theme.breakpoints.values.lg}px) {
            height: unset;
          }
        `}
      >
        {/* Filter by category */}
        <div css={css`
            padding-top: ${theme.spacing(4)};
        `}>
          <Typography mb={4} pl={3} variant="h6" component="h3">
            {t('12')}
          </Typography>
          <Categories
            selectCate={(value: string) => getFilterValuesLocal(value, SPC)}
          />
        </div>
        {/* Filter by price */}
        <div css={css`
            padding: ${theme.spacing(4)} ${theme.spacing(3)};
        `}>
          <Typography mb={4} variant="h6" component="h3">
            {t('13')}
          </Typography>

          <RangeSliderMemo
            onRangeChange={(value: number|number[]) => getFilterValuesLocal(value, SPP)}
            value={filterValuesLocal[SPP]}
          />
        </div>
        {/* Filter by delivery days */}
        <div css={css`
            padding: ${theme.spacing(4)} ${theme.spacing(3)};
            border-bottom: 1px solid ${theme.palette.smoke.light};
            border-top: 1px solid ${theme.palette.smoke.light};
        `}>
          <RadioGroupCustomMemo
            onChange={getFilterValuesLocal}
            field={SPD}
            value={filterValuesLocal[SPD]}
            options={pdOptions}
          />
        </div>
        {/* Filter by rating star */}
        <div css={css`
          padding: ${theme.spacing(4)} ${theme.spacing(3)};
        `}>
          <RatingCheckbox onChange={getFilterValuesLocal} />
        </div>
      </div>

      {/* modal footer */}
      <Stack direction='row' css={css`
        border-top: 1px solid ${theme.palette.smoke.light};
        align-items: center;
        padding: ${theme.spacing(3)} ${theme.spacing(4)};
        justify-content: space-between;
        background-color: ${theme.palette.common.white};
        @media (min-width: ${theme.breakpoints.values.lg}px) {
          position: sticky;
          bottom: 0;
          padding: ${theme.spacing(3)} ${theme.spacing(2)};
        }
      `}
      >
        <Button onClick={resetFilter} variant="text">
          <Typography variant='subtitle1' color='primary' component="h2">
            {t('19')}
          </Typography>
        </Button>
        <Button
          css={css`
            height: 44px;
            border-radius: 10px;
            flex: 1;
            max-width: 230px;
            font-size: ${theme.spacing(3)};
          `}
          onClick={handleFilter}
          variant="contained"
        >
          {t('20')}
        </Button>
      </Stack>
    </div>
  )
}

export default React.memo(Filter)
