import { css } from '@emotion/react'
import { Add, ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, FormControl, FormControlLabel, FormHelperText, OutlinedInput, Radio, RadioGroup, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { GgjOutlineButton } from 'components/commons/GgjButton'
import GgjCountText from 'components/commons/GgjCountText'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import { Caption } from 'components/pages/mypage/display/skill/input/ServiceSection'
import { useTranslation } from 'next-i18next'
import {memo, SyntheticEvent} from 'react'
import { Controller, useFieldArray, useFormContext, useWatch } from 'react-hook-form'
import {IFAQValue, actions, ns} from 'store/mypage/display/skill/skillInputSlice'
import { TextButtonDelete } from './ButtonGroup'
import {useAppDispatch, useAppSelector} from 'store/hooks'
import {SectionTitle} from './SectionTitle'
import {MAX_FAQ_ITEM, SkillInputName, nsTran} from './const'
import {rgba} from 'emotion-rgba'
import GgjNumberInput from '../../../../../commons/GgjNumberInput'

const FAQS = SkillInputName.FAQS
const LIMIT = SkillInputName.LIMIT

export default memo(function SupportSection() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  return (
    <>
      <SectionTitle title={t('24')}/>
      <Box px={{xs: 3, md: 6}} py={4} mb={{xs: 5, md: 6}} css={css` background: ${theme.palette.grey[50]}; border-radius: 15px; `}>
        <QAContainer/>
        <Divider />
        <Estimate />
        <Divider />
        <MaxTransaction />
      </Box>
    </>
  )
})

function QAContainer () {
  const { t } = useTranslation(nsTran)
  const { control } = useFormContext()
  const {
    fields,
    append,
    remove
  } = useFieldArray({
    control,
    name: FAQS
  })

  const appendNewFAQItem = (faq : IFAQValue) => {
    append(faq, { shouldFocus: false })
  }
  const removeFAQItemAt = (index: number) => {
    remove(index)
  }

  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mb={3}>
        <Caption title={t('14')} />
        <AnyTagLabel />
      </Stack>
      {fields.map((data, index) =>
        <QABox key={data.id} index={index} remove={removeFAQItemAt}/>
      )}
      {fields.length < MAX_FAQ_ITEM &&
        <AddQAButton append={appendNewFAQItem} />
      }
    </>
  )
}

function QABox({index, remove } :{ index: number, remove: (index: number) => void}) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const dispatch = useAppDispatch()
  const {getValues} = useFormContext()
  const faqList = getValues(FAQS)

  const handleDeleteQAItem = (e: SyntheticEvent) => {
    e.stopPropagation()
    const deleteQAItemData = faqList[index]
    if(deleteQAItemData.id) {
      dispatch(actions.deleteFAQ({
        ...deleteQAItemData,
        isDelete: true
      }))
    }
    remove(index)
  }
  return (
    <Accordion defaultExpanded css={css`
      background: ${theme.palette.grey[50]};
      margin-bottom: ${theme.spacing(2)} !important;
      border: 0;
      box-shadow: none;
      &::before {
        display: none;
      }
    `}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="panel1a-content"
        id="panel1a-header"
        css={css`
          padding: 0;
          position: relative;
          justify-content: flex-start;
          border-bottom: 1.5px solid ${theme.palette.divider};
          .MuiAccordionSummary-content {
            flex-grow: 0;
          }
        `}
      >
        <Typography variant="body1">{ t('11', { index: index+1 }) }</Typography>
        <TextButtonDelete
          onClick={handleDeleteQAItem}
          title={t('12')}
          css={css`
            position: absolute;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
        `}/>
      </AccordionSummary>
      <AccordionDetails css={css` padding: 0;`}>
        <QAIcon type="Q"/>
        <QAInput name={'question'} index={index}/>
        <QAIcon type="A"/>
        <QAInput name={'answer'} index={index}/>
      </AccordionDetails>
    </Accordion>
  )
}

function QAInput({ name, index } : { name: string, index: number }) {
  const {t} = useTranslation(nsTran)
  const { control, formState: {errors}} = useFormContext()
  const inputName = `${FAQS}.${index}.${name}`
  const err = errors?.[FAQS]?.[index]?.[name]

  return (
    <Stack alignItems="flex-end" spacing={2}>
      <FormControl
        variant="outlined"
        fullWidth
        error={!!Object.keys(err || {}).length}
      >
        <Controller
          control={control}
          name={inputName}
          aria-describedby={'component-FAQ-text'}
          rules={{required: true}}
          render={({ field: { ref, ...rest } }) => {
            return (
              <OutlinedInput
                type="text"
                multiline
                rows={4}
                inputProps={{maxLength: 400}}
                fullWidth={true}
                css={css` padding: 0; height: 112px; background: #fff; font-size: 14px; border-radius: 7px;`}
                inputRef={ref}
                {...rest}
              />
            )
          }}
        />
        {!!Object.keys(err|| {}).length && <FormHelperText id="component-faq-input-text">{t('faq-input-required')}</FormHelperText>}
      </FormControl>
      <GgjCountText name={inputName} max={400} isError={false} />
    </Stack>
  )
}
function AddQAButton({append} : {append: (arg0: IFAQValue) => void}) {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { control, setFocus } = useFormContext()
  const FAQData = useWatch({
    control,
    name: FAQS
  })
  const availableQALeft = MAX_FAQ_ITEM - (FAQData?.length || 0)
  const onAddQA = async () => {
    await append({
      question: '',
      answer: '',
      statusType: 1
    })
    setFocus(`${FAQS}[${FAQData?.length || 0}].question`)
  }
  return (
    <Box textAlign={{xs: 'center', md: 'left'}}>
      <GgjOutlineButton
        onClick={onAddQA}
        // disabled={isDisableButton}
        startIcon={<Add/>}
        css={css`
          border-radius: 22px;
          margin: ${theme.spacing(2)} 0 ${theme.spacing(4)} 0;
          background: #fff;
        `}>
        { t('13', { left: availableQALeft}) }
      </GgjOutlineButton>
    </Box>
  )
}

