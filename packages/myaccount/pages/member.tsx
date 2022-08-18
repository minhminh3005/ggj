import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Box from '@mui/material/Box'
import {getMemberInfo, processMemberDataAndPost} from 'store/memberSlice'
import Head from 'next/head'
import Script from 'next/script'
import { getTimezoneOffset } from 'date-fns-tz'
import { timeZone } from '../common/date'

// other library import
import { useState, ReactNode, useMemo, useCallback, useRef, useEffect } from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'next-i18next'
import { ggjServerSideTranslations } from 'common/i18nUtils'
import { useForm } from 'react-hook-form'
import type { NextRequest } from 'next/server'

// pages components
import NDABlock from 'components/pages/member/NDABlock'
import ConfirmSubmitModal from 'components/pages/member/ConfirmSubmitModal'
import ContractNoteModal from 'components/pages/member/ContractNoteModal'
import { BackButton } from 'components/common'
import { FormFieldsFactory, IdentityButton } from 'components/pages/member/FormComponents'
import type { IdentityButtonRefHandler } from 'components/pages/member/FormComponents'
import { scrollToElSmoothly } from 'common/utils'
import {
  MapSexType,
  MemberFormData,
  nsTran, TMemberInfo,
  TPrefectureData,
} from 'components/pages/member/member.typing'
import {useI18nContext} from 'contexts/I18nContext'
import { useAppSelector } from '../store/hooks'
import { ns } from '../store/appSlice'

