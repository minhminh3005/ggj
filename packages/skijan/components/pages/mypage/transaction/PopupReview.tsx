import {Modal, Stack, TextareaAutosize, Typography, useTheme} from '@mui/material'
import {css} from '@emotion/react'
import { useForm, FormProvider, useFormContext, Controller, SubmitHandler, UseFormRegisterReturn } from 'react-hook-form'
import {GgjContainButton, GgjOutlineButton} from '../../../commons/GgjButton'
import {useEffect, useState, memo} from 'react'
import Rating from '@mui/material/Rating'
import StarIcon from '@mui/icons-material/Star'
import { useTranslation } from 'next-i18next'
import { loadingOnHandler, loadingOffHandler } from 'contexts/LoadingContext'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import {actions, ListReviewProps, ns, submitReviewTransactionById, UsersReviewProps} from 'store/transactionSlice'
import { toastHandler } from 'contexts/ToastContext'
import {nsTransaction, TransactionType} from './const'
import GgjCountText from '../../../commons/GgjCountText'

interface SubmitReviewProps {
  comment: string
}
interface RatesProps<T> {
  reviewRequirementId: T
  rate: T
}
export interface ReviewObject {
  rates: RatesProps<number>[]
  comment: string
}
// Child Component
const ModalHeader = memo(() => {
  const theme = useTheme()
  const {t} = useTranslation(nsTransaction)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)
  const userId = useAppSelector((state) => state[ns].CHATINFO_info[mode == TransactionType.Buyer? 'sellerId' : 'buyerId'])
  const displayName = useAppSelector((state) => state[ns][`DETAIL_${mode == TransactionType.Buyer? 'seller' : 'buyer'}NickName`])
  return (
    <Stack css={css` align-items: center; `}>
      <img
        alt='SkjianAvatarUsers'
        src={`/img/v3/skijan/users/avatar/${userId}?noDefaultImg=0`}
        css={css`
          width: ${theme.spacing(8)};
          height: ${theme.spacing(8)};
          border-radius: 50%;
          border: ${theme.spacing(2)} solid ${theme.palette.common.white};
          background-color: ${theme.palette.common.white};
          flex: none;
          object-fit: cover;
          z-index: 1;
        `}/>
      <Stack
        direction='column'
        css={css`
            background-color: ${theme.palette.common.white};
            border-radius: 40px 40px 0 0;
            width: 100%;
            text-align: center;
            margin-top: -${theme.spacing(6)};
            padding-top: 55px;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              border-radius: 10px 10px 0 0;
            }
          `}>
        <Typography variant='caption'>{mode == TransactionType.Buyer? t('30') : t('29')}</Typography>
        <Typography variant='subtitle2' css={css`
          word-break: break-all;
          max-width: 80%;
          margin: auto;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        `}>{displayName}</Typography>
      </Stack>
    </Stack>
  )
})
ModalHeader.displayName = 'ModalHeader'

const ReviewRating = memo(({name, rate, onChange}:{
  name: string,
  rate: number | undefined,
  onChange: (n: number) => void
}) => {
  const theme = useTheme()
  return (
    <Stack css={css`align-items: center`} spacing={2} mt={3}>
      <Typography variant='subtitle2'>{name}</Typography>
      <div css={css`
        border-radius: ${theme.spacing(4)};
        background-color: ${theme.palette.smoke.light};
        padding: 10px 28px 3px;
      `}>
        <Rating
          emptyIcon={
            <StarIcon css={css`
              color: ${theme.palette.common.white};
            `}/>
          }
          value={rate? rate : 0}
          onChange={(e, newValue) => {
            onChange(newValue? newValue : 0)
          }}
        />
      </div>
    </Stack>
  )
})
ReviewRating.displayName = 'ReviewRating'

