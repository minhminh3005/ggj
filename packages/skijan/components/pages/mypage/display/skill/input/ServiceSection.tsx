import {css, SerializedStyles} from '@emotion/react'
import {Box, FormControl, FormHelperText, MenuItem, OutlinedInput, Select, Stack, Typography} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import {GgjEditor} from 'components/commons/GgjEditor'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import {GgjUploadImagesOrYoutube} from 'components/commons/GgjUploadImagesOrYoutube'
import {useTranslation} from 'next-i18next'
import {Controller, useFormContext, useWatch} from 'react-hook-form'
import {useAppSelector} from 'store/hooks'
import {ns as commonNs} from 'store/appSlice'
import {ns} from 'store/mypage/display/skill/skillInputSlice'
import {
  MAX_LENGTH_OUTLINE,
  nsTran,
  SkillInputName,
  SkillType,
  TOOLBAR
} from 'components/pages/mypage/display/skill/input/const'
import {memo} from 'react'
import {SectionTitle} from './SectionTitle'
import {AnyTagLabel} from './SupportSection'

const nsCommon = 'common@category'
const LARGE_CATEGORY_ID = SkillInputName.SERVICE_CATEGORY_LARGE_ID
const MIDDLE_CATEGORY_ID = SkillInputName.SERVICE_CATEGORY_MIDDLE_ID
const TITLE = SkillInputName.TITLE
const CATCHCOPY = SkillInputName.CATCHCOPY
const OUTLINE = SkillInputName.OUTLINE

type TCategories = {
  id: number
  name: string
  sub: object[]
}

export function Caption({title, style} : {title: string, style?: SerializedStyles})  {
  const theme = useTheme()
  return (
    <Typography
      component="p"
      variant="body2"
      fontWeight="medium"
      css={css` color: ${theme.palette.text.primary}; ${style}`}
    >
      {title}
    </Typography>
  )
}

