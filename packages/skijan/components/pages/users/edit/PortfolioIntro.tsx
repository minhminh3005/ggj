import React, {useEffect} from 'react'
import { css } from '@emotion/react'
import { useTheme } from '@mui/material/styles'
import { Stack } from '@mui/material'
import {
  FormProvider,
  useForm,
} from 'react-hook-form'
import ButtonForm from './ButtonForm'
import GgjInputCountText from 'components/commons/GgjInputCountText'
import {
  IPortfolio,
  ns,
} from '../../../../store/usersSlice'
import {useAppSelector} from '../../../../store/hooks'
import {useTranslation} from 'next-i18next'
import {nsUserProfile} from '../../../../common/constant'

export interface IFormValues {
  title: string
  content: string
}

// MAIN
function PortfolioIntro({onSubmit}:{onSubmit: (data: IFormValues) => void}) {
  const theme = useTheme()
  const methods = useForm<IFormValues>({ reValidateMode: 'onSubmit' })
  const dataItem: IPortfolio = useAppSelector((state) => state[ns]?.portfolioSelected)
  const {t} =useTranslation(nsUserProfile)
  useEffect(()=>{
    methods.setValue('title', dataItem.title)
    methods.setValue('content', dataItem.content)
  },[dataItem])

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} action="">
        <Stack spacing={2}>
          <GgjInputCountText
            name="title"
            errorText={t('60')}
            rules={{ maxLength: 50, required: true, validate: (data) => {
              return Boolean(data.trim().length)
            }}}
            placeholder={t('30')}
            cssInput={css`height: 48px`}
          />
          <GgjInputCountText
            name="content"
            rows={6}
            errorText={t('61')}
            rules={{ maxLength: 200}}
            isMultiline={true}
            placeholder={t('explain-placeholder')}
            cssInput={css`
              padding: 0;
              background: #fff;
              font-size: 14px;
              border-radius: 7px;
              border: #cccccc;
              color: ${theme.palette.jade.light};
            `}
          />
        </Stack>
        <ButtonForm />
      </form>
    </FormProvider>
  )
}

export default React.memo(PortfolioIntro)