const SubmitButton = memo(({listRating} : { listRating: ListReviewProps<number>[] }) => {
  const {t} = useTranslation(nsTransaction)
  return <GgjContainButton
    disabled={listRating.some(x => !x.rating)}
    css={css`flex: 1`}
    type="submit"
  >{t('34')}</GgjContainButton>
})
SubmitButton.displayName = 'SubmitButton'
const CommentComponent = ({ name, placeholder, register }: {name: string, placeholder: string, register: UseFormRegisterReturn }) => {
  const theme = useTheme()
  const {
    control,
    formState: { errors },
  } = useFormContext()
  return (
    <Controller
      name={name}
      control={control}
      rules={{maxLength: 1000}}
      render={({ field }) => {
        return (
          <>
            <TextareaAutosize
              {...field}
              {...register}
              css={css`
                border: ${errors[name] ? '1px solid red' : ` 1px solid ${theme.palette.smoke.light}`};
                background: ${theme.palette.canvas.light};
                border-radius: 10px;
                resize: none;
                min-height: 200px;
                line-height: 24px;
                width: 100%;
                margin: ${theme.spacing(3)} 0;
                padding: 16px;
              `}
              aria-label="maximum height"
              placeholder={placeholder}
              maxLength={1000}
            />
            <Stack direction="row" justifyContent='flex-end' alignItems="center">
              <GgjCountText name={name} max={1000} isError={Boolean(errors[name])} />
            </Stack>
          </>
        )
      }}
    />
  )
}
// Main component
export const PopupReview = () => {
  const theme = useTheme()
  const dispatch = useAppDispatch()
  const { t } = useTranslation(nsTransaction)
  const listReview: ListReviewProps<number>[] = useAppSelector((state) => state[ns]?.listReview)
  const mode = useAppSelector(state => state[ns]?.MENU_currentMode)

  const isShowPopupReview =  useAppSelector((state) => state[ns]?.DETAIL_isShowPopupReview)
  const chatInfo = useAppSelector((state) => state[ns]?.CHATINFO_info)
  const id = chatInfo?.id
  const [listRating, setListRating] = useState<any>([])

  const handleUpdateRating = (rating: number, index: number):void => {
    listRating[index] = {...listRating[index], rating}
    setListRating([...listRating])
  }
  const methods = useForm({
    mode: 'onTouched',
    criteriaMode: 'firstError',
    reValidateMode: 'onChange',
    defaultValues: {
      comment: '',
    },
  })
  const handClosePopup = ()=>{
    dispatch(actions.setIsShowPopupReview(false))
  }
  useEffect(() => {
    setListRating([...listReview])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listReview])

  useEffect(() => {
    if(!isShowPopupReview) methods.resetField('comment')
  }, [isShowPopupReview])
  if(!isShowPopupReview) return null

  const handleSubmitReview = async (objectReview: ReviewObject) => {
    try {
      loadingOnHandler()
      const {data, error}: any = await submitReviewTransactionById(id, objectReview)
      if (error) {
        toastHandler({message: t('28'),type: 'error'})
        return
      }
      dispatch(actions.setReviewAtTransaction(data?.data?.reviewAt || 0))
      dispatch(actions.setReview(data?.data as UsersReviewProps))
      handClosePopup()
    } catch (e) {
      toastHandler({type: 'error'})
    } finally {
      loadingOffHandler()
    }
  }
  const onSubmit: SubmitHandler<SubmitReviewProps> = async (data: SubmitReviewProps) => {
    const listRatingRefactor: RatesProps<number>[] = listRating.map((valuesRating: ListReviewProps<number>) => {
      return {
        reviewRequirementId: valuesRating.id,
        rate: valuesRating.rating
      }
    })
    const objectReview: ReviewObject = {
      rates: [...listRatingRefactor],
      comment: data?.comment || ''
    }
    await handleSubmitReview(objectReview)
  }

  return <Modal open={isShowPopupReview} onClose={handClosePopup}>
    <Stack css={css`
      width: 100%;
      height: calc(100% - 60px);
      margin: 60px auto 0;
      @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
        max-width: 500px;
        margin: 10vh auto;
        height: 80vh;
      }
    `}>
      <ModalHeader />
      {/* Modal body*/}
      <FormProvider {...methods}>
        <form css={css`
          background-color: ${theme.palette.common.white};
          height: min-content;
          max-height: calc(100% - 142px);
          @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
            border-radius: 0 0 10px 10px;
          }`} onSubmit={methods.handleSubmit(onSubmit)}>
          <Stack css={css`
            overflow: auto;
            height: calc(100% - 124px);
            padding: ${theme.spacing(4)} ${theme.spacing(5)} 0;
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              height: calc(100% - 76px);
            }
          `}>
            <Typography variant='h6' align='center'>
              {mode == TransactionType.Seller ?t('15') : t('48')}
            </Typography>
            {listRating.map((item: ListReviewProps<number>, idx: number) =>
              <ReviewRating
                key={idx}
                name={item.name}
                rate={item.rating}
                onChange={(newValue) => handleUpdateRating(newValue, idx)}/>
            )}
            <CommentComponent
              register={methods.register('comment', {required: ' ',})}
              name='comment'
              placeholder={mode == TransactionType.Seller ?t('16') : t('49')}
            />
          </Stack>
          <Stack css={css`
            flex-direction: column-reverse;
            column-gap: ${theme.spacing(4)};
            row-gap: ${theme.spacing(3)};
            padding: ${theme.spacing(3)} ${theme.spacing(5)};
            @media only screen and (min-width: ${theme.breakpoints.values.md}px) {
              flex-direction: row;
            }
          `}>
            <GgjOutlineButton
              css={css`flex: 1`}
              onClick={handClosePopup}
            >{t('17')}</GgjOutlineButton>
            <SubmitButton listRating={listRating}/>
          </Stack>
        </form>
      </FormProvider>
    </Stack>
  </Modal>
}