let memberIdentityFile: FileList | null = null
function Member({ memberFormData, prefectures } : { memberFormData: TMemberInfo, prefectures: TPrefectureData[] }) {
  const { t } = useTranslation(nsTran)
  const isSkjDeveloper = useAppSelector(state => state[ns].auth?.isSkjDeveloper)
  const {locale} = useI18nContext()
  const isValidatingByNicknameRef = useRef<boolean>(false)
  const PageHead = useMemo(() => {
    return (
      <>
        <Head>
          <title>{t('meta-title')}</title>
          <meta data-n-head="ssr" name="description" content={t('meta-description')}/>
          <meta data-n-head="ssr" name="keywords" content={t('meta-kw')}/>
        </Head>

        {/*using for feature the "automatically input address" when input zip code*/}
        <Script src="https://ajaxzip3.github.io/ajaxzip3.js" />
      </>
    )
  }, [t])
  const theme = useTheme()
  const updateFileWithoutReRender = useCallback((fileList: typeof memberIdentityFile) => {
    memberIdentityFile = fileList
  }, [])

  const { handleSubmit, control, formState: { errors }, setValue, setError, clearErrors } = useForm<MemberFormData>({
    reValidateMode: 'onSubmit',
    shouldFocusError: true,
  })

  const iBtnRef = useRef<IdentityButtonRefHandler>(null)
  const resetFiles = useCallback(() => {
    memberIdentityFile = null
    iBtnRef.current?.resetData()
  }, [iBtnRef])

  const onSubmit = (async() => {
    const fn = await handleSubmit(
      (data) => {
        data.tel = data.tel.trim()
        processMemberDataAndPost({ data, memberIdentityFile, resetFiles, t })
      }
    )
    await fn()
  })

  useEffect(() => {
    const fields =  Object.keys(errors||{})
    if(fields.length && !isValidatingByNicknameRef.current) {
      scrollToElSmoothly({
        el: document.querySelector(`[name=${fields[0]}]`) as HTMLElement,
        focusEl: false,
      })
    }
    isValidatingByNicknameRef.current = false
  })

  // centralized all "Controller" components to the const FORM_INPUT_ELEMENTS
  // this solution will make easier to config rule, and change behavior of the form
  const FORM_INPUT_ELEMENTS = useMemo(
    () => FormFieldsFactory({
      control,
      t,
      defaultData: memberFormData as unknown as MemberFormData,
      prefectures,
      locale,
      setValue,
      setError,
      clearErrors,
      isValidatingByNicknameRef
    }),
    [control, t, memberFormData, prefectures, locale, setValue, setError, clearErrors, isValidatingByNicknameRef]
  )

  return <>
    {PageHead}
    <BackButton to="/"/>
    <TitleLV1>{t('root-2')}</TitleLV1>

    {/* title lv2: user info */}
    <TitleLV2><strong>{t('root-3')}</strong></TitleLV2>

    {/* 0. user id */}
    <div css={css`margin-bottom: ${theme.spacing(4)}`}>
      <Typography variant="caption"><strong>{t('root-4')}</strong></Typography>
      <Typography variant="body1">{memberFormData.id}</Typography>
    </div>
    {/* nickname */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-42')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['nickName']}
        {errors.nickName && <Typography color="error">{errors.nickName.message || t(`${errors.nickName.type}-message`)}</Typography>}
      </Grid>
    </Grid>
    {/* 1 + 2. user name */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-5')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['lastName']}
        {errors.lastName && <Typography color="error">{errors.lastName.message}</Typography>}
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['firstName']}
        {errors.firstName && <Typography color="error">{errors.firstName.message}</Typography>}
      </Grid>
    </Grid>
    {/* 3 + 4. user name (kana) */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-6')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['lastNameKana']}
        {errors.lastNameKana && <Typography color="error">{errors.lastNameKana.message}</Typography>}
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['firstNameKana']}
        {errors.firstNameKana && <Typography color="error">{errors.firstNameKana.message}</Typography>}
      </Grid>
    </Grid>
    {/*telephone*/}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-40')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['tel']}
        {errors.tel && <Typography color="error">{errors.tel.message}</Typography>}
        <Typography variant="caption">{t('root-41')}</Typography>
      </Grid>
    </Grid>
    {/* 5. zip */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-7')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['zip']}
        {errors.zip && <Typography color="error">{errors.zip.message}</Typography>}
        <Typography variant="caption">{t('root-8')}</Typography>
      </Grid>
    </Grid>
    {/* 6. prefecture id */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-9')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['prefectureId']}
        {errors.prefectureId && <Typography color="error">{errors.prefectureId.message}</Typography>}
      </Grid>
    </Grid>
    {/* 7. address 1 */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-10')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['address1']}
        {errors.address1 && <Typography color="error">{errors.address1.message}</Typography>}
      </Grid>
    </Grid>
    {/* 8. address 2 */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-11')}</strong><LabelRequired />
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['address2']}
        {errors.address2 && <Typography color="error">{errors.address2.message}</Typography>}
      </Grid>
    </Grid>
    {/* 9. address 3 */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-12')}</strong><LabelRequired required={false} text={t('root-1-2')}/>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['address3']}
        {errors.address3 && <Typography color="error">{errors.address3.message}</Typography>}
      </Grid>
    </Grid>
    {/* 10. birthday */}
    <Grid container rowSpacing={1} columnSpacing={{ xs: 2, lg: 3 }} mb={3}>
      <Grid item xs={12} mb={1}>
        <Typography variant="caption">
          <strong>{t('root-13')}</strong><LabelRequired required={false} text={t('root-1-2')}/>
        </Typography>
      </Grid>
      <Grid item xs={12} md={6} mb={1}>
        {FORM_INPUT_ELEMENTS['birthday']}
        {errors.birthday && <Typography color="error">{t('error_hook_form_birthday')}</Typography>}
        <Typography variant="caption">{t('root-14')}</Typography>
      </Grid>
    </Grid>
    {/* 11. sex */}
    <div css={css`margin-bottom: ${theme.spacing(3)}`}>
      <FormControl>
        <FormLabel id="demo-radio-buttons-group-label" css={css`margin-bottom: ${theme.spacing(1)}`}>
          <Typography variant="caption">
            <strong>{t('root-15')}</strong><LabelRequired required={false} text={t('root-1-2')}/>
          </Typography>
        </FormLabel>
        {FORM_INPUT_ELEMENTS['sexType']}
      </FormControl>
    </div>
    {/* 12. account type */}
    <div>
      <FormControl css={css`width: 100%;`}>
        <Typography variant="caption"  css={css`margin-bottom: ${theme.spacing(1)}`}>
          <strong>{t('root-16')}</strong><LabelRequired required={false} text={t('root-1-2')}/>
        </Typography>
        {FORM_INPUT_ELEMENTS['isCorporation']}
      </FormControl>
    </div>

    {isSkjDeveloper &&
      <Box id="identification" pt={3}>
        {/* title lv2: identification */}
        <TitleLV2><strong>{t('root-21')}</strong></TitleLV2>
        {/* 13. nda */}
        <NDABlock identity={memberFormData.identity ?? 0}>
          <IdentityButton updateFile={updateFileWithoutReRender} ref={iBtnRef}/>
        </NDABlock>
      </Box>
    }

    <Box id="nda" pt={6}>
      {/* title lv2: contract */}
      <TitleLV2><strong>{t('root-23')}</strong></TitleLV2>
      {/* 14. contract */}
      <div css={css`margin-bottom: ${theme.spacing(2)}`}>
        <div>
          <ContractNoteModal />
        </div>
        {FORM_INPUT_ELEMENTS['nda']}
        {errors.nda && <Typography color="error">{errors.nda.message}</Typography>}
      </div>
      {/* 15. to conclude */}
      <div css={css`margin-bottom: ${theme.spacing(5)}`}>
        {FORM_INPUT_ELEMENTS['isNda']}
      </div>
    </Box>

    {/* title lv2: user term */}
    <div css={css`display: flex;align-items: center;`}>
      <TitleLV2><strong>{t('root-25')}</strong></TitleLV2>
      <Typography variant='caption' ml={1} mb={3}>{t('root-26')}</Typography>
    </div>
    {/* 16. user term */}
    <div css={css`margin-bottom: ${theme.spacing(4)}`}>
      {FORM_INPUT_ELEMENTS['transaction']}
      {errors.transaction && <Typography color="error">{errors.transaction.message}</Typography>}
      {FORM_INPUT_ELEMENTS['isTransaction']}
    </div>
    {/* submit button */}
    <SubmitButton onSubmit={onSubmit} />
  </>
}
function SubmitButton(props: { onSubmit: () => void }) {
  const [openConfirmModal, setOpenConfirmModal] = useState<boolean>(false)
  const { t } = useTranslation(nsTran)
  const onSubmit = () => {
    setOpenConfirmModal(false)
    props.onSubmit()
  }
  return (
    <Grid container columnSpacing={{ xs: 1, sm: 2, md: 3 }} css={css`margin: 10px 0 64px 0`}>
      <Grid item xs={12} md={3} mb={1}>
        <Button
          variant="contained"
          fullWidth={true}
          size="large"
          onClick={() => setOpenConfirmModal(true)}
        >{t('root-27')}</Button>
      </Grid>
      <ConfirmSubmitModal
        open={openConfirmModal}
        handleClose={() => setOpenConfirmModal(false)}
        onSubmit={onSubmit}
      />
    </Grid>
  )
}
function TitleLV1(props: { children: ReactNode }) {
  return <Typography
    variant="h5"
    css={css`display: inline-block`}
    mb={4}
  >{props.children}</Typography>
}
function TitleLV2(props: { children: ReactNode }) {
  return <Typography variant="h6" mb={3}>{props.children}</Typography>
}
function LabelRequired({ required = true, text } : { required?: boolean, text?: string }) {
  const { t } = useTranslation(nsTran)
  const theme = useTheme()
  const background = useMemo(() => (!required ? '#626262' : theme.palette.error.main), [required, theme])
  return <span css={css`
    background: ${background};
    color: #fff;
    padding: 2px ${theme.spacing(1)};
    margin-left: ${theme.spacing(1)};
  `}>{text ?? t('root-1-1')}</span>
}
export async function getServerSideProps({ req }: { req: NextRequest }) {
  const { data } = await getMemberInfo(req)
  const rawData = data as TMemberInfo
  const sexType = rawData.sexType as keyof typeof MapSexType
  const isCorporation = rawData.isCorporation as unknown as MemberFormData['isCorporation']
  const memberFormData = {
    ...rawData,
    sexType: MapSexType[sexType] ?? MapSexType[0],
    isCorporation: `${Boolean(isCorporation)}`,
    birthday: rawData?.birthday ? rawData?.birthday + getTimezoneOffset(timeZone['ja']) : 0,
  } as unknown as MemberFormData
  const prefectures = rawData.prefectures ?? []
  return {
    props: {
      ...await ggjServerSideTranslations(req as NextRequest, nsTran),
      memberFormData,
      prefectures,
    },
  }
}
export default Member