function Estimate() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const { control } = useFormContext()

  const radioList = [
    {title: t('15'), value: 0},
    {title: t('16'), value: 1},
    {title: t('17'), value: 2},
  ]

  return (
    <Box
      css={css`
        margin: ${theme.spacing(3)} -${theme.spacing(3)} 0;
        position: relative;
        &::after{
          content: 'coming soon...';
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          color: ${theme.palette.grey[50]};
          background-color: ${rgba(theme.palette.text.primary, 0.32)};
          border-radius: 10px;
        }
      `}
      px={3} py={1}
    >
      <Caption title={t('18')} style={css` margin: ${theme.spacing(4)} 0 ${theme.spacing(2)} 0;`}/>
      <FormControl>
        <Controller
          control={control}
          name="estimateType"
          defaultValue="0"
          aria-describedby={'component-estimate-type-radio'}
          render={({ field: { ...rest } }) => {
            return (
              <RadioGroup
                aria-labelledby="radio-buttons-group-label"
                defaultValue="0"
                {...rest}
              >
                {radioList.map(item =>
                  <FormControlLabel
                    disabled={true}
                    key={item.value}
                    css={css` font-size: 14px; margin-bottom: ${theme.spacing(1)};`}
                    value={item.value}
                    control={<Radio />}
                    label={<Typography variant="body2">{item.title}</Typography>}
                  />
                )}
              </RadioGroup>
            )
          }}
        />
      </FormControl>
      <Stack direction="row" spacing={2} alignItems="center" mt={2} mb={2}>
        <Typography component="p" variant="caption" css={css` color: ${theme.palette.text.primary};`}>{ t('19') }</Typography>
        <AnyTagLabel />
      </Stack>

      <Box mb={4}>
        <GgjInputCountText
          name="estimateContent"
          disabled
          // rules={{required: true, maxLength: 200}}
          rules={{ maxLength: 200}}
          fullWidth
          isMultiline
          rows={4}
        />
      </Box>
    </Box>
  )
}

function MaxTransaction() {
  const theme = useTheme()
  const { t } = useTranslation(nsTran)
  const isPublishValidation = useAppSelector(state => state[ns].isPublishValidation)
  const { control, formState: {errors} } = useFormContext()
  return (
    <>
      <Stack direction="row" spacing={2} alignItems="center" mt={4} mb={2}>
        <Caption title={t('20')} />
        <Typography variant="caption" css={css `color: ${theme.palette.smoke.dark};`}>{ t('21') }</Typography>
      </Stack>

      <FormControl
        variant="outlined"
        css={css`
          margin-bottom: ${theme.spacing(2)};
          width: 140px;
          @media (min-width: ${theme.breakpoints.values.md}px) {
            width: 152px;
          }
        `}
        error={!!Object.keys(errors[LIMIT] || {}).length}
      >
        <Controller
          control={control}
          name={SkillInputName.LIMIT}
          aria-describedby={`component-${LIMIT}-number`}
          rules={{
            max: 99,
            required: isPublishValidation,
            min: isPublishValidation ? 1 : 0,
            validate: (value) => (!value && value !== 0) ? true : value >= 1
          }}
          render={({ field: { ref, value, onChange, ...rest } }) => {
            return (
              <GgjNumberInput
                onChange={onChange}
                ref={ref}
                value={value}
                {...rest}
              />
            )
          }}
        />
        {!!Object.keys(errors[LIMIT] || {}).length && <FormHelperText css={css` width: 200px;`}>
          { t('22') }
        </FormHelperText>}
      </FormControl>
      <Typography variant="caption" css={css `color: ${theme.palette.smoke.dark}; display: block;`}>{ t('23') }</Typography>
    </>
  )
}

export function AnyTagLabel() {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  return (
    <Typography variant="overline"
      css={css`
        background: ${theme.typography.subtitle1.color};
        color: #fff;
        padding: 2px ${theme.spacing(2)};
        font-size: 10px;
        line-height: 15px;
      `}>
      { t('10') }
    </Typography>
  )
}

function QAIcon({type}: {type: 'Q' | 'A'}) {
  const theme = useTheme()
  return (
    <Typography my={2} variant="caption" css={css`
      background: ${type === 'Q' ? theme.palette.primary.main : '#DC496C'};
      border-radius: 50%;
      height: ${theme.spacing(4)};
      width: ${theme.spacing(4)};
      color: #fff;
      line-height: ${theme.spacing(4)};
      display: block;
      text-align: center;
    `}>
      {type}
    </Typography>
  )
}