function LargeCategorySelect () {
  const { control, setValue, formState: {errors} } = useFormContext()
  const { t } = useTranslation([nsTran, nsCommon])
  const categories = useAppSelector(state => state[commonNs].menuData)
  const isDisableAllInput = useAppSelector(state => state[ns].isDisableAllInput)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)

  const findSelectedName = (id: number) => {
    return categories.find((item : TCategories) => item.id == id)
  }

  return (
    <FormControl css={css` display: block;`} fullWidth error={!!Object.keys(errors[LARGE_CATEGORY_ID] || {}).length}>
      <Controller
        control={control}
        name={LARGE_CATEGORY_ID}
        aria-describedby={`component-${LARGE_CATEGORY_ID}-text`}
        rules={{ required: isPublishValidation }}
        render={({ field: { ref, value, onChange, ...rest } }) => {
          return (
            <Select
              css={css` height: 48px; border-radius: 7px; background-color: #fff;`}
              fullWidth
              displayEmpty
              disabled={isDisableAllInput}
              input={<OutlinedInput label="" />}
              inputProps={{ 'aria-label': 'component-select-large-category' }}
              value={value ? value : ''}
              onChange={(e) => {
                setValue(MIDDLE_CATEGORY_ID, null)
                onChange(e)
              }}
              {...rest}
              renderValue={(selected) => {
                const selectedCategory = findSelectedName(selected)
                if (!selected || !selectedCategory || selected.length === 0) {
                  return <Typography variant="subtitle1" css={css`opacity: .5`}>{ t(LARGE_CATEGORY_ID) }</Typography>
                }
                return selectedCategory.name
              }}
              inputRef={e => { ref(e) }}
            >
              <MenuItem disabled value="">
                <Typography variant="subtitle1">{ t(`${LARGE_CATEGORY_ID}Default`) }</Typography>
              </MenuItem>
              {categories.map((category : {id: number, name: string}) => (
                <MenuItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )
        }}
      />
      {!!Object.keys(errors[LARGE_CATEGORY_ID] || {}).length && <FormHelperText>
        { t('category-warning') }
      </FormHelperText>}
    </FormControl>
  )
}

function MiddleCategorySelect () {
  const { control, formState: {errors} } = useFormContext()
  const {t} = useTranslation([nsTran, nsCommon])
  const theme = useTheme()
  const isDisableAllInput = useAppSelector(state => state[ns].isDisableAllInput)
  const largeCategoryList = useAppSelector(state => state[commonNs].menuData)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)
  const largeCategoryId = useWatch({
    control,
    name: LARGE_CATEGORY_ID
  })

  const middleCategoryList = largeCategoryId
    ? largeCategoryList.find((item: TCategories) => item.id === largeCategoryId)?.sub
    : []

  const findSelectedName = (id: number) => middleCategoryList.find((item : TCategories) => item.id === id)

  return (
    <FormControl
      fullWidth
      css={css`
        display: block;
        & .Mui-error fieldset {
          border-color: ${theme.palette.error.main} !important;
        }
      `}
      error={!!Object.keys(errors[MIDDLE_CATEGORY_ID] || {}).length}
    >
      <Controller
        control={control}
        name={MIDDLE_CATEGORY_ID}
        aria-describedby={`component-${MIDDLE_CATEGORY_ID}-text`}
        rules={{ required: isPublishValidation || largeCategoryId }}
        render={({field: {ref, value, ...rest}}) => {
          return (
            <Select
              disabled={!largeCategoryId || isDisableAllInput}
              css={css`
                height: 48px;
                border-radius: 7px;
                background-color: #fff;
              `}
              fullWidth
              displayEmpty
              input={<OutlinedInput label=""/>}
              inputProps={{'aria-label': 'component-select-middle-category'}}
              value={findSelectedName(value) ? value : ''}
              {...rest}
              renderValue={(selected) => {
                const selectedCategory = findSelectedName(selected)
                if (!selected || !selectedCategory || selected.length === 0) {
                  return <Typography variant="subtitle1" css={css`opacity: .5`}>{t(MIDDLE_CATEGORY_ID)}</Typography>
                }
                return selectedCategory.name
              }}
              inputRef={e => { ref(e) }}
            >
              <MenuItem disabled value="">
                <Typography variant="subtitle1">{ t(`${MIDDLE_CATEGORY_ID}Default`) }</Typography>
              </MenuItem>
              {middleCategoryList.map((category : {id: number, name: string}) => (
                <MenuItem
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          )
        }}
      />
      {!!Object.keys(errors[MIDDLE_CATEGORY_ID] || {}).length && <FormHelperText>
        { t('category-warning') }
      </FormHelperText>}
    </FormControl>
  )
}
function SkillEditor () {
  const { t } = useTranslation(nsTran)
  const { control, formState: {errors} } = useFormContext()
  const skillOutline = useAppSelector(state => state[ns].product.outline)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)

  return (
    <FormControl variant="outlined" fullWidth error={!!Object.keys(errors[OUTLINE] || {}).length}>
      <Controller
        control={control}
        name={OUTLINE}
        rules={{
          required: isPublishValidation,
          minLength: isPublishValidation ? 250 : 0,
        }}
        aria-describedby={`component-${OUTLINE}-text`}
        defaultValue=""
        render={({ field: { onChange } }) => {
          return (
            <GgjEditor value={skillOutline} onChange={onChange} toolbar={TOOLBAR} maxLength={MAX_LENGTH_OUTLINE}/>
          )
        }}
      />
      {!!Object.keys(errors[OUTLINE] || {}).length && <FormHelperText>{ t('editor-warning') }</FormHelperText>}
    </FormControl>
  )
}

interface ServiceSectionProps {
  handleChangeListImages: (arg: any[]) => void
  handleRemoveListImages: (arg: any[]) => void
  value: string
}

function ServiceSection(props: ServiceSectionProps) {
  const {handleChangeListImages, handleRemoveListImages, value } = props
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)
  const statusType = useAppSelector(state => state[ns].product?.statusType)
  const theme = useTheme()
  const { t } = useTranslation(nsTran)

  return (
    <>
      <SectionTitle title={t('49')}/>
      <Box
        px={{xs: 3, md: 6}}
        py={4}
        mb={5}
        css={css` background: ${theme.palette.grey[50]}; border-radius: 15px;`}
      >
        {/* Select Categories */}
        <Box mb={4}>
          <Caption title={t('5')} style={css`margin-bottom: ${theme.spacing(1)};`}/>
          <Stack direction={{xs: 'column', md: 'row'}} spacing={{xs: 2, md: 4}}>
            <LargeCategorySelect />
            <MiddleCategorySelect />
          </Stack>
        </Box>
        {/* Title */}
        <Box mb={4}>
          <Caption title={t('6')} style={css`margin-bottom: ${theme.spacing(1)};`}/>
          <GgjInputCountText
            name={TITLE}
            rules={{
              required: true,
              maxLength: 25
            }}
            fullWidth
            defaultValue=""
            errorText={t('max-length-warning', { length: 25 })}
            cssInput={css`color: ${theme.palette.text.primary};`}
          />
        </Box>
        {/* Catch copy */}
        <Box mb={4}>
          <Caption title={t('7')} style={css`margin-bottom: ${theme.spacing(1)};`}/>
          <GgjInputCountText
            name={CATCHCOPY}
            rules={{
              required: isPublishValidation,
              maxLength: 30
            }}
            fullWidth
            defaultValue=""
            cssInput={css`color: ${theme.palette.text.primary};`}
            errorText={t('max-length-warning', { length: 30 })}
          />
        </Box>
        {/* upload images and yt link */}
        <Box mb={4}>
          <Stack
            direction="row"
            alignItems="center"
            flexWrap="wrap"
            mt={4}
            mb={{xs: 3 ,md: 4}}
          >
            <Caption title={t('50')} css={css` margin-right: ${theme.spacing(2)};`} />
            <Typography variant="caption" mr={2} css={css `color: ${theme.palette.smoke.dark};`}>{ t('51') }</Typography>
            <AnyTagLabel />
          </Stack>
          <Box css={css`
            & input[type=file] {display: none;}
            & .list button {display: ${statusType !== SkillType.CLOSE ? 'flex' : 'none'};}
            pointer-events: ${statusType !== SkillType.CLOSE ? 'flex' : 'none'};
          `}>
            <GgjUploadImagesOrYoutube
              onChange={handleChangeListImages}
              onRemove={handleRemoveListImages}
              value={value}
              maxFiles={20}
            />
          </Box>
        </Box>
        {/* Editor */}
        <Box mb={4}>
          <Stack direction="row" spacing={2} alignItems="center" mt={4} mb={2}>
            <Caption title={t('8')} />
            <Typography variant="caption" css={css `color: ${theme.palette.smoke.dark};`}>{ t('9') }</Typography>
          </Stack>
          <SkillEditor />
        </Box>
      </Box>
    </>
  )
}

export default memo(ServiceSection)
